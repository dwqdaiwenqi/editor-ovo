import {Event,Brower} from './core';

import Smile from './smile';

export default Event.extend({
  init(props){
    this._super(true);

    this.default_options = {
      $container : $(document.body)
      ,$el_active : '#=w='
      ,tag_name : 'editor-ovo'
      ,z_index : 100
      ,config : {

      }
      ,convert_into_entities : false
    }

    props = Object.assign({},this.default_options,props);
    
    this.options = props;
    
    this.el;
    this.$container = props.$container;
    this.$content;
    this.$emoji_holder;
    this.$el_target;
    this.tag_name = props.tag_name;
    this._handle_complete = props.onComplete;

    this._selection = getSelection();
    this._last_edit_range;
    this._last_edit_startContainer;
    this._last_edit_startOffset;

    this._itv_msg;

    this.$el_active = $(props.$el_active);

    this._createChild();

    this._setLastEditEl(this.$content);

    //console.log(this.constructor.EL_SMILE,this.el);
    //console.log($(this.constructor.EL_SMILE,this.el)[0]);

    this.emoji_panel = new Smile({
      container:$(this.constructor.EL_SMILE,this.el)
    });

    this._run();
    //console.log('editor constructor');
  }
  ,clear(){

    this.$content.html(this.$content.attr('defaultValue')  );
    this.$content[0].classList.add('default_value-ovo');
    

    clearTimeout(this._itv_pub);
   
    this.$msg_holder.css({
      transition:'none'
      ,transform:'translate3d(0,-90%,0)'
    });


  }
  ,show(){
   // console.log('shiw');
    $(this.el).show();
  }
  ,hide(){
    //debugger;

    //console.log('hide');
    $(this.el).hide();
  }
  ,_createChild(){
    this.el = document.createElement(this.tag_name);
    this.$container.append(this.el);
    this.el.classList.add(this.constructor.CLS);
    // this.el.innerHTML = `
    //   <div content-ovo></div>
    // `;

    // this.$content = $('div[content-ovo]',this.el);
    //debugger;

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
  ,_resAdapter(s){
    return this.options.convert_into_entities?
      this._convertEmojiInToEntities(s):
      s;
  }

  ,_convertEmojiInToEntities(s){
    s = s.replace(/[\ud800-\udbff][\udc00-\udfff]/g, (char)=>{  
      var H, L, code;  
      if (char.length===2) {  
        H = char.charCodeAt(0); // 取高
        L = char.charCodeAt(1); // 取低
        code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00; 
        return "&#" + code + ";";  
      }else{  
        return char;  
      }  
    });  
    return s;  
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
  ,_bindDefaultValue(){
   
    var {CLS_DEFAULT_VALUE} = this.constructor;

    this.clear();

    //console.log(this.$content);
    this.$content.html(this.$content.attr('defaultValue')  );
    this.$content[0].classList.add(CLS_DEFAULT_VALUE);

    this.$content[0].addEventListener('blur',function(e){
      //console.log('blur');
      var html_ = this.innerHTML.trim();

      var default_value = this.getAttribute('defaultValue').trim();
      
      if(html_==='' || html_ === '<br>' ){
        this.innerHTML = default_value;
        this.classList.add(CLS_DEFAULT_VALUE);

      }
    });

    this.$content[0].addEventListener('focus',function(){

      this.classList.remove(CLS_DEFAULT_VALUE);

      var html_ = this.innerHTML.trim();

      var default_value = this.getAttribute('defaultValue').trim();

      if(html_===default_value) this.innerHTML = '';

    });
  }
  ,_pickEmoji(){
    this.emoji_panel.on('pick',(props)=>{
      
      this.$content.append(props.el);
    });
  }
  ,_displayMsg(msg,{}={}){
    this.$msg_text.text(msg+'');
   
    clearTimeout(this._itv_msg);

    this.$msg_holder.css({
      transition:'none'
      ,transform:'translate3d(0,0%,0)'
    });

    this._itv_msg = setTimeout(()=>{

      this.$msg_holder.css({
        transition:'none'
        ,transform:'translate3d(0,-90%,0)'
      });

    },2333);
  }
  ,_appendToLastModifiyEl(el){
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
  ,_focus(){
    //console.log(this.$content);
    this.$content[0].focus();
      

    //console.log('focus!!!!');
    if(!this._last_edit_range ) return;

    var range = this._last_edit_range;
    var {startContainer,startOffset} = range;

    range.setStart(startContainer, startOffset);
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

      /////////
      this._last_edit_startContainer = range.startContainer;
      this._last_edit_startOffset = range.startOffset;
      ////////

      //console.log(this._last_edit_range.startContainer,this._last_edit_range.startOffset);
      //console.log(this._last_edit_startContainer,this._last_edit_startOffset);

    },ms);
  }
  ,_setLastEditEl($last_el){
    this._last_el = $last_el;

  }
  ,_pickSmile(){
    
    //debugger;
    this.emoji_panel.on('pick',(props)=>{

      var html_ = this.$content.html().trim();

      var default_value = this.$content.attr('defaultValue').trim();
      
      if(html_===default_value) this.$content.html('');
      
      this._appendToLastModifiyEl(props.el);

    })
  }
  ,_handleConfirm(){
    throw 'rewrite !';
  }
  ,_editSuccess(){
    throw 'rewrite !';
  }
  ,_handleForThose(){
    
    this.$el_active.on('click',e=>{
     
      this.show();
    });

    $(this.constructor.EL_CANCEL,this.el).on('click',e=>{
     
      this.hide();
    });
    
    this.$content.on('blur',e=>{

    });


    $(this.$el_active).on('click',e=>{
      this.el_target = e.target;
      this.show();
      this._focus();
    });


    this.$content.on('focus',this._handle_bug_focus.bind(this));
    this.$content.on('blur',this._handle_bug_blur.bind(this));

  }

  ,_handle_bug_focus(e){

    //debugger;

    var {z_index} = this.options;

    if(Brower.version.ios){
					
      $(this.el).css({
        width:document.body.offsetWidth+'px'
        ,height:document.body.offsetHeight+'px'
        ,position:'absolute'
        ,left:'0',top:'0','z-index':z_index
      });

      //console.log(z_index);
    }else{
      $(this.el).css({
        position:'fixed'
        ,left:'0',top:'0','z-index':z_index
      });
    }
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
  ,_handle_bug_blur(){
    var {z_index} = this.options;
    if(Brower.version.ios){
      $(this.el).css({	position:'fixed',left:'0',top:'0','z-index':z_index	});
    }	
  }
  ,_run(){
    this._bindDefaultValue();
 
    this._pickSmile();


    this._handleForThose();
    this._focus();

    this._handleConfirm();



    this.on('complete',(props)=>{
     
      this._handle_complete&&this._handle_complete.call(this,props);
    });


    this.hide();


  }
}, {
  CLS:''
  ,CLS_DEFAULT_VALUE:'default_value-ovo'
  ,EL_CONTENT:'div[content-ovo]'
  ,EL_CANCEL:'button[cancel-ovo]'
  ,EL_CONFIRM:'button[confirm-ovo]'
  ,EL_SMILE:'div[smile-holder-ovo]'
  ,EL_SMILE_ICON:'li[smile-icon-ovo]'
  ,EL_DISPLAY_MSG:'div[message-ovo]'
});

