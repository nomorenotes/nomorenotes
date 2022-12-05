Object.assign(exports, {
  lazy(get) {
    return function fn() {
      if (!fn._called) {
        fn._called = true;
        fn._value = get.apply(null, arguments);
      }
      return fn._value;
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
    return fn
  }
})