var Wxmlify = require('../../wxmlify/wxmlify')
var sample = require('../../sample')

Page({
  onLoad() {
    var wxmlify = new Wxmlify(sample.example2, this, {
      preserveStyles: 'all',
      dataKey: 'nodes',
      disableImagePreivew: false,
      onImageTap: function (evt) {
        console.log(evt)
      }
    })

    console.log(wxmlify.getFullNodes())
    // console.log(wxmlify.getHTML())
  }
})
