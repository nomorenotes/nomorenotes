const target = require('./jest.config.js')

describe("'jest.config'", () => {
  it.concurrent("should be an object", () => {
    expect(target).toEqual(expect.any(Object))
  })
  it.concurrent("should match snapshot", () => {
    expect(target).toMatchSnapshot()
  })
})