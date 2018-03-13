#    editor-ovo
一个适用于移动web的富文本编辑器。照片加emoji的混合编辑

A rich text editor for mobile web. Mixed editing of photos and Emoji

当前有很多提供emoji表情的编辑器。一类编辑器比较轻巧，实现了混合编辑输入的文字和emoji表情标记(例如微笑是 $smile$)。还有一种编辑器功能很强大，大多用在pc端，可以控制输入字体样式、字号、图片插入、emoji插入、超链、等等。
这两类都不能满足工作需求，下面这个编辑器混合编辑了：选择自定义的emoji表情（非标记符号）、各端输入的emoji表情、相册选取图片。

这个编辑器的样式设计很通用，希望它能运用到你的项目中，并帮你解决问题:lollipop::lollipop::lollipop:


# Screenshot

![Image text](https://github.com/dwqdaiwenqi/readme-img/raw/master/pic1.jpg)
![Image text](https://github.com/dwqdaiwenqi/readme-img/raw/master/pic2.jpg)

# Install

```js
npm install editor-ovo --save
```
or

```js
cnpm install editor-ovo --save
```
# Usage
### HTML
```html
  <script src="http://static.xyimg.net/common/js/jquery-1.8.3.min.js"></script>
  <script src="node_modules/editor-ovo/dist/scripts/main1.js"></script>
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
new EditorOvO.Post({
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
#### Work with module bundler

```js
import {Reply,Post} from 'editor-ovo';

new Post({
    // ...
});

new Reply({
    // ...
});

```

# Options
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
}

```

## 使用mysql进行存储
如果把用户自己输入的emoji字符也存到mysql数据库中，那么需要对mysql存储方式进行改变。存储单个emoji需要4字节，为了支持4字节的存储，在mysql中需要从'utf8'切换到'utf8mb4'。


# License
This content is released under the [MIT](http://opensource.org/licenses/MIT) License.
