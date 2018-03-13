import {Post} from '../../dist/scripts/main1.js';

new Post({
  $el_active:'#post-el'
  ,convert_into_entities : true
  ,onComplete(props){
    console.log(props);

    //this.clear();
    //this.hide();
    

  }
})

