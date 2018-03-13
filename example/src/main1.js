import {Post} from '../../dist/scripts/main1.js';

new Post({
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

