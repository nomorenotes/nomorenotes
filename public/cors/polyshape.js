/**
 * A helper class for drawing several lines.
*/
export default class Polyline {
    x = 0
    y = 0
    history = []
    lines = []
    _bag = {}

    constructor(x = 0, y = 0) {
        this.x = x
        this.y = y
    }
    /**
     * Jumps to the given coordinates without drawing a line, relative to the cursor.
     * For example, at [100, 100], jump(50, 50) would draw a line to (and leave the cursor at) [150, 150].
     * @see [goto()] to jump absolutely
     * @see [push()] and [pop()] to jump somewhere and back
    */
    jump(x = 0, y = 0) {
        this.x += x
        this.y += y
        return this
    }
    /**
     * Draws a line to the given coordinates, relative to the cursor.
     * For example, at [100, 100], jump(50, 50) would leave the cursor at [150, 150].
    */
    line(x = 0, y = 0) {
        const line = Object.assign(new Line(0, 0, 0, 0), this._bag)
        line.setPosition(this.x, this.y)
        this.x += x
        this.y += y
        line.setEndpoint(this.x, this.y)
        this.lines.push(line)
        return this
    }
    /**
     * Goes to the given coordinates absolutely.
     * Unlike jumping, goto(50, 50) will leave the cursor at [50, 50] no matter what.
     * @see [jump()] to jump relatively
     * @see [push()] and [pop()] to jump somewhere and back
    */
    goto(x = this.x, y = this.y) {
        this.x = x
        this.y = y
        return this
    }
    /**
     * A wrapper for [line()] to draw horizontal-only lines.
    */
    lineh(x = 0) {
        this.line(x, 0)
        return this
    }
    /**
     * A wrapper for [line()] to draw vertical-only lines.
    */
    linev(y = 0) {
        this.line(0, y)
        return this
    }
    /**
     * A wrapper for [jump()] to jump only horizontally.
    */
    jumph(x = 0) {
        this.jump(x, 0)
        return this
    }
    /**
     * A wrapper for [jump()] to jump only vertically.
    */
    jumpv(y = 0) {
        this.jump(0, y)
        return this
    }

    /**
     * Draws four lines in a rectangle. Leaves the cursor at the opposite color.
    */
    rect(w = 0, h = 0) {
        this.lineh(w)
        this.linev(h)
        this.push()
        this.lineh(-w)
        this.linev(-h)
        this.pop()
        return this
    }

    /**
     * Acts mostly identical to jump, but stores the old position in the jump stack, allowing to return to it later with [pop()].
     * @see [pop()] to go to the previous position
    */
    push(x = 0, y = 0) {
        this.history.push([this.x, this.y])
        this.jump(x, y)
        return this
    }

    /**
     * Returns to the position before [push()] was called.
     * <b>Throws</b> if you try to pop too much.
    */
    pop() {
        if (!this.history.length) throw new Error("pop() without matching push()")
        ;[this.x, this.y] = this.history.pop()
        return this
    }

    /** 
     * Merges some properties into the property bag. Among the supported properties are `color` and `lineWidth`.
    */
    bag(...props) {
      Object.assign(this.bag, ...props)
      return this
    }

    *[Symbol.iterator]() {
        yield* this.lines
    }
}
