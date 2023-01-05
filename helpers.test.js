const helpers = require('./helpers.js')

describe("helpers.lazy", () => {
  function doTests(fn, val) {
    expect(fn).toBeTruthy()
    expect(fn._called).toBeFalsy()
    expect(fn._value).toBeUndefined()
    expect(fn()).toBe(val)
    expect(fn._called).toBeTruthy()
    expect(fn._value).toBe(val)
  }
  it("should return a function that lazily evaluates the given function", () => {
    const fn = helpers.lazy(() => "foo")
    doTests(fn, "foo")
  })
  describe(".on", () => {
    it("should add a lazily evaluated property to an object", () => {
      const obj = {}
      const fn = helpers.lazy.on(obj, "foo", () => "bar")
      expect(fn).toBeTruthy()
      expect(fn._called).toBeFalsy()
      expect(fn._value).toBeUndefined()
      expect(obj.foo).toBe("bar")
      expect(fn._called).toBeTruthy()
      expect(fn._value).toBe("bar")
    })
  })
})