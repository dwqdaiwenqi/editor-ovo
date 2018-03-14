import Display from './display';
import './reply.less';


var Reply = Display.extend({
  init(props){
    //debugger;
    props = Object.assign({},{
      tag_name:'editor-reply-ovo'
      ,config : {
        TITLE_EMPTY:'回复内容不能为空'
        ,SUCCESS:'回复成功'
        ,WORD_TOO_MANY:'你写的字数太多了吧...'
        ,SMILE_TOO_MANY:'你发的表情太多了吧...'
        ,MAX_WORDS:500
        ,MAX_SMILES:20
      }
    },props);
   
    this._super(props);

    
    //console.log('reply constructor');

  }
  ,_handleForThose(){
    this._super();
    
    this.$content.on('input',e=>{
      this._recordLastRange(0);
    });
    this.$content.on('touchend',e=>{
      this._recordLastRange(566);
    });


    {
      let i = 0;
      let $holder = $('.ej-reply__smile-holder',this.el);
      $holder.hide();
      $(this.constructor.EL_SMILE_ICON).on('click',e=>{
        ++i%2===0?$holder.hide():$holder.show();
      });
    }

  }
  // send
  ,_editSuccess(){
    
    const {config} = this.options;
    
    return new Promise(r=>{
      var that = this;

      var handle = (function(){
        var v = that.$content[0].innerHTML.trim()

        if(!v.length ||  v===that.$content[0].getAttribute('defaultValue')){

          return that._displayMsg(config.TITLE_EMPTY);
        }
        
        return 'nextSuccessor';
      })
      .after(function(){
        var smile_len = $('.smile-ovo',that.$content).length;

        if(smile_len>config.MAX_SMILES) return that._displayMsg(config.SMILE_TOO_MANY);

        return 'nextSuccessor';
      })

      .after(function(){
        var v = that.$content[0].textContent.trim();
        if(v.length >config.MAX_WORDS){
          return that._displayMsg(config.WORD_TOO_MANY);
        }

        return 'nextSuccessor';
      })
      .after(function(){
 
        r({
          html_content:that._resAdapter(that.$content[0].innerHTML.trim())
          ,text_content:that._resAdapter(that.$content[0].textContent.trim()) 
          
        });


      });

      handle();


    });

  }
 
  ,_handleConfirm(){
   

    $(this.constructor.EL_CONFIRM).on('click',e=>{
      
      this._editSuccess().then(res=>{
      
        var {text_content,html_content} = res;
  
        this.trigger('complete',{
           html_content,text_content
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
    
    this.el.innerHTML = `
      <div class="ej_replay__wrap">
        <div class="ej_reply__content-wrap rel">
          <div class="ej_reply__content abs wh" content-ovo contenteditable="true" defaultValue="回复你的内容吧..." ></div>
        </div>
        <div class="ej-reply__bot rel">
          <div class="abs wh">

            <ul>
              <li smile-icon-ovo></li>
            </ul>

            <div>
              <button cancel-ovo class="rel ej-reply__cancel"><span class="abs wh">取消</span></button>
              <button confirm-ovo class="rel ej-reply__pub"><span class="abs wh">发表</span></button>
            </div>
          </div>
        </div>
        <div class="ej-reply__smile-holder rel">
          <div smile-holder-ovo xxxxxx class="ej-reply__smile-inner abs">

          </div>
        </div>

        <div message-ovo class="ej-reply__msg abs">
          <div class="abs wh">
            <span>输入几个字？</span>
          </div>
        </div>
      </div>
    `;

    this.$content = $(this.constructor.EL_CONTENT,this.el);
    this.$msg_holder = $(this.constructor.EL_DISPLAY_MSG,this.el)
    this.$msg_text = $('span',this.$msg_holder);


  }
},{
  CLS:'editor-reply-ovo'
});


export default Reply;


// export default function(props){

//   return new Reply(props);
// }