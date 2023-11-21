let _print, _println;
let cancelStack = 0;
const CANCEL = Symbol("[Operation canceled]");

export function cancel(fn) {
  return function (...args) {
    cancelStack++;
    try {
      fn.apply(this, args);
    } catch (e) {
      if (e === CANCEL) return;
    } finally {
      cancelStack--;
    }
  };
}
export function writeln(text, ...args) {
  text = [...(text ?? [])];
  let out = text.shift();
  while (text.length) {
    out += args.shift() + text.shift();
  }
  _println(out);
}
export function write(text, ...args) {
  text = [...(text ?? [])];
  let out = String(text.shift());
  while (text.length) {
    out += String(args.shift()) + String(text.shift());
  }
  _print(out);
}
export function startwrite(print, println) {
  _print = print;
  _println = println;
}
export function ask(text, ...args) {
  text = [...(text ?? [])];
  const d = text[text.length - 1] === "" ? (text.pop(), args.pop()) : "";
  let out = String(text.shift());
  while (text.length) {
    out += String(args.shift()) + String(text.shift());
  }
  const ret = prompt(out, d);
  if (cancelStack && ret == null) throw CANCEL;
  return ret;
}
export function ok(text, ...args) {
  text = [...(text ?? [])];
  const d = text[text.length - 1] === "" ? (text.pop(), args.pop()) : "";
  let out = String(text.shift());
  while (text.length) {
    out += String(args.shift()) + String(text.shift());
  }
  return confirm(out);
}
export function wow(text, ...args) {
  text = [...(text ?? [])];
  const d = text[text.length - 1] === "" ? (text.pop(), args.pop()) : "";
  let out = String(text.shift());
  while (text.length) {
    out += String(args.shift()) + String(text.shift());
  }
  if (cancelStack) {
    if (!confirm(out)) throw CANCEL;
    else;
  }
  else alert(out);
}
