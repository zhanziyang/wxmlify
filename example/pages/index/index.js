//index.js
//获取应用实例
var app = getApp()
var Wxmlify = require('../../wxmlify/wxmlify')
var html = require('../../test-data')['example']


Page({
  onLoad() {
    var wxmlify = new Wxmlify(html, this, {
      preserveStyles: 'all',
      dataKey: 'nodes',
      disableImagePreivew: false,
      onImageTap: function (evt) {
        console.log(evt)
      }
    })

    console.log(wxmlify.getFullNodes())
  }
})
