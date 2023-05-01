describe("iomodule.js", () => {
  const iom = require("./iomodule.js")
  it("re-exports `r.js` as `r`", () => {
    expect(iom.r).toBe(require("./r.js"))
  })
})