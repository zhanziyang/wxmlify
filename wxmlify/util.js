module.exports = {
  BLOCK_ELEMENTS: [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'p',
    'div',
    'pre',
    'table',
    'tbody',
    'tfoot',
    'tr',
    'ul',
    'ol',
    'li',
    'video',
    'dl',
    'dt',
    'dd',
    'hr',
    'blockquote'
  ],

  decodeHTMLEntities(text) {
    var entities = {
      'amp': '&',
      'apos': '\'',
      '#x27': '\'',
      '#x2F': '/',
      '#39': '\'',
      '#47': '/',
      'lt': '<',
      'gt': '>',
      'nbsp': ' ',
      'quot': '"'
    }
    return text.replace(/&([^;]+);/gm, function (match, entity) {
      return entities[entity] || match
    })
  },

  copy(source) {
    if (typeof source !== 'object') return source
    var obj = {}
    for (var prop in source) {
      if (source.hasOwnProperty(prop)) {
        obj[prop] = source[prop]
      }
    }
    return obj
  },

  assign(target, varArgs) {
    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }

    var to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index];

      if (nextSource != null) {
        for (var nextKey in nextSource) {
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  },

  validateHtmlString(html) {
    return true
  }
}