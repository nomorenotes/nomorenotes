async function main() {
  const [data, style] = await Promise.all([
    fetch("/objects.json")
    .then(res => res.json()),
    fetch("/cyobjects.css")
    .then(res => res.text())
  ])
  const c = cytoscape({
    container: cy,
    elements: data,
    style,
    layout: {
      name: "dagre",
      fit: false,
      maximal: true,
      animate: true
    }
  })
  c.on("mouseover", "node", e => {
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
}

main()