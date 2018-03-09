




import './main1.less';

import 'miku-css-normalize';


// import AlloyLever from 'alloylever'



//web/component/nico-cli template  #node server,webpack
//web/src-common webpack --modulename xx --publish

import './editplace.less';

// import './ej_comment.less';

import './base';
import './pub.less';
import './reply.less';

import Swiper from './swiper.min';
import './swiper.min.css';

import './smile.less';

import Cache from './cache';
import EXIF from 'exif-js';


// import Reply from './reply';
// import Pub from './pub';


const Ej = Object.create(null);

// Ej.Pub = Pub;
// Ej.Reply = Reply;


{

//   $.getJSON('http://www.xy.com/h5/fourm/posting?callback=?',{
//     gid: 2
//     ,content: 'content-😁😁😁'
//     ,pictures:[]
//     ,text:'text-😁😁😁'
//     ,title: 'tilte-😁😁😁'
// });


  
  // var s = 'aa😁';
  // console.log(s,s.slice(0,4));

  addEventListener('touchstart',e=>{
   //console.log(e.target);
  });



  let Event =  Class.extend({
    init : function(){
      this.evs = {};
    },
    on : function(s,fn,once){
      s = s.trim();
      if(once && once.trim() == 'once'){
        this.evs[s] = [fn];
        
        return this;
      };
      
      if(!this.evs[s]){
        this.evs[s] = [fn];
        return this;
      };
      this.evs[s].push(fn);
      return this;
    },
    trigger : function(s){
      var that = this,
        args = arguments,
        ar = this.evs[s = s.trim()];
      
      //tirgger('aaa' , a,b,c)
      ar && ar.forEach(function(fn){
        fn.apply(that , [].slice.call(args,1));
      });
      
      return this;
    },
    off : function(s){
      delete this.evs[s.trim()];
      return this;
    }
  });

  let Smile = Event.extend({
    init(parent_el,{padding="0 10%",bottom="-23%"}={}){
      this._super();

      this._delay_handles = [];
			this._itv_check;
      this.uid = (random()+'').slice(2);
      
			this.swiper_cls = `swiper-uid${this.uid}`;
			this.swiper_pagination_cls = `swiper-pagination-uid${this.uid}`;

			this._createChild();
			parent_el.appendChild(this.el);
			this._createSmile();

     
      this._applySwiper(bottom);
      

			//this.hide();

			this._checkDelayHandle();
    }
    ,hide(){
      this.el.style.display = 'none';
		}
		,show(){
      this.el.style.display = 'block';
      
		}
		,_applySwiper(bottom){

     // debugger;


			try{
				new Swiper('.'+this.swiper_cls, {
					pagination : '.'+this.swiper_pagination_cls
					//autoplay: 5000,//可选选项，自动滑动
					,onSlideChangeEnd: function(swiper){
						//alert(swiper.activeIndex) //切换结束时，告诉我现在是第几个slide
						//console.log(swiper.activeIndex);
					}
					,onPaginationRendered:function(swiper, paginationContainer){
						var $pagination = $(swiper.originalParams.pagination);
            $pagination.css({'transition':'none', bottom});
            
            //console.log(bottom);

					}
					,onInit: function(swiper){
						//Swiper初始化了
						//alert(swiper.activeIndex);提示Swiper的当前索引
						//var el = document.querySelector(swiper.originalParams.pagination);
						var $container = $(swiper.container);
            
           
						$container.css({
              overflow:'visible'
							//overflow:'hidden'
							//,overflowY:'auto'
						});

					}
				})
			}catch(e){
				alert(e);
			}
			 
		}
		,_addDelayHandle(ms=333,handle){
			this._delay_handles.push({ms,handle});

		}
		,_checkDelayHandle(ms=566){
			var that = this;
			;(function check(){
				that._itv_check = setTimeout(check,ms);
				if(!that._delay_handles.length) return;
				var o = that._delay_handles.shift();
				//console.log('delay#',handle);
				o.handle.call(that);
      })();
      

		}
		,_createSmile(){
			var $wrapper = this.el.querySelector('.swiper-wrapper');

			const CONFIG = {
				W:30,H:1500,CEIL:6,ROW:3
				,CLS_SMILE:'smile-ovo'
				,CLS_GROUPS:'smile-panel__groups swiper-slide'
			}
			CONFIG.GROUPS = CONFIG.CEIL*CONFIG.ROW;

			const TOTAL = CONFIG.H/CONFIG.W;
      const GROUP_NUM = ceil(TOTAL/ (CONFIG.GROUPS) );
      
      // addEventListener('click',e=>{
      //   console.log('_createSmile#',e.target);
      // });

			[...Array(GROUP_NUM)].map((v,i)=>{
				
				var ul = document.createElement('ul');
				$wrapper.appendChild(ul);
				ul.className = CONFIG.CLS_GROUPS;
			//	ul.style.padding = padding;

				let start_i = i*CONFIG.GROUPS;
				//console.log(start_i);
				for(let i = 0;i<CONFIG.ROW;i++){
					for(let j = 0;j<CONFIG.CEIL;j++){

						let li = document.createElement('li');	
						let count = start_i + i*CONFIG.CEIL+j;
						if(count >= TOTAL) continue;

						//49
						//console.log(TOTAL,  count);
						li.setAttribute('data-smile-idx',`${i},${j},${count}`); 
						//li.setAttribute('unselectable','on'); 
						ul.appendChild(li); 
						//li.className = 'smile-ovo';
						li.style.backgroundPosition = `0 ${count*CONFIG.W*-1}px`;
						Object.assign(li,{smile_idx:count});	


						li.addEventListener('click',(e)=>{
              

							this._addDelayHandle(333,function(){
     
								var num_of_pic=  count+1;
								num_of_pic<10&&(num_of_pic='0'+num_of_pic);
							//	console.log(li,num_of_pic);
								var img = document.createElement('img');
								img.className =  CONFIG.CLS_SMILE;
								img.onload = ()=> this.trigger('pick',{el:img,smile_idx:count});

								//Cache[`popo_2adefed_${num_of_pic}.png`]
								//img.src = `./src/common/img/popo_2adefed/popo_2adefed_${num_of_pic}.png`;
								img.src = Cache[`./popo_2adefed_${num_of_pic}.png`];
								e.preventDefault();

							});

							

	
						})
						
					


					}
				}

			})

			//7,3,21
		}
		,_createChild(){

			this.el.innerHTML = `
				<div class="swiper-container ${this.swiper_cls}">
					<div class="swiper-wrapper">
					
					</div>
					<div class="swiper-pagination ${this.swiper_pagination_cls}"></div>
				</div>
			`;
		}
		,el:document.createElement('smile-panel')
  });


  let Editor = Event.extend({
    init(el_active,{tag_name=`div`,z_index=10,auto_clear,auto_hide,el_parent=document.body}={}){

      this._super();

      this._last_el;
      this._itv_pub;
      this._tag_name=tag_name;


      this._el_active = el_active;
      this._auto_clear = auto_clear;
      this._auto_hide = auto_hide;

      this._z_index=z_index;
      this._el_parent = el_parent;

			this._selection = window.getSelection();
			this._itv_range;
			this._last_edit_range;
      
      this._createChild();

      //this.hide();
     

      //this._run();
			return this;
    }
    ,_run(){

      $(this.el).css({
        width:this._el_parent.offsetWidth+'px'
        ,height:this._el_parent.offsetWidth+'px'
				,zIndex:this._z_index
      });

      this._setLastEditEl(this.$content);

      this._bindDefaultValue();
      
      //this._handlePost();

      //this.hide();
    }
    ,_editLastChild(){
			var child = this.$content[0].children;
			if(!child) return this.$content;

			var i = 0;

			//如是图片,但是是最后一个child那么也是插入到$content中！
			var f = (child,idx)=>{
				if(++i>100000) return alert('查找次数过多qwq');

				if(idx<0 || !child) return this.$content;
				
				var node_name = child[idx].nodeName.toLowerCase();

				//ios输入的内容空也存在个br
				if(node_name==='br'&&idx===child.length-1) return this.$content;
				//
				if(node_name ==='img'&&idx===child.length-1) return (this.$content);
				//if(node_name ==='img'&& child[idx].classList.contains('smile-ovo')) return this.$content;
				if(node_name !='img') return $(child[idx]);
			
				return f(child,--idx);
				
			}

			return f(child,child.length-1);

		}
    ,_setLastEditEl($last_el){
			this._last_el = $last_el;

    }
    ,_pickSmileHandle({padding="0 10%",bottom="-23%"}){
      //this.$content;
      //console.log(this.el.querySelector('div[smile-holder]'));

      this.smile = new Smile(this.el.querySelector('div[smile-holder]'),{bottom,padding} );
      this.smile.show();

      // this.$smile_li = $('li[smile-btn]',this.el);
      
      // {
      //   this.$smile_li.idx=0;
      //   this.$smile_li.on('click',e=>{
      //     //debugger;
      //     //console.log(this.smile);
      //     ++this.$smile_li.idx%2===0?this.smile.hide():this.smile.show();
      //   });
      // }

    // return;
      
      {
        
        this.smile.on('pick',(props)=>{

          ///////////////////////////////////////////////
          var html_ = this.$content.html().trim();

          var default_value = this.$content.attr('defaultValue').trim();
          
          if(html_===default_value) this.$content.html('');
          
          this._appendToEditEl(props.el);

        
        });
      }

    }
    ,_appendToEditEl(el){
			if(!this._last_edit_range) return this._last_el.append(el);

			var [node_type,node_name] = [
				this._last_edit_range.startContainer.nodeType
				,this._last_edit_range.startContainer.nodeName.toLowerCase()
			];

			if(node_type===1&&node_name==='li') return console.log('qwq');

			this._last_edit_range.insertNode(el);
			//false,true  锚点before|after
			this._last_edit_range.collapse(false);
			this._selection.removeAllRanges();
			this._selection.addRange(this._last_edit_range);

		}
    ,_createChild(){
      //throw 'rewrite _createChild';
      
      
      this.el = document.createElement(this._tag_name);
      this._el_parent.appendChild(this.el);


      //console.log(1);
    }
    ,clear(){
      throw 'rewrite clear';
    }
   ,_handleEdit(){
      throw 'rewrite _handlePost';
   }
    ,_bindDefaultValue(){
      throw 'rewrite _bindDefaultValue';
    }
    ,_focus(diff_offset=0){
			this.$content[0].focus();
			
			if(!this._last_edit_range ) return;

			var range = this._last_edit_range;
			var {startContainer,startOffset} = range;

			range.setStart(startContainer, startOffset+diff_offset);
			range.collapse(true);
		
			this._selection.removeAllRanges();
			this._selection.addRange(range);
    }
    ,_recordLastRange(ms=0){

			clearTimeout(this._itv_range);
			this._itv_range = setTimeout(()=>{
				if(!this._selection.rangeCount) return;

				var range = this._selection.getRangeAt(0);

				this._selection.removeAllRanges();
				this._selection.addRange(range);
				this._last_edit_range = range;

			},ms);
    }
    ,_showMsg(msg,{}={}){

      this.$msg_text.text(msg+'');

      clearTimeout(this._itv_pub);

      this.$msg.css({
        transition:'none'
        ,transform:'translate3d(0,0%,0)'
			});

      this._itv_pub = setTimeout(()=>{

        this.$msg.css({
          transition:'none'
          ,transform:'translate3d(0,-90%,0)'
        });

      },2333);
		}
    ,hide(){
			this.el.style.display='none';
			//debugger;
		}
		,show(){
			this.el.style.display='block';
		}

  });

  
  let Pub = Editor.extend({
    init(el_active,{tag_name,z_index=10,img_max_size=1024*1024*4,auto_clear=false,auto_hide=false,el_parent}={}){
 
      this._super( el_active, {tag_name:'ej-comment',z_index,el_parent,auto_clear,auto_hide});

      this._img_max_size = img_max_size;
      this._base64_map = Object.create(null);
			this.upload_pictures = [];

      //debugger;

      this._run();
      
      this._pickSmileHandle({bottom:'-30%'});

      this._handleEdit();

      this.hide();

    }

    ,_run(){
      this._super();

      this._chooseImgHandle((img,props)=>{

				// let s = img.width/img.height;
        // img.width = min(img.width,innerWidth*.666);     
				img.setAttribute('uid',props.uid);
        //img.width = innerWidth*.5;

        var html_ = this.$content.html().trim();

        var default_value = this.$content.attr('defaultValue').trim();

				if(html_===default_value) this.$content.html('');
				
        var img_wrap = document.createElement('p');
        
				img_wrap.appendChild(img);
				//this.$content.append(img_wrap);

				////////////
				
				this._appendToEditEl(img_wrap);

				//////////



				props.base64 = img.src;

				this._base64_map[props.uid] = props;
				
				//console.log(	this._base64_map);
				//debugger;

				this._getUploadPictures();

				///
				this._setLastEditEl(this.$content);
			});

      {
				
        //debugger;
       
				$(this._el_active).on('click',e=>{

          this.el_target = e.target;

          

          //console.log(this.el_target);
         
					//this.el_active = e.target;

          this.show();
					this._focus();
         
				});


				$('.ej_comment__cancel',this.el).on('click',e=>{
					this.hide();
				})
			}
			


			{

				let handle_focus = (e)=>{
					//alert(K.Brower.version.ios);
					if(K.Brower.version.ios){
					
						$(this.el).css({
							width:document.body.offsetWidth+'px'
							,height:document.body.offsetHeight+'px'
							,position:'absolute'
							,left:'0',top:'0','z-index':this._z_index
						});
					}else{
						$(this.el).css({
							position:'fixed'
							,left:'0',top:'0','z-index':this._z_index
						});
					}
					document.body.scrollTop = 0;
					document.documentElement.scrollTop = 0;
				}
				
				let handle_blur = (e)=>{
					if(K.Brower.version.ios){
						$(this.el).css({	position:'fixed',left:'0',top:'0','z-index':this._z_index	});
					}	
				}
			
				this.$content[0].addEventListener('focus',handle_focus);
				this.$content[0].addEventListener('blur',handle_blur);

				this.$ipt.addEventListener('focus',handle_focus);
				this.$ipt.addEventListener('blur',handle_blur);
	
				this.$content[0].addEventListener('input',e=>{

					//alert(this.$content[0].innerHTML.length)

					this._setLastEditEl(this._editLastChild());
					this._getUploadPictures();
					this._recordLastRange(0);

				});
				this.$content[0].addEventListener('touchend',e=>{
					this._recordLastRange(566);
					
				});


      }
      
      

    }
    ,_chooseImgHandle(fn){

		
			var $chooseimg = $('.ej_comment__chooseimg',this.el);
		
			$chooseimg[0].addEventListener('change',()=>{
				////////////////////////////////////
				
				let {name,type,size} = $chooseimg[0].files[0];

				//image/png image/jpeg

				if( !(/image\/(png|jpeg|gif)/.test(type) )) return this._showMsg('请上传一张图片...');

				if(size > this._img_max_size) return this._showMsg('图片太大...');

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
						
						if(K.Brower.version.ios&&img_orientation===6){
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
						pic_.onload = ()=>fn(pic_,{name,type, uid:`uid-${(random()+'').slice(2)}`});
						pic_.src = cv.toDataURL(type,quality);
						//pic_.src = require('./common/img/a.jpg');

					});
					pic.src = frd.result;

				});
				
				frd.readAsDataURL($chooseimg[0].files[0]);

				///////////////////////////////////


      });
      
		}
    ,_getUploadPictures(){
			
			var base64_imgs = [...$('img.from-input-ovo',this.el)];

			this.upload_pictures = [];
			base64_imgs.forEach((img,i)=>{
				var uid = img.getAttribute('uid');

				this.upload_pictures.push(this._base64_map[uid]);
			});

		//	console.log(this.upload_pictures);
		}
    ,_createChild(){
      this._super();
      this.el.innerHTML = `
        <div class="ej_wrap rel">
          <div class="abs wh">
            <div class="ej_comment__input">
              <div class="ej_comment__title rel">
                <input type="text" defaultValue="加个标题哟~" />
              </div>
              <div class="ej_comment__content" contenteditable="true" defaultValue="尽情发挥吧..."><p></p></div>
            </div>
            <div class="ej_comment__bot rel">
              <ul>	
                <li title="添加表情" smile-btn></li>
                <li title="添加图片"><input class="ej_comment__chooseimg" type="file"/></li>
              </ul>
              <button class="ej_comment__pub rel">
                <span class="abs wh">发表</span>
              </button>
              <button class="ej_comment__cancel rel">
                <span class="abs wh">取消</span>
              </button>
            </div>
          </div>
          
        </div>

        <div class="smile-holder" smile-holder>
          
        </div>

        <div class="ej-comment__msg abs">
          <div class="abs wh">
            <span>输入几个字？</span>
          </div>
        </div>
      `;

      this.$ipt = $('input',this.el)[0];

      this.$pub = $('.ej_comment__pub',this.el);
      this.$content = $('.ej_comment__content',this.el);
      
      this.$bot_pick = $('.ej_comment__bot ul',this.el);

      this.$msg = $('.ej-comment__msg',this.el);
      this.$msg_text = $('.ej-comment__msg span',this.el);
    }
    ,clear(init_clear=false){
     
      
      
      this.$content.html(this.$content.attr('defaultValue')  );
			this.$ipt.value = this.$ipt.getAttribute('defaultValue');

      this.$content[0].classList.add('default_value-ovo');
      this.$ipt.classList.add('default_value-ovo-2');



      //if(init_clear) return;
      clearTimeout(this._itv_pub);
      // this.$msg[0].classList.remove('ej-comment__msg--show');
      // this.$msg[0].classList.add('ej-comment__msg--hide');
      this.$msg.css({
        transition:'none'
        ,transform:'translate3d(0,-90%,0)'
      });
      
			this.upload_pictures = [];

		}
    ,_bindDefaultValue(){
      
      var that = this;

      this.clear(true);
			//debugger;
			//this.$content;
      //let itv;
      
      
			this.$content[0].addEventListener('blur',function(e){
		
        var html_ = this.innerHTML.trim();

        var default_value = this.getAttribute('defaultValue').trim();
        
        //console.log(html_,default_value, html_===default_value);
        //ios 还会带上<br>。。。。。
        //alert(`blur:${html_},length:${html_.length}`);
        
        if(html_==='' || html_ === '<br>' ){
          this.innerHTML = default_value;
          this.classList.add('default_value-ovo');
        }
			
			
			});


			this.$content[0].addEventListener('focus',function(e){
        this.classList.remove('default_value-ovo');
			
				var html_ = this.innerHTML.trim();

				var default_value = this.getAttribute('defaultValue').trim();

				if(html_===default_value) this.innerHTML = '';

			});


			this.$ipt.addEventListener('blur',function(e){
				that.$bot_pick.show();
				that.smile.show();
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
			this.$ipt.addEventListener('focus',function(e){

				that.$bot_pick.hide();
				that.smile.hide();
				


        this.classList.remove('default_value-ovo-2');

				var html_ = this.value.trim();

				var default_value = this.getAttribute('defaultValue').trim();

				if(html_===default_value) this.value = '';
			});
			
			
    }
    ,_handleEdit(){
			var $pub = $('.ej_comment__pub',this.el);
			var $content = $('.ej_comment__content',this.el);
			//debugger;
      

			$pub.on('click',e=>{


				this._handlePost().then(res=>{
					if(this._auto_hide) this.hide();

					try{
							//debugger;
						var {html_title,html_content,text_content,edit_time} = res;

						this.trigger('complete',{
							el:$content[0],html_title,text_content, html_content,edit_time,upload_pictures:this.upload_pictures
							,el_target:this.el_target
						});
						
            if(this._auto_clear) this.clear();
            
					}catch(e){
						alert(e);
					}
					
          
				});


			});
			
		}
    ,_handlePost(){

      const PUB_CONFIG = {
				TITLE_EMPTY:'标题不能为空'
				,TITLE_TOO_MATCH:'标题太长...'
        ,CONTENT_EMPTY:'编辑内容不能为空'
        ,PHOTO_TOO_MATCH:'你传的照片太多了吧...'
        ,SMILE_TOO_MATCH:'你发的表情太多了吧...'
				,WORD_TOO_MATCH:'你写的字数太多了吧...'
				,PICTURE_TOO_BIG:'图片太大了'
        ,EDIT_SUCCES:'发表成功'
        ,SMILE_MAX_LEN:20
        //,SMILE_MAX_LEN:30
        // ,PHOTO_MAX_LEN:6
				,PHOTO_MAX_LEN:6
				//,PHOTO_MAX_SIZE:1024*10
				,WORD_MAX_LEN:800
				,TITLE_MAX_LEN:50
      }

			return new Promise(r=>{
				var that = this;
				var v_='';
				var v2_='';
				var handle = (function(){
          var v = that.$ipt.value.trim();



          if(!v.length ||  v===that.$ipt.getAttribute('defaultValue')){

						return that._showMsg(PUB_CONFIG.TITLE_EMPTY);
					}
			
					return 'nextSuccessor';

				})
				.after(function(){
					var v = that.$ipt.value.trim();
					if(v.length >PUB_CONFIG.TITLE_MAX_LEN){
						return that._showMsg(PUB_CONFIG.TITLE_TOO_MATCH);
					}
					return 'nextSuccessor';
				})
				.after(function(){
					var photo_len = $('.from-input-ovo',that.$content).length;
					var smile_len = $('.smile-ovo',that.$content).length;
					var v = that.$content[0].textContent.trim();

					//console.log(v,that.$content[0].getAttribute('defaultValue') ,v===that.$content[0].getAttribute('defaultValue'));			
					
					
					if( (!v.length ||  v===that.$content[0].getAttribute('defaultValue') ) &&
					!photo_len && !smile_len
					){
						return that._showMsg(PUB_CONFIG.CONTENT_EMPTY);
					}
					return 'nextSuccessor';
				})
				.after(function(){
					var smile_len = $('.smile-ovo',that.$content).length;

          //CONSOLE.LGO
          //console.log('smile_len:',smile_len);

          if(smile_len>PUB_CONFIG.SMILE_MAX_LEN) return that._showMsg(PUB_CONFIG.SMILE_TOO_MATCH);

					return 'nextSuccessor';
				})
				.after(function(){
					var photo_len = $('.from-input-ovo',that.$content).length;

					if(photo_len>PUB_CONFIG.PHOTO_MAX_LEN) return that._showMsg(PUB_CONFIG.PHOTO_TOO_MATCH);
	
					return 'nextSuccessor';
				})
				.after(function(){
					var v = that.$content[0].textContent.trim();
					if(v.length >PUB_CONFIG.WORD_MAX_LEN){
						return that._showMsg(PUB_CONFIG.WORD_TOO_MATCH);
					}

					return 'nextSuccessor';
				})
				.after(function(){
          r({
						html_title:that.$ipt.value.trim() 		
						,html_content:that.$content[0].innerHTML.trim()
						,text_content:that.$content[0].textContent.trim()
						
            ,edit_time:Date.now()
          });
				});

				handle();
				
			});
    }
    
  });



  let Reply = Editor.extend({
    init(el_active,{tag_name,z_index=10,auto_clear=false,auto_hide=false,el_parent}={}){

      this._super( el_active, {tag_name:'ej-reply',z_index,el_parent,auto_clear,auto_hide});

      this._run();
    
      this._pickSmileHandle({padding:'0 9%'});

      this._handleEdit();

      this.hide();

    }
    ,_run(){

      this._super();

			{
				$(this._el_active).on('click',e=>{
					this.el_target = e.target;

          this.show();
					// this.$content[0].focus();
					this._focus();
				});


				this.$content[0].addEventListener('focus',e=>{
					//alert('content focus');
					if(K.Brower.version.ios){
						$(this.el).css({
							width:document.body.offsetWidth+'px'
							,height:document.body.offsetHeight+'px'
							,position:'absolute'
							,left:'0',top:'0','z-index':this._z_index
            });
            
					}else{
						$(this.el).css({
							position:'fixed'
							,left:'0',top:'0','z-index':this._z_index
						});
					}

					document.body.scrollTop = 0;
					document.documentElement.scrollTop = 0;
					//debugger;
				});
				this.$content[0].addEventListener('blur',e=>{
					//alert('blur')
					//$(this.el).css({position:'fixed',left:'0',top:'0'});
					if(K.Brower.version.ios){
						$(this.el).css({	position:'fixed',left:'0',top:'0','z-index':this._z_index});
					}
				});
				
				
				this.$content[0].addEventListener('input',e=>{
					
					this._recordLastRange(0);

				});
				this.$content[0].addEventListener('touchend',e=>{

					this._recordLastRange(566);		

				});

				$('.ej-reply__cancel',this.el).on('click',e=>{
					this.hide();
        });
        
			}

    }
    ,_pickSmileHandle(bottom,padding){
      this._super(bottom,padding);

      var $smile_li = $('li[smile-btn]',this.el);  

      var $holder = $('.ej-reply__smile-holder',this.el);
      
      $holder.hide();
      
			{
				let i = 0;
				$smile_li.on('click',e=>{
					++i%2===0?$holder.hide():$holder.show();
				})
			}



    }
    ,_createChild(){
      this._super();

      // smile-btn
      // smile-holder
      this.el.innerHTML = `
				<div class="ej_replay__wrap">
					<div class="ej_reply__content-wrap rel">
						<div class="ej_reply__content abs wh" contenteditable="true" defaultValue="回复你的内容吧..." ></div>
					</div>
					<div class="ej-reply__bot rel">
						<div class="abs wh">

							<ul>
								<li smile-btn></li>
							</ul>

							<div>
								<button class="rel ej-reply__cancel"><span class="abs wh">取消</span></button>
								<button class="rel ej-reply__pub"><span class="abs wh">发表</span></button>
							</div>
						</div>
					</div>
					<div class="ej-reply__smile-holder rel">
						<div class="ej-reply__smile-inner abs" smile-holder>

						</div>
          </div>

          <div class="ej-reply__msg abs">
            <div class="abs wh" >
              <span>输入几个字？</span>
            </div>
          </div>

				</div>
				
			`;

      this.$content = $('.ej_reply__content',this.el);
      this.$msg_text = $('.ej-reply__msg span',this.el);
      this.$msg = $('.ej-reply__msg',this.el);
    }
    ,_handlePost(){
      
      const PUB_CONFIG = {
        TITLE_EMPTY:'回复内容不能为空'
        ,EDIT_SUCCES:'回复成功'
        ,WORD_TOO_MATCH:'你写的字数太多了吧...'
        ,SMILE_TOO_MATCH:'你发的表情太多了吧...'

        ,WORD_MAX_LEN:500
        ,SMILE_MAX_LEN:20
      }

      return new Promise(r=>{
        var that = this;

        var v_='';
        var handle = (function(){
          var v = that.$content[0].innerHTML.trim()

          if(!v.length ||  v===that.$content[0].getAttribute('defaultValue')){

            return that._showMsg(PUB_CONFIG.TITLE_EMPTY);
          }
          
          
          return 'nextSuccessor';
        })
        .after(function(){
          var smile_len = $('.smile-ovo',that.$content).length;

          //CONSOLE.LGO
          //console.log('smile_len:',smile_len);

          if(smile_len>PUB_CONFIG.SMILE_MAX_LEN) return that._showMsg(PUB_CONFIG.SMILE_TOO_MATCH);

          return 'nextSuccessor';
        })

        .after(function(){
          var v = that.$content[0].textContent.trim();
          if(v.length >PUB_CONFIG.WORD_MAX_LEN){
            return that._showMsg(PUB_CONFIG.WORD_TOO_MATCH);
          }

          return 'nextSuccessor';
        })
        .after(function(){
        

          r({
            html_content:that.$content[0].innerHTML.trim()
            ,text_content:that.$content[0].textContent.trim()

            //html_title:that._utf16toEntities(that.$content[0].innerHTML.trim())  
            //,text_content:that._utf16toEntities(that.$content[0].textContent.trim())  
            
            ,edit_time:Date.now()
          });


    
        });

        handle();


      })
    }
    ,_bindDefaultValue(){
     
      this.$content.html(this.$content.attr('defaultValue')  );
      this.$content[0].classList.add('default_value-ovo');

      this.$content[0].addEventListener('blur',function(e){
        //console.log('blur');
        var html_ = this.innerHTML.trim();

        var default_value = this.getAttribute('defaultValue').trim();
        
        //console.log(html_,default_value, html_===default_value);
        //ios 还会带上<br>。。。。。
        //alert(`blur:${html_},length:${html_.length}`);
        if(html_==='' || html_ === '<br>' ){
          this.innerHTML = default_value;
          this.classList.add('default_value-ovo');
        }
      });

      this.$content[0].addEventListener('focus',function(){

        //alert('content focus');

        this.classList.remove('default_value-ovo');

        var html_ = this.innerHTML.trim();

        var default_value = this.getAttribute('defaultValue').trim();

        if(html_===default_value) this.innerHTML = '';

      });

			
    }
    ,_handleEdit(){
      var $pub = $('.ej-reply__pub',this.el);
   
			// var $content = $('.ej-reply__content',this.el);
			var $content = $('.ej_reply__content',this.el);

			//debugger;
			
			$pub.on('click',e=>{
				
				this._handlePost().then(res=>{

					if(this._auto_hide) this.hide();
					
					var {text_content,html_content} = res;

          this.trigger('complete',{
						el:$content[0], html_content,text_content
            ,el_target:this.el_target
					});
          
					if(this._auto_clear) this.clear();


				});

			})
    }
    
  });


  new Pub('#post-el').on('editor-success',props=>{
    debugger;
    console.log(props);
  });

  new Reply('#reply-el').on('editor-success',props=>{
    debugger;
    console.log(props);
  });
  

  // let E1 = new Editor();
  // let E2 = new Editor();

  
  // E1.on('a',()=>{debugger;});
  // E2.on('a',()=>{debugger;});

  // E2.trigger('a',{});

  // let Pub = Editor.extend({
  //   init(){
      
  //   }
  // });

  

  // let Reply = Editor.extend({
  //   init(){

  //   }

  // });

  // let edt1 = new Editor();
  // let edt2 = new Editor();
  // edt1.on('a',()=>{debugger;});
  // edt2.on('a',()=>{debugger;});

  // edt2.trigger('a',{});
  // let pub = $.extend(true,{},K.MxEvent);
  // let rep =  $.extend(true,{},K.MxEvent);

  // pub.on('a',()=>{debugger;});
  // rep.on('a',()=>{debugger;});
  // rep.trigger('a',{});


}

module.exports =  $.extend(true,Ej,K.MxEvent);