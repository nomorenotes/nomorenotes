let _print, _println;

export function writeln(text, ...args) {
  text = [...text];
  let out = text.shift();
  while (text.length) {
    out += args.shift() + text.shift();
  }
  _println(out);
}
export function write(text, ...args) {
  text = [...text];
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
