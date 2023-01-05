const providers = {
  placeholder(el) {
    const img = document.createElement("img")
    img.src = "/adplaceholder.png"
    el.replaceChildren(img)
  },
  none(el) {
    el.replaceChildren()
  }
}

const apregex = /(?<=[?&])ads=(\w+)(?=&|$)/
const default_ap = "none"
const prefer_ap = apregex.exec(location.search)?.[1] ?? default_ap
const apfunction = providers[prefer_ap] ?? providers[default_ap];