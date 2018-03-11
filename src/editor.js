
import {Event} from './core';

import Smile from './smile';

export default Event.extend({
  init(props){
    this._super(true);

    this.default_options = {
      $container : $(document.body)
      ,$el_active : $(document.body)
      ,tag_name : 'editor-ovo'
    }

    props = Object.assign({},this.default_options,props);

    this.options = props;
    
    this.el;
    this.$container = props.$container;
    this.$content;
    this.$emoji_holder;
    this.tag_name = props.tag_name;

    this.$el_active = props.$el_active;

    this._createChild();

    // this.emoji_panel = new Smile({
    //   cls:props.config.EMOJI_CLS
    //   ,size:props.config.EMOJI_SIZE
    // });
    // this.$emoji_holder.append(this.emoji_panel.el);

    this.$el_active = props.$el_active;

    this._run();
    console.log('editor constructor');
  }
  ,show(){
    $(this.el).show();
  }
  ,hide(){
    $(this.el).hide();
  }
  ,_createChild(){
    this.el = document.createElement(this.tag_name);
    this.$container.append(this.el);
    this.el.classList.add(this.constructor.cls);
    // this.el.innerHTML = `
    //   <div content-ovo></div>
    // `;

    // this.$content = $('div[content-ovo]',this.el);
    //debugger;

  }
  ,_focus(){
    this.$content[0].focus();
  }
  ,_bindDefaultValue(){
    //throw('rewrite !');
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
  ,_pickEmoji(){
    this.emoji_panel.on('pick',(props)=>{
      
      this.$content.append(props.el);
    });
  }
  ,_handleForThose(){
    //debugger;
    //console.log(this.$el_active);
    this.$el_active.on('click',e=>{
      //debugger;
      this.show();
    });

    
    this.$content.on('blur',e=>{

    });


  }
  ,_run(){
    this._bindDefaultValue();
    //this._pickEmoji();
    this._handleForThose();
    this._focus();

    this.hide();

  }
}, {CLS:''});

