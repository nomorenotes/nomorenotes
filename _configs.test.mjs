require('./toBeMap.matcher.js')

function block(modname) {
    describe(modname, () => {
        const mod = require('./' + modname)
        it("should be an object", () => {
            expect(mod).toMatch(expect.any(Object))
        })
        it("should match the snapshot", () => {
            expect(mod).toMatchSnapshot("snapshot of " + modname)
        })
    })
}

block("prefixes.js")
block("emoji.js")