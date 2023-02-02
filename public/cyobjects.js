async function main() {
  const [data, style] = await Promise.all([
    fetch("/objects.json")
    .then(res => res.json()),
    fetch("/cyobjects.css")
    .then(res => res.text())
  ])
  //alert(typeof dqagre)
  //alert(typeof klay)
  const c = cytoscape({
    container: cy,
    style,
    elements: data
  })
  c.on("mouseover", "node.commit", e => {
    info.dataset.target = e.target.id()
    const children = [`<b>${e.target.id()}</b>`, e.target.data("message").map(line => "<p>"+line.trim().replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\n", "<br>")+"</p>")]
    info.innerHTML = children.join("")
  })
  c.on("mouseout", "node", e => {
    if (info.dataset.target === e.target.id()) {
      info.innerHTML = ""
      delete info.dataset.target
    }
  })
  c.on("mouseover", "node.refptr", e => {
    info.dataset.target = e.target.id()
    const children = [`<b>${e.target.data("ref")}</b>`, `<p>${e.target.data("ref_target")}</p>`]
    info.innerHTML = children.join("")
  })
  const opts = {
    fit: false,
    nodeDimensionsIncludeLabels: true,
    stop: () => c.fit()
  }
  c.layout({
    ...opts,
    name: "breadthfirst",
    //directed: true,
    //maximal: true,
    //transform(n, p) {return { x: p.x, y: -p.y }},
    randomize: true,
    //animate: false,
    roots: c.nodes(".refptr")
  }).run()
}


main()