import Smile from './smile';
import './reply.less';
import twemoji from 'twemoji';
/**
 * 回复帖子模块
 * 
 * @param {any} el_active 激活dom
 * @param {any} [{el_parent=document.body,z_index=999,auto_hide=true}={}] 
 */
var Reply = (el_active,{el_parent=document.body,z_index=999,auto_hide=false,auto_clear=true}={})=>{
	var Reply = $.extend(true,{
		init(){
			this._itv_pub;
			this._last_el;
			this.el_active;

			this._selection = window.getSelection();
			this._itv_range;
			this._last_edit_range;
			//startContainer, startOffset
			this._last_edit_startContainer;
			this._last_edit_startOffset;

			this._createChild();
			this._postHandle();

			//debugger;
			$(this.el).css({
				width:innerWidth+'px',height:innerHeight+'px'
				//width:el_parent.offsetWidth+'px',height:el_parent.offsetHeight+'px'
				,zIndex:z_index
			});

			this.smile = Smile(this.el.querySelector('.ej-reply__smile-inner'),{padding:'0% 9%'} );
			this.smile.show();

			this._pickSmileHandle();

			this._bindDefaultValue();


			this._setLastEditEl(this.$content);

      this.hide();

			{
				$(el_active).on('click',e=>{
					this.el_active = e.target;

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
							,left:'0',top:'0','z-index':z_index
						});
					}else{
						$(this.el).css({
							position:'fixed'
							,left:'0',top:'0','z-index':z_index
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
						$(this.el).css({	position:'fixed',left:'0',top:'0','z-index':z_index});
					}
				});
				
				
				this.$content[0].addEventListener('input',e=>{
					
					this._recordLastRange(0);

					// twemoji.parse(this.$content[0],(icon,options)=>{
					// 	//alert('./src/common/img/2/' + options.size + '/' + icon + '.png');
					// 	//alert('./src/common/img/' + options.size + '/' + icon + '.png');
					// 	//console.log('./src/common/img/2/' + options.size + '/' + icon + '.png');
					// 	setTimeout(()=>{
					// 		alert(this.$content[0].innerHTML);
					// 	},50);
					// 	return './src/common/img/' + options.size + '/' + icon + '.png';
					// });
					// var that = this;
					// twemoji.parse(this.$content[0],{className:'smile-ovo',callback(icon,options){
					// 	//that._recordLastRange(100);
					// 	return './src/common/img/' + options.size + '/' + icon + '.png';
					// }});


					// /(\uD83C[\uDF00-\uDFFF])|(\uD83D[\uDC00-\uDE4F])/

					// setTimeout(()=>{
						
					// 	this._replaceEmojiCode();
					// },10)
					




				});
				this.$content[0].addEventListener('touchend',e=>{
					
					//inputx.innerHTML = 'xxx'+random();
					this._recordLastRange(566);		

				});


				
				$('.ej-reply__cancel',this.el).on('click',e=>{
					this.hide();
				});
			}


			
			{
				this.$content[0].addEventListener('input',e=>{
		

					//this._setLastEditEl(this._editLastChild());

					

				})


			}

     
			//debugger;


			return this;
		}
		,el:document.createElement('ej-reply')
		,_replaceEmojiCode(html_){
			var holder_ = document.createElement('div');
			holder_.innerHTML = html_;

			//console.log(html_);
	
			var replace_objs = [];

		
			[...holder_.childNodes].forEach(old_child=>{
				var {nodeType,nodeName} = old_child;
				var s_html = nodeType===3?old_child.textContent:old_child.innerHTML;
				var check_emoji;

				s_html = s_html.replace(/(\uD83C[\uDF00-\uDFFF])|(\uD83D[\uDC00-\uDE4F])/g,(a,b,c)=>{
					var src;
					//这个节点匹配到了emoji
					check_emoji = true;
					//area1.innerHTML+='b<br/>'
					//c = c.replace(/\/$/,'');

					twemoji.parse(c,{className:'smile-ovo',callback(icon,options){
						src = './src/common/img/' + options.size + '/' + icon + '.png';
					}})
					// twemoji.parse(c,function(icon, options, variant){
					// 	//console.log('./src/common/img/2/' + options.size + '/' + icon + '.png');
						
					// 	src = './src/common/img/' + options.size + '/' + icon + '.png';
					// });
					return `<img class="smile-ovo" src="${src}"/>`;
				});
			
				
				if(check_emoji){
					let new_child = document.createElement('p');
					new_child.innerHTML = s_html;
					
					//area1.innerHTML+='s_html<br/>'
					replace_objs.push({new_child,old_child});
				}


			});

			replace_objs.forEach(o=>{
				holder_.replaceChild(o.new_child,o.old_child);

			});

			return holder_.innerHTML;
		}
		,_appendToEditEl(el){
			if(!this._last_edit_range) return this._last_el.append(el);

			var [node_type,node_name] = [
				this._last_edit_range.startContainer.nodeType
				,this._last_edit_range.startContainer.nodeName.toLowerCase()
			];

			//console.log(23333);
			//inputx.innerHTML += `<div>type:${node_type},name:${node_name}</div>`;

			if(node_type===1&&node_name==='li') return console.log('qwq');


			this._last_edit_range.insertNode(el);
			//false,true  锚点before|after
			this._last_edit_range.collapse(false);
			this._selection.removeAllRanges();
			this._selection.addRange(this._last_edit_range);
			

		}
		,_focus(){
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
			{
				//this.$content;

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
		}
		,_createChild(){
			el_parent.appendChild(this.el);
		
			this.el.innerHTML = `
				<div class="ej_replay__wrap">
					<div class="ej_reply__content-wrap rel">
						<div class="ej_reply__content abs wh" contenteditable="true" defaultValue="回复你的内容吧..." ></div>
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
						<div smile-holder-ovo class="ej-reply__smile-inner abs">

						</div>
          </div>

          <div class="ej-reply__msg abs">
            <div class="abs wh">
              <span>输入几个字？</span>
            </div>
          </div>

				</div>
				
			`;

      this.$content = $('.ej_reply__content',this.el);
      this.$msg_text = $('.ej-reply__msg span',this.el);
      this.$msg = $('.ej-reply__msg',this.el);


		}
		,clear(){

      this.$content.html('');
      
      this.$content.html(this.$content.attr('defaultValue')  );
		
      this.$content[0].classList.add('default_value-ovo');
    
      //if(init_clear) return;
      clearTimeout(this._itv_pub);
      // this.$msg[0].classList.remove('ej-comment__msg--show');
      // this.$msg[0].classList.add('ej-comment__msg--hide');
      this.$msg.css({
        transition:'none'
        ,transform:'translate3d(0,-90%,0)'
			});
			
		}
		,_postHandle(){
			var $pub = $('.ej-reply__pub',this.el);
			
			// var $content = $('.ej-reply__content',this.el);
			var $content = $('.ej_reply__content',this.el);

			//debugger;
			
			$pub.on('click',e=>{
				
				this._pubSuccess().then(res=>{

					// if(auto_hide) this.hide();
					// //debugger;
					// var {html_title,html_content,text_content} = res;

          // this.trigger('success',{
					// 	el:$content[0],html_title, html_content,text_content
					// 	,el_active:this.el_active
					// });
          
					// if(auto_clear) this.clear();


				

					if(auto_hide) this.hide();
					
					var {html_title,text_content,html_content} = res;
				
					//var html_title = this._replaceEmojiCode(html_title);

					// console.log(res,html_title);
					// return;

          this.trigger('success',{
						el:$content[0],html_title, html_content,text_content
						,el_active:this.el_active
					});
          
					if(auto_clear) this.clear();


				});

			})
			
		}
		,_pickSmileHandle(){
			var $smile_li = $('.ej-reply__bot ul li:nth-child(1)',this.el);
			var $holder = $('.ej-reply__smile-holder',this.el);
			$holder.hide();

			{
				let i = 0;
				$smile_li.on('click',e=>{
					++i%2===0?$holder.hide():$holder.show();
				})
			}

			let itv;
			this.smile.on('pick',(props)=>{
				//////////////////////////////////
				// var html_ = this.$content.html().trim();

				// var default_value = this.$content.attr('defaultValue').trim();
				
				// if(html_===default_value) this.$content.html('');

				// {
				// 	//当前行只有一个br表情得插入行中，且删除行中br
				// 	let childs;
				// 	if(! (childs=this._last_el[0].children) ) return;

				// 	if(this._last_el[0].nodeName.toLowerCase()==='div'&&
				// 		childs.length===1 &&
				// 		childs[0].nodeName.toLowerCase()==='br'
				// 	){
				// 		//console.log('remove br!!!');
				// 		this._last_el[0].removeChild(childs[0]);
				// 	}
				// }
				// this._last_el.append(props.el);
				////////////////////////////////////////


				var html_ = this.$content.html().trim();

				var default_value = this.$content.attr('defaultValue').trim();
				
				if(html_===default_value) this.$content.html('');
				
				//this._last_el.append(props.el);
				this._appendToEditEl(props.el);
			

    
			})
		}
		,_showMsg(msg,{}={}){
			this.$msg_text.text(msg+'');
      //console.log(msg,this.$msg[0]);

      clearTimeout(this._itv_pub);

      this.$msg.css({
        transition:'none'
        ,transform:'translate3d(0,0%,0)'
			});
			
      
      //debugger;

      //debugger;
      // this.$msg[0].classList.remove('ej-comment__msg--hide');
      // this.$msg[0].classList.add('ej-comment__msg--show');
      // clearTimeout(this._itv_pub);

       this._itv_pub = setTimeout(()=>{
      //   this.$msg[0].classList.remove('ej-comment__msg--show');
      //   this.$msg[0].classList.add('ej-comment__msg--hide');
        this.$msg.css({
          transition:'none'
          ,transform:'translate3d(0,-90%,0)'
        })
       },2333);
		}
		/** 
		 * 用于把用utf16编码的字符转换成实体字符，以供后台存储 
		 * @param  {string} str 将要转换的字符串，其中含有utf16字符将被自动检出 
		 * @return {string}     转换后的字符串，utf16字符将被转换成&#xxxx;形式的实体字符 
		 */  
		,_utf16toEntities(str){
			var patt=/[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则  
				str = str.replace(patt, function(char){  
					var H, L, code;  
					if (char.length===2) {  
							H = char.charCodeAt(0); // 取出高位  
							L = char.charCodeAt(1); // 取出低位  
							code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00; // 转换算法  
							return "&#" + code + ";";  
					} else {  
							return char;  
					}  
			});  
			return str;  
		}
		,_pubSuccess(){

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
					
					// v_ = v;
					// v_ = v_.replace(/(\uD83C[\uDF00-\uDFFF])|(\uD83D[\uDC00-\uDE4F])/g,(a,b,c)=>{
					// 	return '';
					// });


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
					//that._showMsg(PUB_CONFIG.EDIT_SUCCES);
					// v_ = that.$content[0].textContent.trim().replace(/(\uD83C[\uDF00-\uDFFF])|(\uD83D[\uDC00-\uDE4F])/g,(a,b,c)=>{
					// 	return '';
					// });


					/** 
					 * 用于把用utf16编码的字符转换成实体字符，以供后台存储 
					 * @param  {string} str 将要转换的字符串，其中含有utf16字符将被自动检出 
					 * @return {string}     转换后的字符串，utf16字符将被转换成&#xxxx;形式的实体字符 
					 */  
					// function utf16toEntities(str) {  
					// 	var patt=/[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则  
					// 	str = str.replace(patt, function(char){  
					// 					var H, L, code;  
					// 					if (char.length===2) {  
					// 							H = char.charCodeAt(0); // 取出高位  
					// 							L = char.charCodeAt(1); // 取出低位  
					// 							code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00; // 转换算法  
					// 							return "&#" + code + ";";  
					// 					} else {  
					// 							return char;  
					// 					}  
					// 			});  
					// 	return str;  
					// }  

					// unescape('😁');
					// utf16toEntities('哈哈😁');




          r({
						 html_title:that.$content[0].innerHTML.trim()
						 ,text_content:that.$content[0].textContent.trim()

						//html_title:that._utf16toEntities(that.$content[0].innerHTML.trim())  
						//,text_content:that._utf16toEntities(that.$content[0].textContent.trim())  
						
						,edit_time:Date.now()
					});


		
				});

				handle();


			})
		}
		,hide(){
			this.el.style.display='none';
		}
		,show(){
			this.el.style.display='block';
		}
	},K.MxEvent);

	return Reply.init();
}

export default Reply;