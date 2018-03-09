import Smile from './smile';
import EXIF from 'exif-js';
import twemoji from 'twemoji';
/**
 * 编辑帖子模块
 * 
 * @param {object} el_active 激活dom
 * @param {object} [{el_parent=document.body,z_index=999,auto_hide=true}={}] 
 * @returns 
 */
var Editor = (el_active,{
	el_parent=document.body,z_index=999
	,auto_hide=false,auto_clear=true
	,img_max_size=1024*1024*4
	,base64=true,api='./upload'
}={})=>{


	var o = $.extend(true,{
		init(){

      this._last_el;
			this._itv_pub;
			this.el_active;

			this._selection = window.getSelection();
			this._itv_range;
			this._last_edit_range;

			this._base64_map = Object.create(null);
			this.upload_pictures = [];

			this._createChild();
			this._postHandle();

			this._setLastEditEl(this.$content);

			this._chooseImgHandle((img,props)=>{

				// let s = img.width/img.height;
				// img.width = min(img.width,innerWidth*.666);
				img.setAttribute('uid',props.uid);
        //img.width = innerWidth*.5;

        var html_ = this.$content.html().trim();

        var default_value = this.$content.attr('defaultValue').trim();

				if(html_===default_value) this.$content.html('');
				
				var img_wrap = document.createElement('p');
				img_wrap.appendChild(img);
				//this.$content.append(img_wrap);

				////////////
				
				this._appendToEditEl(img_wrap);

				//////////
				props.base64 = img.src;

				this._base64_map[props.uid] = props;
				
				//console.log(	this._base64_map);
				//debugger;

				this._getUploadPictures();

				///
				this._setLastEditEl(this.$content);
			});


		
			$(this.el).css({
				width:innerWidth+'px',height:innerHeight+'px'
				,zIndex:z_index
			});

			

			this.smile = Smile(this.el.querySelector('.smile-holder'),{bottom:'-30%'} );

			this._pickSmileHandle();

			this._bindDefaultValue();

			this.hide();

			{
				

				$(el_active).on('click',e=>{
					this.el_active = e.target;

          this.show();
					this._focus();
         
				});


				$('.ej_comment__cancel',this.el).on('click',e=>{
					this.hide();
				})
			}
			


			{

				let handle_focus = (e)=>{
					//alert(K.Brower.version.ios);
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
				}
				
				let handle_blur = (e)=>{
					if(K.Brower.version.ios){
						$(this.el).css({	position:'fixed',left:'0',top:'0','z-index':z_index	});
					}	
				}
			
				this.$content[0].addEventListener('focus',handle_focus);
				this.$content[0].addEventListener('blur',handle_blur);

				this.$ipt.addEventListener('focus',handle_focus);
				this.$ipt.addEventListener('blur',handle_blur);
	
				this.$content[0].addEventListener('input',e=>{

					//alert(this.$content[0].innerHTML.length)

					this._setLastEditEl(this._editLastChild());
					this._getUploadPictures();
					this._recordLastRange(0);

				});
				this.$content[0].addEventListener('touchend',e=>{
					this._recordLastRange(566);
					
				});


			}

			return this;
		}
		,_replaceEmojiCode(html_){
			var holder_ = document.createElement('div');
			holder_.innerHTML = html_;

			console.log(html_);

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
		,_recordLastRange(ms=0){

			clearTimeout(this._itv_range);
			this._itv_range = setTimeout(()=>{
				if(!this._selection.rangeCount) return;

				var range = this._selection.getRangeAt(0);

				this._selection.removeAllRanges();
				this._selection.addRange(range);
				this._last_edit_range = range;

			},ms);
		}
		,_appendToEditEl(el){
			if(!this._last_edit_range) return this._last_el.append(el);

			var [node_type,node_name] = [
				this._last_edit_range.startContainer.nodeType
				,this._last_edit_range.startContainer.nodeName.toLowerCase()
			];

			//console.log(node_type,node_name);

			if(node_type===1&&node_name==='li') return console.log('qwq');

			this._last_edit_range.insertNode(el);
			//false,true  锚点before|after
			this._last_edit_range.collapse(false);
			this._selection.removeAllRanges();
			this._selection.addRange(this._last_edit_range);

		}
		,_getUploadPictures(){
			
			var base64_imgs = [...$('img.from-input-ovo',this.el)];

		
			this.upload_pictures = [];
			base64_imgs.forEach((img,i)=>{
				var uid = img.getAttribute('uid');

				this.upload_pictures.push(this._base64_map[uid]);
			})

		//	console.log(this.upload_pictures);
		}
		,_bindDefaultValue(){
      
      var that = this;

      this.clear(true);
			//debugger;
			//this.$content;
			//let itv;
			this.$content[0].addEventListener('blur',function(e){
		
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

			let itv;
			this.$content[0].addEventListener('focus',function(e){
        this.classList.remove('default_value-ovo');
			
				var html_ = this.innerHTML.trim();

				var default_value = this.getAttribute('defaultValue').trim();

				if(html_===default_value) this.innerHTML = '';

			});


			this.$ipt.addEventListener('blur',function(e){
				that.$bot_pick.show();
				that.smile.show();
        //#adadad
				var html_ = this.value.trim();
			
				var default_value = this.getAttribute('defaultValue').trim();
				
				//console.log(html_,default_value, html_===default_value);
				//ios 还会带上<br>。。。。。
				//alert(`blur:${html_},length:${html_.length}`);
				if(html_==='' || html_ === '<br>' ){
          this.value = default_value;
          this.classList.add('default_value-ovo-2');
				}

			});
			this.$ipt.addEventListener('focus',function(e){

				that.$bot_pick.hide();
				that.smile.hide();
				
				
        //alert( getComputedStyle(that.$bot_pick[0],null)['visibility']  );
       // alert(that.$bot_pick[0]);

        this.classList.remove('default_value-ovo-2');

				var html_ = this.value.trim();

				var default_value = this.getAttribute('defaultValue').trim();

				if(html_===default_value) this.value = '';
			});
			
			
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
		,hide(){
			this.el.style.display='none';

			//debugger;
		}
		,show(){
			this.el.style.display='block';
		}
		,_pickSmileHandle(){
			//this.$content;
			//debugger;
			var $smile_li = $('.ej_comment__bot ul li:nth-child(1)',this.el);
			this.$smile_li = $smile_li;
			{
				$smile_li.idx=0;
				$smile_li.on('click',e=>{
					++$smile_li.idx%2===0?this.smile.hide():this.smile.show();
				})
			}


			{
				let itv;
				this.smile.on('pick',(props)=>{
					
					// var html_ = this.$content.html().trim();

					// //debugger;

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

					// //unselectable
					// props.el.setAttribute('unselectable','on');
					// this._last_el.append(props.el);


					///////////////////////////////////////////////
					var html_ = this.$content.html().trim();

					var default_value = this.$content.attr('defaultValue').trim();
					
					if(html_===default_value) this.$content.html('');
					
					this._appendToEditEl(props.el);
	
				})
			}
			

		}
		,_chooseImgHandle(fn){

		
			var $chooseimg = $('.ej_comment__chooseimg',this.el);
		
			$chooseimg[0].addEventListener('change',()=>{
				////////////////////////////////////
				
				let {name,type,size} = $chooseimg[0].files[0];

				//image/png image/jpeg

				if( !(/image\/(png|jpeg|gif)/.test(type) )) return this._showMsg('请上传一张图片...');

				if(size > img_max_size) return this._showMsg('图片太大...');

				var img_orientation;

				EXIF.getData($chooseimg[0].files[0],function(){  
					EXIF.getAllTags(this);   
					img_orientation = EXIF.getTag(this, 'Orientation');  
				});  

				const frd = new FileReader();

				//console.log('filereader!');
				frd.addEventListener('load',()=>{
					const pic = document.createElement('img');
          //pic.classList.add('from-input-ovo');

					pic.addEventListener('load',()=>{
						
						let s = pic.width/pic.height;

						//alert(pic.width);

						//pic.width = min(pic.width,innerWidth*.777);
						
						const dp = 2;
					
						//pic.width = innerWidth*.777   *dp;
						pic.width = innerWidth*.8   *dp;

						let cv = document.createElement('canvas');
						let c = cv.getContext('2d');
						
						if(K.Brower.version.ios&&img_orientation===6){
							//alert('rotating!!!');
							cv.width=pic.width/s,cv.height= pic.width;
							//
							let scale_to_max = pic.width/cv.width;
							//50 --- 60
							//
							cv.width*=scale_to_max,cv.height*=scale_to_max;

							let tx = cv.width*.5
								,ty = cv.height*.5
								,x=tx,y=ty;
							c.translate(x,y);
							c.rotate(PI*.5);
							c.drawImage(pic
								,-ty,-tx
								,pic.width*scale_to_max,(pic.width/s)*scale_to_max
							);
						}else{
							cv.width = pic.width,cv.height = pic.width/s;
							c.drawImage(pic,0,0,cv.width,cv.height);
						}
				

						let pic_ = document.createElement('img');
						const quality = .93;

						pic_.width = cv.width*(1/dp),pic_.height = cv.height*(1/dp);

						//pic_.setAttribute('unselectable','on');
						pic_.setAttribute('quality-ovo',quality);	
						pic_.setAttribute('suffix-ovo',type.match(/image\/(\w+)/)[1]);
						pic_.classList.add('from-input-ovo');
						pic_.onload = ()=>fn(pic_,{name,type, uid:`uid-${(random()+'').slice(2)}`});
						pic_.src = cv.toDataURL(type,quality);
						//pic_.src = require('./common/img/a.jpg');

					});
					pic.src = frd.result;

				});
				


				frd.readAsDataURL($chooseimg[0].files[0]);

				///////////////////////////////////


			});

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
				TITLE_EMPTY:'标题不能为空'
				,TITLE_TOO_MATCH:'标题太长...'
        ,CONTENT_EMPTY:'编辑内容不能为空'
        ,PHOTO_TOO_MATCH:'你传的照片太多了吧...'
        ,SMILE_TOO_MATCH:'你发的表情太多了吧...'
				,WORD_TOO_MATCH:'你写的字数太多了吧...'
				,PICTURE_TOO_BIG:'图片太大了'
        ,EDIT_SUCCES:'发表成功'
        ,SMILE_MAX_LEN:20
        //,SMILE_MAX_LEN:30
        // ,PHOTO_MAX_LEN:6
				,PHOTO_MAX_LEN:6
				//,PHOTO_MAX_SIZE:1024*10
				,WORD_MAX_LEN:800
				,TITLE_MAX_LEN:50
      }
			return new Promise(r=>{
				var that = this;
				var v_='';
				var v2_='';
				var handle = (function(){
			  	var v = that.$ipt.value.trim();

          if(!v.length ||  v===that.$ipt.getAttribute('defaultValue')){

						return that._showMsg(PUB_CONFIG.TITLE_EMPTY);

					}
					// v_ = v;
					// v_ = v_.replace(/(\uD83C[\uDF00-\uDFFF])|(\uD83D[\uDC00-\uDE4F])/g,(a,b,c)=>{
					// 	return '';
					// });

					// if(!v_.length ||  v===that.$ipt.getAttribute('defaultValue')){

					// 	return that._showMsg(PUB_CONFIG.TITLE_EMPTY);

					// }
		
					return 'nextSuccessor';

				})
				.after(function(){
					var v = that.$ipt.value.trim();
					if(v.length >PUB_CONFIG.TITLE_MAX_LEN){
						return that._showMsg(PUB_CONFIG.TITLE_TOO_MATCH);
					}
					return 'nextSuccessor';
				})
				.after(function(){
					var photo_len = $('.from-input-ovo',that.$content).length;
					var smile_len = $('.smile-ovo',that.$content).length;
					var v = that.$content[0].textContent.trim();

					//console.log(v,that.$content[0].getAttribute('defaultValue') ,v===that.$content[0].getAttribute('defaultValue'));			
					
					
					if( (!v.length ||  v===that.$content[0].getAttribute('defaultValue') ) &&
					!photo_len && !smile_len
					){
						return that._showMsg(PUB_CONFIG.CONTENT_EMPTY);
					}
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
					var photo_len = $('.from-input-ovo',that.$content).length;

					if(photo_len>PUB_CONFIG.PHOTO_MAX_LEN) return that._showMsg(PUB_CONFIG.PHOTO_TOO_MATCH);
	
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
		
					// v2_ = that.$content[0].textContent.trim().replace(/(\uD83C[\uDF00-\uDFFF])|(\uD83D[\uDC00-\uDE4F])/g,(a,b,c)=>{
					// 	return '';
					// });

          r({
						html_title:that.$ipt.value.trim() 		
						,html_content:that.$content[0].innerHTML.trim()
						,text_content:that.$content[0].textContent.trim()
						
						// html_title:that._utf16toEntities(that.$ipt.value.trim() )
						// ,html_content:that._utf16toEntities(that.$content[0].innerHTML.trim())
						// ,text_content:that._utf16toEntities(that.$content[0].textContent.trim())
            ,edit_time:Date.now()
          });
				});

				handle();
				
			})
		}
		,clear(init_clear=false){
     
      
      
      this.$content.html(this.$content.attr('defaultValue')  );
			this.$ipt.value = this.$ipt.getAttribute('defaultValue');

      this.$content[0].classList.add('default_value-ovo');
      this.$ipt.classList.add('default_value-ovo-2');



      //if(init_clear) return;
      clearTimeout(this._itv_pub);
      // this.$msg[0].classList.remove('ej-comment__msg--show');
      // this.$msg[0].classList.add('ej-comment__msg--hide');
      this.$msg.css({
        transition:'none'
        ,transform:'translate3d(0,-90%,0)'
			});

      
      
			this.upload_pictures = [];

		}
		,_showMsg(msg,{}={}){

      this.$msg_text.text(msg+'');

      clearTimeout(this._itv_pub);


      this.$msg.css({
        transition:'none'
        ,transform:'translate3d(0,0%,0)'
			});
			

      //debugger;
      // this.$msg[0].classList.remove('ej-comment__msg--hide');
      // this.$msg[0].classList.add('ej-comment__msg--show');
       this._itv_pub = setTimeout(()=>{
      //   this.$msg[0].classList.remove('ej-comment__msg--show');
      //   this.$msg[0].classList.add('ej-comment__msg--hide');
        this.$msg.css({
          transition:'none'
          ,transform:'translate3d(0,-90%,0)'
        })
       },2333);
		}
		,_postHandle(){
			var $pub = $('.ej_comment__pub',this.el);
			var $content = $('.ej_comment__content',this.el);
			//debugger;
			
			$pub.on('click',e=>{

				this._pubSuccess().then(res=>{
					if(auto_hide) this.hide();

					try{
							//debugger;
						var {html_title,html_content,text_content,edit_time} = res;

						this.trigger('success',{
							el:$content[0],html_title,text_content, html_content,edit_time,upload_pictures:this.upload_pictures
							,el_active:this.el_active
						});
						
						if(auto_clear) this.clear();
					}catch(e){
						alert(e);
					}
					
          
				});


			});
			
		}
		,_createChild(){

			el_parent.appendChild(this.el);

			this.el.innerHTML = `
				<div class="ej_wrap rel">
					<div class="abs wh">
						<div class="ej_comment__input">
							<div class="ej_comment__title rel">
								<input type="text" defaultValue="加个标题哟~" />
							</div>
							<div class="ej_comment__content" contenteditable="true" defaultValue="尽情发挥吧..."><p></p></div>
						</div>
						<div class="ej_comment__bot rel">
							<ul>	
								<li title="添加表情"></li>
								<li title="添加图片"><input class="ej_comment__chooseimg" type="file"/></li>
							</ul>
							<button class="ej_comment__pub rel">
								<span class="abs wh">发表</span>
							</button>
							<button class="ej_comment__cancel rel">
								<span class="abs wh">取消</span>
							</button>
						</div>
					</div>
					
				</div>

				<div class="smile-holder">
					
        </div>

        <div class="ej-comment__msg abs">
          <div class="abs wh">
            <span>输入几个字？</span>
          </div>
        </div>
			`;

			this.$ipt = $('input',this.el)[0];

			this.$pub = $('.ej_comment__pub',this.el);
			this.$content = $('.ej_comment__content',this.el);
			
      this.$bot_pick = $('.ej_comment__bot ul',this.el);

      this.$msg = $('.ej-comment__msg',this.el);
      this.$msg_text = $('.ej-comment__msg span',this.el);


		}
		,el:document.createElement('ej-comment')
	},K.MxEvent);

	return o.init();
}


Editor.encodeBase64 = (props,{api='/upload'})=>{

	//debugger;
	//console.log(htmls);
	// htmls = htmls.replace('src\="data\:image.+?"',(a,b,c)=>{
	// 	console.log(a);
	// 	return '$$$';
	// })

	var {html_content,upload_pictures,text_content} = props;
	var $holder = document.createElement('div');
	//document.body.appendChild($holder);
	$holder.innerHTML = html_content;

	var $imgs = [...$holder.querySelectorAll('img.from-input-ovo')];

	return new Promise(r=>{
		Promise.all(
			$imgs.map(($img,i)=>{
				return new Promise(r=>{
					//console.log($img.src);
					//alert('api!!');

					$.post(api,{base64:$img.src,suff:$img.getAttribute('suffix-ovo')},res=>{

						try{
							//console.log('res:',res);
							//res = JSON.parse(res);
							
							res = eval(res);
							//$img.src = res.url;
							$img.src = res.attr.url;

							upload_pictures[i].src = $img.src;

							r();

						}catch(e){ alert(`img convert err:${e}`)}		
					});

						//$img.src = '//23333ccx.png';
						//	upload_pictures[i].src = $img.src;
						
						//r();
					
					
				});

			})
		).then(res=>{
		//	alert($holder.innerHTML);
			//console.log('$holder.innerHTML,',$holder.innerHTML);

			r({
				html_content:$holder.innerHTML
				,html_title:props.html_title
				,upload_pictures:upload_pictures
				,edit_time:props.edit_time
				,el:props.el
				,text_content
			});


		})
	});

}
export default Editor;






