var himalaya = require('./himalaya')
var u = require('./util')
var defaultOptions = require('./options')

function Wxmlify(html, page, options) {
  // 检查第一个参数
  if (typeof html !== 'string') {
    throw TypeError('Wxmlify 的第一个参数必须是字符串，代表要解析的HTML代码')
  }

  if (!u.validateHtmlString(html)) {
    console.warn('HTML代码格式不合法或不规范，解析结果可能不符合预期')
  }

  // 检查第二个参数
  if (typeof page !== 'object' || typeof page.setData !== 'function') {
    throw TypeError('Wxmlify 的第二个参数必须是微信小程序的一个页面实例')
  }

  this.html = html
  this.page = page
  options = options || {}
  this.options = u.assign({}, defaultOptions, options)
  this.fullNodes = himalaya.parse(u.decodeHTMLEntities(html))
  this.images = []

  this.init()
}

Wxmlify.prototype.init = function () {
  this.traverse()
  this.bindEvents()
  this.exec()
}

Wxmlify.prototype.exec = function () {
  var wxmlified = []
  for (var i = 0, len = this.fullNodes.length; i < len; i++) {
    var node = this.fullNodes[i]
    if (node.type == 'Element' && node.children.length) {
      var descendants = []
      this.getDescendants(node, descendants)
      if (descendants.length) {
        node.descendants = descendants
      }
      wxmlified.push(node)
    } else {
      node.styles = this.getStyles(node)
      node.styleString = this.stringifyStyle(node.styles)
      wxmlified.push(node)
    }
  }

  var data = {}
  data[this.options.dataKey] = wxmlified
  this.page.setData(data)
}

Wxmlify.prototype.bindEvents = function () {
  var _this = this.page
  _this.__wxmlifyImageTapHandler = this.imageTapHandler.bind(this)
}

Wxmlify.prototype.imageTapHandler = function (event) {
  var attr = event.currentTarget.dataset.attributes || {}
  var _this = this.page
  if (!this.options.disableImagePreivew) {
    wx.previewImage({
      current: attr.src,
      urls: this.images
    })
  }
  this.options.onImageTap && this.options.onImageTap(event)
}

Wxmlify.prototype.getFullNodes = function () {
  return this.fullNodes
}

Wxmlify.prototype.getDescendants = function (element, descendants) {
  var children = element.children || []
  var elementStyle = this.getStyles(element)
  element.styles = elementStyle
  element.styleString = this.stringifyStyle(elementStyle)
  for (var j = 0, len = children.length; j < len; j++) {
    var child = children[j]
    child.styles = elementStyle
    child.styleString = this.stringifyStyle(elementStyle)
    if (child.children && child.children.length) {
      this.getDescendants(child, descendants)
      if (u.BLOCK_ELEMENTS.indexOf(child.tagName) >= 0) {
        descendants.push({
          type: 'BIB', // block in block
          tagName: child.tagName,
          styles: {},
          styleString: ''
        })
      }
    } else {
      descendants.push(child)
    }
  }
}

Wxmlify.prototype.getStyles = function (element) {
  var original = u.copy(element.styles) || {}
  this.addTagStyles(original, element.tagName)
  var preserveStyles = this.options.preserveStyles || []
  if (element.attributes && element.attributes.style) {
    var fromAttr = element.attributes.style
    for (var prop in fromAttr) {
      if (fromAttr.hasOwnProperty(prop)) {
        if (preserveStyles == 'all' || preserveStyles.indexOf(prop) >= 0) {
          original[prop] = fromAttr[prop]
        }
      }
    }
  }

  return original
}

Wxmlify.prototype.addTagStyles = function (original, tagName) {
  if (tagName == 'b' || tagName == 'strong') {
    original['fontWeight'] = 'bold'
  }

  if (tagName == 'i' || tagName == 'em') {
    original['fontStyle'] = 'italic'
  }

  if (tagName == 's') {
    original['text-decoration'] = 'underline'
  }

  if (tagName == 'del') {
    original['text-decoration'] = 'line-through'
  }
}

Wxmlify.prototype.stringifyStyle = function (style) {
  var str = ''
  for (var prop in style) {
    if (style.hasOwnProperty(prop)) {
      var propName = prop.replace(/[A-Z]/, function (match) {
        return '-' + match.toLowerCase()
      })
      var value = style[prop]
      str += (propName + ': ' + value + '; ')
    }
  }
  return str
}

Wxmlify.prototype.traverse = function () {
  this.fullNodes = this.fullNodes || []
  var _this = this
  var forEach = function (node) {
    // console.log(node.type, node.tagName)
    if (node.tagName == 'img') {
      _this.images.push(node.attributes.src)
    }
  }
  for (var i = 0, len = this.fullNodes.length; i < len; i++) {
    var node = this.fullNodes[i]
    forEach(node)
      ; (function recursion(parent) {
        var children = parent.children || []
        for (var j = 0, len = children.length; j < len; j++) {
          var child = children[j]
          forEach(child)
          recursion(child)
        }
      }(node))
  }
}

module.exports = Wxmlify