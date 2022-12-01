const providers = {
  placeholder(el) {
    const img = document.createElement("img")
    img.src = "/adplaceholder.png"
    el.replaceChildren(img)
  }
  none(el) {
    el.replaceChildren()
  }
}

const apregex = /(?<=[?&])ads=(\w+)(?=&|$)/
const default_ap = "placeholder"
const prefer_ap = apregex.exec(location.search)?.[1] ?? "false"
const apfunction = providers[prefer_ap] ?? providers[default_ap]
alert(`ads from ${prefer_ap} (default ${default_ap})`)