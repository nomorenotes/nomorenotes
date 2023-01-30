
function parseMessage(node) {
  if (typeof node === "object") {
    if (node.type in messageParsers) {
      return messageParsers[node.type](node)
    } else {
      return `<code style="color:red">[[${JSON.stringify[node]}]]`
    }
  } else if (permittedLiterals.includes(this.node)) {
    return node
  }
}

javascript:[eval(decodeUriComponent("%s"))].map(value => {try{value??(()=>{throw 1})()}catch{return}alert(JSON.stringify(value))}])