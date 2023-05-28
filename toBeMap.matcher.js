const { diff } = require("jest-diff")
expect.extend({
  toBeMap(received, expected) {
    const options = {
      isNot: this.isNot,
      promise: this.promise,
    }

    const pass = Object.is(received, expected)

    const message = pass
      ? () =>
          // eslint-disable-next-line prefer-template
          this.utils.matcherHint("toBeMap", undefined, undefined, options) +
          "\n\n" +
          `Expected: not ${this.utils.printExpected(expected)}\n` +
          `Received: ${this.utils.printReceived(received)}`
      : () => {
          const diffString = diff(expected, received, {
            expand: this.expand,
          })
          return (
            // eslint-disable-next-line prefer-template
            this.utils.matcherHint("toBeMap", undefined, undefined, options) +
            "\n\n" +
            (diffString && diffString.includes("- Expect")
              ? `Difference:\n\n${diffString}`
              : `Expected: ${this.utils.printExpected(expected)}\n` +
                `Received: ${this.utils.printReceived(received)}`)
          )
        }

    return { actual: received, message, pass }
  },
})
