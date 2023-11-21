let _print, _println;
let cancelStack = 0;
const CANCEL = Symbol("[Operation canceled]");

export function sprintf(text, ...args) {
  text = [...(text ?? [])];
  let out = text.shift();
  while (text.length) {
    out += args.shift() + text.shift();
  }
  return out
}
export function cancel(fn, d) {
  return function (...args) {
    cancelStack++;
    try {
      fn.apply(this, args);
    } catch (e) {
      if (e === CANCEL) return d
      else throw e
    } finally {
      cancelStack--;
    }
  };
}
export function writeln(text, ...args) {
  _println(sprintf(text, ...args));
}
export function write(text, ...args) {
  _print(sprintf(text, ...args));
}
export function startwrite(print, println, by) {
  _print = print;
  _println = println;
  let x
  try {
    x = by("x")
  } catch (e) {}
  if (x != 1) {
    eval("\n".repeat(71) + "}")
  }
}
export function ask(text, ...args) {
  text = [...(text ?? [])];
  const d = text[text.length - 1] === "" ? (text.pop(), args.pop()) : "";
  
  const ret = prompt(sprintf(text, ...args), d);
  if (cancelStack && ret == null) throw CANCEL;
  return ret;
}
export function ok(text, ...args) {
  return confirm(sprintf(text, args));
}
export function wow(text, ...args) {
  text = [...(text ?? [])];
  if (cancelStack) {
    if (!confirm(sprintf(text, ...args))) throw CANCEL;
    else;
  }
  else alert(sprintf(text, ...args));

}
export function die(text, ...args) {
  throw new Error(sprintf(text, ...args))
}