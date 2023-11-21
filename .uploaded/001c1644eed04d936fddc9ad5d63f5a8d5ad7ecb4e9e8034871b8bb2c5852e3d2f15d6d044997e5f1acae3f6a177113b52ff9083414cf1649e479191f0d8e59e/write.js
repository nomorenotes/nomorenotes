let _print, _println;

function writeln(text, ...args) {
  text = [...text];
  let out = text.shift();
  while (text.length) {
    out += args.shift() + text.shift();
  }
  _println(out);
}
function write(text, ...args) {
  text = [...text];
  let out = String(text.shift());
  while (text.length) {
    out += String(args.shift()) + String(text.shift());
  }
  _print(out);
}
function startwrite(print, println) {
  _print = print;
  _println = println;
}
