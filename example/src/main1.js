import {Editor} from '../../dist/scripts/main1.js';

new Editor({
  $el_active:'#post-el'
  ,convert_into_entities : false
  ,onComplete(props){
 
    
    this.generateUrl('/upload',props).then(res=>{
      this.clear();
      this.hide();
      
      console.log(res);
    });
  


  }
})

