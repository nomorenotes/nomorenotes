Object.assign(exports, {
  lazy(fn) {
    let called = false;
    let value;
    return function() {
      if (!called) {
        called = true;
        value = fn.apply(this, arguments);
      }
      return value;
    }
  }
})
Object.assign(exports.lazy, {
  on(obj, name, fn) {
    fn = this(fn)
    Object.defineProperty(obj, name, {
      get: function() {
        return fn();
      }
    })
  }
})