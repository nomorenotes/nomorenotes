;(url) => {
  const iframe = document.createElement("iframe")
  Object.assign(iframe.style, {
    // width: 0, height: 0,
    position: "absolute",
    left: 0,
    top: 0,
    opacity: 0,
    transform: "translate(-100%, -100%)",
  })

  iframe.src = url
  document.body.appendChild(iframe)
  // alert(iframe)
}
