#    editor-ovo
一个适用于移动web的富文本编辑器，实现了照片、表情、文字混排编辑。

A rich text editor for mobile web. Mixed editing of photos and Emoji

当前有很多提供emoji表情的编辑器：一类编辑器提供的功能很简单，仅能输入文字和emoji标记（如：$apple$）；还有一种编辑器功能很强大，大多用在pc端，可以控制输入字体样式、字号、图片插入、emoji插入、超链、等等。不过呢，没有搜索到比较好用的，能满足工作需求的。所以决定打造一个能提供文字输入、自定义emoji图片、输入emoji字符、相册选取图片的混排编辑器。

这个编辑器的样式设计很通用，希望它也能运用到你的项目中，并帮你解决问题:lollipop::lollipop::lollipop:


# Screenshot

![pic1](https://github.com/dwqdaiwenqi/readme-img/raw/master/pic1.jpg)

![pic1](https://github.com/dwqdaiwenqi/readme-img/raw/master/pic2.jpg)


# Install

```js
npm install editor-ovo --save
```
## or

```js
cnpm install editor-ovo --save
```

# CDN
* [https://unpkg.com/editor-ovo@1.1.3/dist/scripts/main1.js](https://unpkg.com/editor-ovo@1.1.4/dist/scripts/main1.js)


# Usage
### HTML
```html
  <script src="http://static.xyimg.net/common/js/jquery-1.8.3.min.js"></script>
  <script src="node_modules/editor-ovo/dist/scripts/main1.js"></script>
  <!--或者-->
  <!-- <script src="https://unpkg.com/editor-ovo@1.1.3/dist/scripts/main1.js"></script> -->
  <!-- ... -->
  <button id="btn1"></button>
  <!-- ... -->
  <button id="btn2"></button>
  <!-- ... -->
```
### JS
```js
new EditorOvO.Reply({
  $el_active:'#btn1'
  ,config : { }
  ,convert_into_entities : false
  ,onComplete(props){
    console.log(props);
    //this.clear();
    //this.hide();

  }
})

////
new EditorOvO.Editor({
  $el_active:'#btn2'
  ,config : { }
  ,convert_into_entities : false
  ,onComplete(props){
    console.log(props);
    //this.clear();
    //this.hide();
    
  }
})
```
### Work with module bundler

```js
import {Reply,Editor} from 'editor-ovo';

new Reply({
    // ...
});

new Editor({
    // ...
});

```

# Api
### Options
```js
{
  //激活编辑器的元素
  $el_active:'#element'

  //不必须，默认是false
  //如果数据库不支持切换到utf8mb4的存储方式，那么可以将参数设置为true
  //将'😁'转换为实体'&#128513;' 进行存储
  convert_into_entities : true
  //////

  //不必须，默认的提示信息如下
  ,config : {
    //都不是必须
    TITLE_EMPTY:'标题不能为空'
    ,TITLE_TOO_LONG:'标题太长...'
    ,CONTENT_EMPTY:'编辑内容不能为空'
    ,PHOTO_TOO_MANY:'你传的照片太多了吧...'
    ,SMILE_TOO_MANY:'你发的表情太多了吧...'
    ,WORD_TOO_MANY:'你写的字数太多了吧...'
    ,PHONE_TOO_BIG:'图片太大了'
    ,SUCCESS:'发表成功'
    ,MAX_CONTENT_WORDS:800
    ,MAX_TITLE_WORDS:50
    ,MAX_SIZE_PHOTO : 1024*1024*4
    ,MAX_SMILES :20
    ,MAX_PHOTOES:6
  }
  //不必须，完成编辑后的回调
  ,onComplete:function(props){
    
    //this.hide()
    //this.clear();

    //如需对各个base64生成url
    this.generateUrl('/upload',props).then(res=>{
      //..
    });
  }
}

```
### Nodejs Api
```js
//nodejs 生成图片url 
app.post('/upload', function(req, res){
	res.header('Access-Control-Allow-Origin', '*');

	var base64_ = req.body.base64;

	var suff = req.body.suff;

	var buffer_ = new Buffer(base64_.replace(/^data:image\/\w+;base64,/, ''), 'base64');
	var img_name = `image-${Date.now()}.${suff}`;

  //请更改自己图片路径位置！
	fs.writeFile(`./example/upload/${img_name}`, buffer_, (err)=>{
    var resx = {attr:{url:`../example/upload/${img_name}`	}	}
    err?res.send('fail!'):res.end( `(${JSON.stringify(resx)})` );
	});
 
});

```


## Methods
| 方法     | 类型     | 描述 | 必需 | 
| :------------- | :------------- | :------------- | :------------- | 
| clear         | function      | 清除当前编辑器内容 | 否 | 
| show         | function      | 显示它 | 否 | 
| hide         | function      | 隐藏它 | 否 | 
| destory         | function      | 销毁它 | 否 | 
| unbind         | function      | 解绑它 | 否 | 
| generateUrl     | function      | 对各个base64生成url | 否 |

## Storge in Mysql
如果把用户自己输入的emoji字符也存到mysql数据库中，那么需要对mysql存储方式进行改变。存储单个emoji需要4字节，为了支持4字节的存储，在mysql中需要从'utf8'切换到'utf8mb4'。

如果不方便更改存储编码，也可将options配置中convert_into_entities设置为true，以便存储。


## Run the example
```js
npm install 
npm install webpack -g
npm run example
npm run start
```
open [http://localhost:82/example](http://localhost:82/example)

# License
This content is released under the [MIT](http://opensource.org/licenses/MIT) License.
