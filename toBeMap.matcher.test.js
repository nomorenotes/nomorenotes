require("./toBeMap.matcher.js")

describe("expect.toBeMap", () => {
  it.failing("fails with identical objects but different objects", () => {
    expect({}).toBeMap({})
  })
  it.failing("fails with different objects", () => {
    expect({ a: 1 }).toBeMap({ b: 2 })
  })
  it("succeeds with identical objects that are the same", () => {
    const a = {}
    expect(a).toBeMap(a)
  })
  it("succeeds with different objects when inverted", () => {
    expect({ a: 1 }).not.toBeMap({ b: 2 })
  })
  it.failing(
    "fails with identical objects that are the same when inverted",
    () => {
      const a = {}
      expect(a).not.toBeMap(a)
    }
  )
})
