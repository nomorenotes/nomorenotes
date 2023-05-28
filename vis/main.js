$((_) => {
  let selectDomElement
  $(".select button").click(
    (selectDomEvent = (e) => {
      $(e.target.parentElement).find(".selected").removeClass("selected")
      $(e.target).addClass("selected")
      localStorage.NMNmode = $(e.target).attr("value")
    })
  )
  $("input").on("input", (e) => {
    if (e.target.value) localStorage.NMNname = e.target.value
    else localStorage.removeItem("NMNname")
  })
  if (localStorage.NMNname) $("input").val(localStorage.NMNname)
  selectDomEvent({
    target: $(
      `.select button[value=${localStorage.NMNmode ? localStorage.NMNmode : 0}]`
    )[0],
  })
})
