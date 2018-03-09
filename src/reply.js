import Editor from './editor';

// new Editor({});

var Reply = Editor.extend({
  init(props){
    //{config:{},a,b,c}


    
    this._super(props);
    
    console.log('reply constructor');
  }
},{});

new Reply({});


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