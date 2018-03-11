import Editor from './editor';
import './reply.less';
// new Editor({});

// class C1 {
//   constructor(props){
//     console.log('c1:',props);
//   }
// }
// class C2 extends C1{
//   constructor(props){
//     props = Object.assign({},props,{sss:123});
//     super(props);
//   }
//   fn1(){

//   }
// }
// new C2();
//git pull origin master
//git add .
//git commit -m "."
//git push origin master -u


var Reply = Editor.extend({
  init(props){
    props = Object.assign({},props,{tag_name:'editor-reply-ovo'});
    this._super(props);
    
    

    console.log('reply constructor');
  }
  ,_createChild(){
    this._super();
    //editor-reply-ovo
    this.el.classList.add(this.constructor.cls);
    
    this.el.innerHTML = `
      <div class="ej_replay__wrap">
        <div class="ej_reply__content-wrap rel">
          <div class="ej_reply__content abs wh" content-ovo contenteditable="true" defaultValue="回复你的内容吧..." ></div>
        </div>
        <div class="ej-reply__bot rel">
          <div class="abs wh">

            <ul>
              <li></li>
            </ul>

            <div>
              <button class="rel ej-reply__cancel"><span class="abs wh">取消</span></button>
              <button class="rel ej-reply__pub"><span class="abs wh">发表</span></button>
            </div>
          </div>
        </div>
        <div class="ej-reply__smile-holder rel">
          <div class="ej-reply__smile-inner abs">

          </div>
        </div>

        <div class="ej-reply__msg abs">
          <div class="abs wh">
            <span>输入几个字？</span>
          </div>
        </div>
      </div>
    `;
    this.$content = $('div[content-ovo]',this.el);

  }
},{
  CLS:'editor-reply-ovo'
});

new Reply({
  el_active:'#reply-el'
});


// new Reply({});

// Reply.config = {
//   TAG_NAME:'emoji-ovo-reply'

// };

// new Reply('#reply-el',{  }).on('complete',()=>{
//   debugger;
// });

// var Reply = Class.create({
//   initialize(){

//   }
// });



export default function(props){

  return new Reply(props);
}