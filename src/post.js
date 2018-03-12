import Editor from './editor';
import EXIF from 'exif-js';
import './post.less';
import {Brower} from './core';


var Post = Editor.extend({
  init(props){
    //debugger;
    props = Object.assign({},{
      tag_name:'editor-post-ovo'
      ,config : {
        TITLE_EMPTY:'标题不能为空'
        ,TITLE_TOO_LONG:'标题太长...'
        ,CONTENT_EMPTY:'编辑内容不能为空'
        ,PHOTO_TOO_MANY:'你传的照片太多了吧...'
        ,SMILE_TOO_MANY:'你发的表情太多了吧...'
        ,WORD_TOO_MANY:'你写的字数太多了吧...'
        ,PHONE_TOO_BIG:'图片太大了'
        ,SUCCESS:'发表成功'
        ,MAX_SMILES :20
        //,SMILE_MAX_LEN:30
        // ,PHOTO_MAX_LEN:6
        ,MAX_PHOTOES:6
        //,PHOTO_MAX_SIZE:1024*10
        ,MAX_CONTENT_WORDS:800
        ,MAX_TITLE_WORDS:50

        ,MAX_SIZE_PHOTO : 1024*1024*4
      }
    },props);
   
    this._super(props);

    this._map_base64 = Object.create(null);
    this.upload_pictures = [];


    this._handleChooseImg((img,props)=>{

      img.setAttribute('uid',props.uid);
    

      var html_ = this.$content.html().trim();

      var default_value = this.$content.attr('defaultValue').trim();

      if(html_===default_value) this.$content.html('');
      
      var img_wrap = document.createElement('p');
      img_wrap.appendChild(img);

      ////////////
      
      this._appendToLastModifiyEl(img_wrap);

      //////////
      props.base64 = img.src;

      this._map_base64[props.uid] = props;


      this._getUploadPictures();

      ///
      this._setLastEditEl(this.$content);
    });
    
    //console.log('post constructor');
  }
  ,_getUploadPictures(){
			
    var base64_imgs = [...$('img.from-input-ovo',this.el)];

    this.upload_pictures = [];
    base64_imgs.forEach((img,i)=>{
      var uid = img.getAttribute('uid');

      this.upload_pictures.push(this._map_base64[uid]);
    });


  //	console.log(this.upload_pictures);
  }
  ,_handleForThose(){
    this._super();
    
    this.$content.on('input',e=>{
      this._setLastEditEl(this._editLastChild());
      this._getUploadPictures();
      this._recordLastRange(0);
    });

    this.$content.on('touchend',e=>{
      this._recordLastRange(566);
    });

    this.$title.on('focus',this._handle_bug_focus.bind(this));
    this.$title.on('blur',this._handle_bug_blur.bind(this));


    {
      let i = 0;
      $(this.constructor.EL_SMILE_ICON,this.el).on('click',e=>{
        ++i%2!=0?this.emoji_panel.hide():this.emoji_panel.show();
      })
    }


  }
  ,_handleChooseImg(fn){

		
    var $chooseimg = $('.ej_comment__chooseimg',this.el);
  
    $chooseimg[0].addEventListener('change',()=>{
      ////////////////////////////////////
      
      let {name,type,size} = $chooseimg[0].files[0];

      //image/png image/jpeg

      if( !(/image\/(png|jpeg|gif)/.test(type) )) return this._displayMsg('请上传一张图片...');

      if(size > this.options.config.MAX_SIZE_PHOTO) return this._displayMsg('图片太大...');

      var img_orientation;

      EXIF.getData($chooseimg[0].files[0],function(){  
        EXIF.getAllTags(this);   
        img_orientation = EXIF.getTag(this, 'Orientation');  
      });  

      const frd = new FileReader();

      //console.log('filereader!');
      frd.addEventListener('load',()=>{
        const pic = document.createElement('img');
        //pic.classList.add('from-input-ovo');

        pic.addEventListener('load',()=>{
          
          let s = pic.width/pic.height;

          //alert(pic.width);

          //pic.width = min(pic.width,innerWidth*.777);
          
          const dp = 2;
        
          //pic.width = innerWidth*.777   *dp;
          pic.width = innerWidth*.8   *dp;

          let cv = document.createElement('canvas');
          let c = cv.getContext('2d');
          
          if(Brower.version.ios&&img_orientation===6){
            //alert('rotating!!!');
            cv.width=pic.width/s,cv.height= pic.width;
            //
            let scale_to_max = pic.width/cv.width;
            //50 --- 60
            //
            cv.width*=scale_to_max,cv.height*=scale_to_max;

            let tx = cv.width*.5
              ,ty = cv.height*.5
              ,x=tx,y=ty;
            c.translate(x,y);
            c.rotate(PI*.5);
            c.drawImage(pic
              ,-ty,-tx
              ,pic.width*scale_to_max,(pic.width/s)*scale_to_max
            );
          }else{
            cv.width = pic.width,cv.height = pic.width/s;
            c.drawImage(pic,0,0,cv.width,cv.height);
          }
      

          let pic_ = document.createElement('img');
          const quality = .93;

          pic_.width = cv.width*(1/dp),pic_.height = cv.height*(1/dp);

          //pic_.setAttribute('unselectable','on');
          pic_.setAttribute('quality-ovo',quality);	
          pic_.setAttribute('suffix-ovo',type.match(/image\/(\w+)/)[1]);
          pic_.classList.add('from-input-ovo');
          pic_.onload = ()=>fn(pic_,{name,type, uid:`uid-${(Math.random()+'').slice(2)}`});
          pic_.src = cv.toDataURL(type,quality);
          //pic_.src = require('./common/img/a.jpg');

        });
        pic.src = frd.result;

      });
      
      frd.readAsDataURL($chooseimg[0].files[0]);

      ///////////////////////////////////


    });

  }
  ,_bindDefaultValue(){
    this._super();

    var that = this;
    this.$title.on('blur',function(e){
      
      //that.$bot_pick.show();
      that.emoji_panel.show();
      //#adadad
      var html_ = this.value.trim();
    
      var default_value = this.getAttribute('defaultValue').trim();
      
      //console.log(html_,default_value, html_===default_value);
      //ios 还会带上<br>。。。。。
      //alert(`blur:${html_},length:${html_.length}`);
      if(html_==='' || html_ === '<br>' ){
        this.value = default_value;
        this.classList.add('default_value-ovo-2');
      }

    });

    this.$title.on('focus',function(e){
     
      //that.$bot_pick.hide();
      that.emoji_panel.hide();

      this.classList.remove('default_value-ovo-2');

      var html_ = this.value.trim();

      var default_value = this.getAttribute('defaultValue').trim();

      if(html_===default_value) this.value = '';
    });
  }
  // send
  ,_editSuccess(){
    
    
    var {config} = this.options;
    // TITLE_EMPTY:'标题不能为空'
    // ,TITLE_TOO_LONG:'标题太长...'
    // ,CONTENT_EMPTY:'编辑内容不能为空'
    // ,PHOTO_TOO_MANY:'你传的照片太多了吧...'
    // ,SMILE_TOO_MANY:'你发的表情太多了吧...'
    // ,WORD_TOO_MANY:'你写的字数太多了吧...'
    // ,PHONE_TOO_BIG:'图片太大了'
    // ,SUCCES:'发表成功'
    // ,MAX_SMILES :20
    // //,SMILE_MAX_LEN:30
    // // ,PHOTO_MAX_LEN:6
    // ,MAX_PHOTOES:6
    // //,PHOTO_MAX_SIZE:1024*10
    // ,MAX_CONTENT_WORDS:800
    // ,MAX_TITLE_WORDS:50

    // ,MAX_SIZE_PHOTO : 1024*1024*4
    return new Promise(r=>{
      var that = this;
      var v_='';
      var v2_='';
      var handle = (function(){
        var v = that.$title.val().trim();

        if(!v.length ||  v===that.$title.attr('defaultValue')){

          return that._displayMsg(config.TITLE_EMPTY);

        }
  
        return 'nextSuccessor';

      })
      .after(function(){
        var v = that.$title.val().trim();
        if(v.length >config.MAX_TITLE_WORDS){
          return that._displayMsg(config.TITLE_TOO_LONG);
        }
        return 'nextSuccessor';
      })
      .after(function(){
        var photo_len = $('.from-input-ovo',that.$content).length;
        var smile_len = $('.smile-ovo',that.$content).length;
        var v = that.$content[0].textContent.trim();
   
        if( (!v.length ||  v===that.$content[0].getAttribute('defaultValue') ) &&
        !photo_len && !smile_len
        ){
          return that._displayMsg(config.CONTENT_EMPTY);
        }
        return 'nextSuccessor';
      })
      .after(function(){
        var smile_len = $('.smile-ovo',that.$content).length;

        //CONSOLE.LGO
        //console.log('smile_len:',smile_len);

        if(smile_len>config.MAX_SMILES) return that._displayMsg(config.SMILE_TOO_MANY);

        return 'nextSuccessor';
      })
      .after(function(){
        var photo_len = $('.from-input-ovo',that.$content).length;

        if(photo_len>config.MAX_PHOTOES) return that._displayMsg(config.PHOTO_TOO_MANY);

        return 'nextSuccessor';
      })
      .after(function(){
        var v = that.$content[0].textContent.trim();
        if(v.length >config.MAX_CONTENT_WORDS){
          return that._displayMsg(config.WORD_TOO_MANY);
        }

        return 'nextSuccessor';
      })
      .after(function(){
        r({
          html_title: that._resAdapter(that.$title.val().trim())	
          ,html_content:that._resAdapter(that.$content[0].innerHTML.trim())
          ,text_content: that._resAdapter(that.$content[0].textContent.trim()) 
        
        });
      });

      handle();  
    })

  }

  ,clear(){
    this._super();
    this.$title.val(this.$title.attr('defaultValue'));
    this.$title[0].classList.add('default_value-ovo-2');

    this.upload_pictures = [];

  }
  ,_handleConfirm(){
   

    $(this.constructor.EL_CONFIRM).on('click',e=>{
      
      this._editSuccess().then(res=>{

        //debugger;
      
        var {text_content,html_content,html_title} = res;
  
        this.trigger('complete',{
           html_content,text_content,html_title
           ,upload_pictures:this.upload_pictures
          ,el_target:this.el_target
          ,edit_time:Date.now()
        });

      });

    })
  }
  ,_createChild(){
    this._super();
    //editor-reply-ovo
    this.el.classList.add(this.constructor.CLS);
    
    // ,CLS_DEFAULT_VALUE:'default_value-ovo'
    // ,EL_CONTENT:'div[content-ovo]'
    // ,EL_CANCEL:'button[cancel-ovo]'
    // ,EL_CONFIRM:'button[confirm-ovo]'
    // ,EL_SMILE:'div[smile-holder-ovo]'
    // ,EL_SMILE_ICON:'li[smile-icon-ovo]'
    // ,EL_DISPLAY_MSG:'div[message-ovo]'
    this.el.innerHTML = `
      <div class="ej_wrap rel">
        <div class="abs wh">
          <div class="ej_comment__input">
            <div class="ej_comment__title rel">
              <input title-ovo type="text" defaultValue="加个标题哟~" />
            </div>
            <div content-ovo class="ej_comment__content" contenteditable="true" defaultValue="尽情发挥吧..."><p></p></div>
          </div>
          <div class="ej_comment__bot rel">
            <ul>	
              <li smile-icon-ovo title="添加表情"></li>
              <li title="添加图片"><input class="ej_comment__chooseimg" type="file"/></li>
            </ul>
            <button confirm-ovo class="ej_comment__pub rel">
              <span class="abs wh">发表</span>
            </button>
            <button cancel-ovo class="ej_comment__cancel rel">
              <span class="abs wh">取消</span>
            </button>
          </div>
        </div>
        
      </div>

      <div class="smile-holder" smile-holder-ovo>
        
      </div>

      <div class="ej-comment__msg abs" message-ovo>
        <div class="abs wh">
          <span>输入几个字？</span>
        </div>
      </div>
    `;

    this.$content = $(this.constructor.EL_CONTENT,this.el);
    this.$title = $(this.constructor.EL_TITLE,this.el);

    this.$msg_holder = $(this.constructor.EL_DISPLAY_MSG,this.el)
    this.$msg_text = $('span',this.$msg_holder);
    

  }
},{
  CLS:'editor-post-ovo'
  ,EL_TITLE:'input[title-ovo]'
});


new Post({
  $el_active:'#post-el'
  ,convert_into_entities : true
  ,onComplete(props){
    console.log(props);

    //this.clear();
    //this.hide();

  }
})




export default function(props){

  return new Post(props);
}