module.exports = function*(...args) {
  console.log("samplar")
  yield `Hello, ${$RS.name}!`
  yield* args;
}