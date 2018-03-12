#    editor-ovo
一个适用于移动web的富文本编辑器。照片加emoji的混合编辑

A rich text editor for mobile web. Mixed editing of photos and Emoji

当前有很多提供输入emoji表情的编辑器，一类编辑器比较轻巧，实现了混合编辑输入的文字和emoji表情标记(例如微笑是 :smile:)。还有一种编辑器功能很强大，大多用在pc端，可以控制输入字体样式、字号、图片插入、emoji插入、超链、等等。。

这两类都不能满足工作需求，下面这个编辑器实现了自定义表情（非标记符号）、手机输入的表情、手机照片的混排。


# Screenshot

![Image text](https://github.com/dwqdaiwenqi/readme-img/raw/master/pic1.jpg)

# Install

```js
npm install editor-ovo
```
# Usage
### HTML
```html
  <script src="http://static.xyimg.net/gamesite/mu/mufed/common/js/polyfill.min.js"></script>
	<script src="http://static.xyimg.net/common/js/jquery-1.8.3.min.js"></script>
```
### JS
```js
new Reply({
  $el_active:'#reply-el'
  ,config : {
    TITLE_EMPTY:'回复内容不能为空'
    ,SUCCESS:'回复成功'
    ,WORD_TOO_MANY:'你写的字数太多了吧...'
    ,SMILE_TOO_MANY:'你发的表情太多了吧...'
    ,MAX_WORDS:500
    ,MAX_SMILES:20
  }
  ,convert_into_entities : true
  ,onComplete(props){
    console.log(props);

    //this.clear();
    //this.hide();

  }
})

////
new Post({
  $el_active:'#post-el'
  ,convert_into_entities : true
  ,onComplete(props){
    console.log(props);

    //this.clear();
    //this.hide();

  }
})
```
#### Work with module bundler

```js
import EditorOvO from 'editor-ovo';

new EditorOvO.Post({
    // ...
});

new EditorOvO.Reply({
    // ...
});

```

# Options
```js
{aaa:'aaa'}
```


# License
This content is released under the [MIT](http://opensource.org/licenses/MIT) License.