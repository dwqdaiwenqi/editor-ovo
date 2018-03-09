
import EXIF from 'exif-js';
import twemoji from 'twemoji';
import './pub.less';
import Editor from './editor';

/**
 * 编辑帖子模块
 * 
 * @param {object} el_active 激活dom
 * @param {object} [{el_parent=document.body,z_index=999,auto_hide=true}={}] 
 * @returns 
 */
var Pub = (el_active,props)=>{

	var that = Editor(el_active,{...props,el_name:'ej-pub'});


	that._domHandle = function(){

		{
	
			$(this.el_active).on('click',e=>{
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

	}

	that._createChild = function(){
		this.el = document.createElement(this.el_name);
		this.el_parent.appendChild(this.el);

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
	this._handleSuccess = function(){
		
	}
	
	that.init();

	that._domHandle();


	return that;

}


Pub.encodeBase64 = (props,{api='/upload'})=>{

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

export default Pub;






