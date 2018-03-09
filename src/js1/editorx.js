/**
 * 编辑帖子模块
 * 
 * @param {object} el_active 激活dom
 * @param {object} [{el_parent=document.body,z_index=999,auto_hide=true}={}] 
 * @returns 
 */
Ej.Editor = (el_active,{el_parent=document.body,z_index=999,auto_hide=false}={})=>{
	var o = $.extend(true,{
		init(){
			
			this._last_el;

			this._createChild();
			this._postHandle();

			this._chooseImgHandle((img)=>{
				let s = img.width/img.height;
				img.width = min(img.width,innerWidth*.666);
				img.style.display = 'block';
				//img.width = innerWidth*.5;
				this.$content.append(img);

				///
				this._setLastEditEl(this.$content);
			});
		
			$(this.el).css({
				width:innerWidth+'px',height:innerHeight+'px'
				,zIndex:z_index
			});

			this.smile = Ej.Smile(this.el.querySelector('.smile-holder') );

			this._pickSmileHandle();

			this.hide();

			{
				$(el_active).on('click',e=>{
					this.show();
				});

				$('.ej_commont__cancel',this.el).on('click',e=>{
					this.hide();
				})
			}
			


			{
				this.$content[0].addEventListener('input',e=>{
					//console.log(123);
					//console.log(e.target);
					//var childs = this.$content[0].children;
					//var last_el =  this._editLastChild();

					this._setLastEditEl(this._editLastChild());
					//console.log(this._last_el);

				})

				addEventListener('keydown',e=>{
					if(e.keyCode!=89) return;
					//console.log(e.keyCode);
					//console.log();
				})

			}

			return this;
		}
		,_setLastEditEl($last_el){
			this._last_el = $last_el;

		}
		,_editLastChild(){
			var child = this.$content[0].children;
			if(!child) return this.$content;

			var i = 0;

			//如何是图片但是是最后一个child那么也是插入到$content中！
			var f = (child,idx)=>{
				if(++i>100000) return alert('查找次数过多qwq');

				if(idx<0 || !child) return this.$content;
				
				var node_name = child[idx].nodeName.toLowerCase();

				if(node_name ==='img'&&idx===child.length-1) return this.$content;
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

			{
				let i = 0;
				$smile_li.on('click',e=>{
					++i%2===0?this.smile.hide():this.smile.show();
				})
			}

			// setTimeout(()=>{
			// 	console.log(this.$content);
			// },1234);

			this.smile.on('pick',(props)=>{
				
				//this.$content.append(props.el);

				this._last_el.append(props.el);
			})

		}
		,_chooseImgHandle(fn){
			var $chooseimg = $('.ej_comment__chooseimg',this.el);

			
			
			$chooseimg[0].addEventListener('change',()=>{
				const frd = new FileReader();
				//console.log('filereader!');
				frd.addEventListener('load',()=>{
					const pic = document.createElement('img');
				
					pic.addEventListener('load',()=>{
					
						//console.log(pic);
						fn(pic);


					});
					pic.src = frd.result;
				});
				//debugger;
				//$chooseimg[0].files[0].size
				frd.readAsDataURL($chooseimg[0].files[0]);
			});
		}
		,_pubSuccess(){
			return new Promise(r=>{
				// this.$ipt.value
				// this.$content.html()
				var html_title =  this.$ipt.value.trim()
				var html_content =  this.$content.html().trim();

				if(!html_title.length||!html_content.length) return this._showFailMsg('内容长度不正确');
				

				r({html_title,html_content});
			})
		}
		,clear(){
			this.$ipt.value = '';
			this.$content.html('');
		}
		,_showFailMsg(msg,{}={}){
			console.log(msg);
		}
		,_postHandle(){
			var $pub = $('.ej_commont__pub',this.el);
			var $content = $('.ej_comment__content',this.el);
			//debugger;
			
			$pub.on('click',e=>{
			
				this._pubSuccess().then(res=>{
					if(auto_hide) this.hide();
					//debugger;
					var {html_title,html_content} = res;

					this.trigger('success',{el:$content[0],html_title, html_content});
					this.clear();


				});



				/////////////////////

			// twemoji.parse($content[0]);
				// twemoji.parse($content[0],(icon,options)=>{
				// 	//console.log('./src/common/img/2/' + options.size + '/' + icon + '.png');
				// 	return './src/common/img/2/' + options.size + '/' + icon + '.png';
				// });

				//
			// var div = document.createElement('div');
			// div.innerHTML = 'I \u2764\uFE0F emoji!';
			// document.body.appendChild(div);

			// //alert(div.innerHTML)
			// debugger;
			// twemoji.parse(document.body);

			// var img = div.querySelector('img');

			// // note the div is preserved
			// img.parentNode === div; // true

			// img.src;        // https://twemoji.maxcdn.com/36x36/2764.png
			// img.alt;        // \u2764\uFE0F
			// img.className;  // emoji
			// img.draggable;  // false


				//////////////
			//$('#mock-res').html($content.html());
				//////////////

				// $.post('/api/posted',{html:$content.html().trim()}, res=>{
				// 	res = JSON.parse(res);
				// 	//alert(res.cache);

				// 	$('#mock-res').html(res.html);
				// 	//console.log(res);
				// });

				//debugger;
			})
			
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
							<div class="ej_comment__content" contenteditable="true" defaultValue="尽情发挥吧...">内容?</div>
						</div>
						<div class="ej_comment__bot rel">
							<ul>	
								<li title="添加表情"></li>
								<li title="添加图片"><input class="ej_comment__chooseimg" type="file"/></li>
							</ul>
							<button class="ej_commont__pub rel">
								<span class="abs wh">发表</span>
							</button>
							<button class="ej_commont__cancel rel">
								<span class="abs wh">取消</span>
							</button>
						</div>

					</div>
					
				</div>

				<div class="smile-holder">
					
				</div>
			`;

			this.$ipt = $('input',this.el)[0];

			this.$pub = $('.ej_commont__pub',this.el);
			this.$content = $('.ej_comment__content',this.el);

			//debugger;

			// addEventListener('click',e=>{
			// //	this.$ipt.click();
			// 	console.log(this.$ipt[0]);
			// })
			// // this.$ipt[0].focus();

			// console.dir(this.$ipt);
		}
		,el:document.createElement('ej-commont')
	},K.MxEvent)
	return o.init();
}