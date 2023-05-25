const Hash = require("./crypt.js")

const jst = JSON.stringify.bind(JSON)
const salt = "$2a$10$yISxC8sqavt2TMvHPs8f7e" // Test salt, for reproduction purposes. DO NOT USE.

describe("crypt.js/Hash", () => {
    const texts = [
        "Hello World",
        "HelloWorld123",
        "llama",
        "",
        "\0\0\0\0\0\0\0\0"
    ]
    
    for (let text of texts) {
        describe(`from string ${jst(text)}`, () => {
            /** @type {Hash} */
            let hash
            beforeAll(async () => {
                hash = await Hash.hash(text, { salt }).then(h => (hash = h))
            })
            it(`should have been calculated before running tests`, async () => {
                expect(hash).toBeInstanceOf(Hash)
            })
            it(`should not have a different hash`, async () => {
                expect(hash.hash).toMatchSnapshot("hash " + jst(text))
            })
            it(`should compare to itself`, async () => {
                await expect(hash.compare(text)).resolves.toBeTruthy()
            })
            it(`should have the test salt and rounds`, async () => {
                expect(hash.salt).toBe(salt)
                expect(hash.rounds).toBe(10)
            })
            describe(`should not compare to different data`, () => {
                for (let text2 of texts) {
                    if (text === text2) continue
                    if ((text === "" && text2 === "\0\0\0\0\0\0\0\0") || (text2 === "" && text === "\0\0\0\0\0\0\0\0")) continue // null characters are ignored
                    test(jst(text2), async () => {
                        await expect(hash.compare(text2)).resolves.toBeFalsy()
                    })
                }
            })
        })
    }
})
