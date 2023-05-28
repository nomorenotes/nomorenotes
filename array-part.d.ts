declare interface Array<T> {
  part(pred: (el: T, idx: number, ary: this) => boolean): [this, this]
}
