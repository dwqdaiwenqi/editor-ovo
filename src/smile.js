import {Event,Cache} from './core';

import Swiper from './swiper.min';
import './swiper.min.css';
import './smile.less';


export default Event.extend({
  init(props){
    this._super();

    props = Object.assign({},{container:'',padding:'0%',bottom:'-23%'},props);

    this.options = props;
    //debugger;

    this.el = document.createElement('smile-panel');
    this._delay_handles = [];
    this._itv_check;
    this.uid = (Math.random()+'').slice(2);
    
    this.swiper_cls = `swiper-uid${this.uid}`;
    this.swiper_pagination_cls = `swiper-pagination-uid${this.uid}`;

    this._createChild();

    $(props.container).append(this.el)

    this._createSmile();

    this._applySwiper();
    
    //this.hide();

    this._checkDelayHandle();

    return this;

  }
  ,hide(){
    this.el.style.display = 'none';
    //console.log(this.el);
  }
  ,show(){
    this.el.style.display = 'block';
    //console.log(this.el);
  }
  ,_applySwiper(){
    var {bottom} = this.options;
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

    //debugger;
    // const CONFIG = {
    // 	W:30,H:1500,CEIL:7,ROW:3
    // 	,CLS_SMILE:'smile-ovo'
    // 	,CLS_GROUPS:'smile-panel__groups swiper-slide'
    // }
    const CONFIG = {
      W:30,H:1500,CEIL:6,ROW:3
      ,CLS_SMILE:'smile-ovo'
      ,CLS_GROUPS:'smile-panel__groups swiper-slide'
    }
    CONFIG.GROUPS = CONFIG.CEIL*CONFIG.ROW;

    const TOTAL = CONFIG.H/CONFIG.W;
    const GROUP_NUM = Math.ceil(TOTAL/ (CONFIG.GROUPS) );

    [...Array(GROUP_NUM)].map((v,i)=>{
      
      var ul = document.createElement('ul');
      $wrapper.appendChild(ul);
      //console.log($wrapper);
      //debugger;
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


          li.itv_;	

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
              //console.log(Cache),Cache[`./popo_2adefed_${num_of_pic}.png`];
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
  ,el:null
});

// var Smile = (parent_el,{padding="0 10%",bottom="-23%"}={})=>{
// 	var Smile = $.extend(true,{
// 		init(){

// 			this._delay_handles = [];
// 			this._itv_check;
//       this.uid = (random()+'').slice(2);
      
// 			this.swiper_cls = `swiper-uid${this.uid}`;
// 			this.swiper_pagination_cls = `swiper-pagination-uid${this.uid}`;

// 			this._createChild();
// 			//parent_el.appendChild(this.el);
// 			this._createSmile();

// 			this._applySwiper();
			
// 			this.hide();

// 			this._checkDelayHandle();

// 			return this;
// 		}
// 		,hide(){
// 			this.el.style.display = 'none';
// 			console.log(this.el);
// 		}
// 		,show(){
// 			this.el.style.display = 'block';
// 			console.log(this.el);
// 		}
// 		,_applySwiper(){
// 			try{
// 				new Swiper('.'+this.swiper_cls, {
// 					pagination : '.'+this.swiper_pagination_cls
// 					//autoplay: 5000,//可选选项，自动滑动
// 					,onSlideChangeEnd: function(swiper){
// 						//alert(swiper.activeIndex) //切换结束时，告诉我现在是第几个slide
// 						//console.log(swiper.activeIndex);
// 					}
// 					,onPaginationRendered:function(swiper, paginationContainer){
// 						var $pagination = $(swiper.originalParams.pagination);
// 						$pagination.css({'transition':'none', bottom});

// 					}
// 					,onInit: function(swiper){
// 						//Swiper初始化了
// 						//alert(swiper.activeIndex);提示Swiper的当前索引
// 						//var el = document.querySelector(swiper.originalParams.pagination);
// 						var $container = $(swiper.container);
						
// 						$container.css({
//               overflow:'visible'
// 							//overflow:'hidden'
// 							//,overflowY:'auto'
// 						});

// 					}
// 				})
// 			}catch(e){
// 				alert(e);
// 			}
			 
// 		}
// 		,_addDelayHandle(ms=333,handle){
// 			this._delay_handles.push({ms,handle});

// 		}
// 		,_checkDelayHandle(ms=566){
// 			var that = this;
// 			;(function check(){
// 				that._itv_check = setTimeout(check,ms);
// 				if(!that._delay_handles.length) return;
// 				var o = that._delay_handles.shift();
// 				//console.log('delay#',handle);
// 				o.handle.call(that);

// 			})();

// 		}
// 		,_createSmile(){
// 			var $wrapper = this.el.querySelector('.swiper-wrapper');

// 			// const CONFIG = {
// 			// 	W:30,H:1500,CEIL:7,ROW:3
// 			// 	,CLS_SMILE:'smile-ovo'
// 			// 	,CLS_GROUPS:'smile-panel__groups swiper-slide'
// 			// }
// 			const CONFIG = {
// 				W:30,H:1500,CEIL:6,ROW:3
// 				,CLS_SMILE:'smile-ovo'
// 				,CLS_GROUPS:'smile-panel__groups swiper-slide'
// 			}
// 			CONFIG.GROUPS = CONFIG.CEIL*CONFIG.ROW;

// 			const TOTAL = CONFIG.H/CONFIG.W;
// 			const GROUP_NUM = ceil(TOTAL/ (CONFIG.GROUPS) );

// 			[...Array(GROUP_NUM)].map((v,i)=>{
				
// 				var ul = document.createElement('ul');
// 				$wrapper.appendChild(ul);
// 				ul.className = CONFIG.CLS_GROUPS;
// 			//	ul.style.padding = padding;

// 				let start_i = i*CONFIG.GROUPS;
// 				//console.log(start_i);
// 				for(let i = 0;i<CONFIG.ROW;i++){
// 					for(let j = 0;j<CONFIG.CEIL;j++){

// 						let li = document.createElement('li');	
// 						let count = start_i + i*CONFIG.CEIL+j;
// 						if(count >= TOTAL) continue;

// 						//49
// 						//console.log(TOTAL,  count);
// 						li.setAttribute('data-smile-idx',`${i},${j},${count}`); 
// 						//li.setAttribute('unselectable','on'); 
// 						ul.appendChild(li); 
// 						//li.className = 'smile-ovo';
// 						li.style.backgroundPosition = `0 ${count*CONFIG.W*-1}px`;
// 						Object.assign(li,{smile_idx:count});	


// 						li.itv_;	

// 						li.addEventListener('click',(e)=>{

// 							this._addDelayHandle(333,function(){
// 								var num_of_pic=  count+1;
// 								num_of_pic<10&&(num_of_pic='0'+num_of_pic);
// 							//	console.log(li,num_of_pic);
// 								var img = document.createElement('img');
// 								img.className =  CONFIG.CLS_SMILE;
// 								img.onload = ()=> this.trigger('pick',{el:img,smile_idx:count});

// 								//Cache[`popo_2adefed_${num_of_pic}.png`]
// 								//img.src = `./src/common/img/popo_2adefed/popo_2adefed_${num_of_pic}.png`;
// 								img.src = Cache[`./popo_2adefed_${num_of_pic}.png`];
// 								e.preventDefault();

// 							});

	
// 						})

// 					}
// 				}

// 			})

// 			//7,3,21
// 		}
// 		,_createChild(){

// 			this.el.innerHTML = `
// 				<div class="swiper-container ${this.swiper_cls}">
// 					<div class="swiper-wrapper">
					
// 					</div>
// 					<div class="swiper-pagination ${this.swiper_pagination_cls}"></div>
// 				</div>
// 			`;
// 		}
// 		,el:document.createElement('smile-panel')
// 	},K.MxEvent);

// 	return Smile.init();
// }
