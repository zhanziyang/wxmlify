# Wxmlify
一个轻量快速的插件，帮助你在微信小程序中显示富文本编辑器生成的HTML。
#### 注：新版微信小程序已提供`<rich-text>`富文本组件，但其兼容性暂时没有保证，你可能还是需要第三方解析工具。

## 优点

- 体积小轻量 - 只需2个文件，总共14kb
- 不添加多余样式，利于自定义文档样式
- 可选择性保留原文档样式，如指定保留原文档的`font-size`, `font-weight`等
- 用法简便

## 缺点
- 偏向于对**富文本编辑器**生成的HTML进行解析，并不适用于所有场景。因为富文本编辑器生成的HTML符合一定的规范。

## 用法 ([demo](https://github.com/zhanziyang/wxmlify/tree/master/example))

1. 把 [wxmlify](https://github.com/zhanziyang/wxmlify/tree/master/wxmlify) 文件夹复制到你的 weapp 项目下。
2. 在你需要显示富文本的页面 js 中引入，并 new 一个实例，比如：

```js
// pages/index/index.js

var Wxmlify = require('../../wxmlify/wxmlify.js')

Page({
  onLoad() {
    // 以任何方式获得要解析的Html代码
    var html = getHTMLStringSomehow() 

    // new 一个 wxmlify 实例就好了
    var wxmlify = new Wxmlify(html, this, {})
  }
})
```
3. 在对应的页面 wxml 中引入模板，比如：
```html
<!-- pages/index/index.wxml  -->
<import src="../../wxmlify/wxmlify.wxml" />

<template is="wxmlify" data="{{nodes: wxmlified}}"></template>
```
---

## Doc 查阅

### 构造函数
```js
new Wxmlify(html, page [, options])
```
- 参数：
  - html: 字符串 - 要解析的html代码字符串
  - page: 小程序页面实例 - 也就是所有页面方法内`this`的指向
  - options: [选项](#选项)
- 返回值：一个wxmlify实例，用于调用方法

### 选项

#### dataKey
- 解析后数据在页面data中的key
- 类型：`string`
- 默认：`'wxmlified'`
- 例如：
```js
new Wxmlify(html, this, {
  dataKey: 'myRichText'
})
```
相应地在wxml中：
```html
<template is="wxmlify" data="{{nodes: myRichText}}"></template>
```

#### preserveStyles
- 要保留的css样式名称（驼峰格式）
- 类型：
  - 字符串 `'all'`， 表示保留所有样式
  - 否定值，如`false`, `0`, `null`，表示移除所有自带样式
  - 数组，指定保留某些样式，如`['fontSize', 'fontWeight', 'background']`
- 默认：`'all'` (默认保留所有样式)

#### disableImagePreivew
- 禁用图片点击预览
- 类型：`boolean`
- 默认：`false`

#### onImageTap
- 图片点击处理函数
- 类型：`function`
- 默认：`function() {}`

### 方法

#### wxmlify.getFullNodes()
- 返回一个Javascript数组，HTML 被解析后的 json数据结构

#### wxmlify.getHTML()
- 返回传入的HTML

#### wxmlify.getImages()
- 返回数组，包含所有图片的url

### 自定义样式
```css
.wxmlified-element {
  /* 修改段落块的样式 */
}

.wxmlified-element.h1 {
  /* 修改原<h1>标签块的样式，其它块级标签同理 */
}

.wxmlified-image {
  /* 修改图片的样式 */
}

.wxmlified-text {
  /* 修改文字节点的样式 */
}
```
---

💗 This little tool is made possible thanks to an open source HTML-to-JSON parser **[himalaya](https://github.com/andrejewski/himalaya)** made by Chris Andrejewski.