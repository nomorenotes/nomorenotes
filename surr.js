exports.unsurrogate = function (p2_idx, text) {
  var p1_idx = p2_idx
  for (var i = 0; i < text.length && i < p2_idx; i++) {
    var char_code = text.charCodeAt(i)
    // check for the first half of a surrogate pair
    if (char_code >= 0xd800 && char_code < 0xdc00) {
      p1_idx -= 1
    }
  }
  return p1_idx
}

exports.surrogate = function (p1_idx, text) {
  var p2_idx = p1_idx
  for (var i = 0; i < text.length && i < p2_idx; i++) {
    var char_code = text.charCodeAt(i)
    // check for the first half of a surrogate pair
    if (char_code >= 0xd800 && char_code < 0xdc00) {
      p2_idx += 1
    }
  }
  return p2_idx
}

exports.issurrogate = function (text) {
  if (typeof text != typeof "string")
    throw new TypeError(`expected ${typeof "string"}, got ${typeof text}`) // require string
  var p1_idx = text.length
  return exports.surrogate(p1_idx, text) != p1_idx
}
