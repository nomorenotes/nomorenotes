const db = require('./db.js')
const { readFile, writeFile } = require('fs/promises')

xdescribe("db", () => {
  beforeEach(() => {
    jest.resetModules()
    return (
      Promise.all(
        ['', '.1', '.2']
        .map(suff => `db.test${suff}.json`)
        .map(name => writeFile(name, '{}'))
      )
      .then(() => db.filename = 'db.test.json')
    )
  })
  
  describe('.filename', () => {
    it("should discard changes when assigned to", () => {
      db.data.failed = true
      db.filename = db.filename
      expect(db.data.failed).toBeUndefined()
    })
    it("should switch the database", () => {
      db.filename = 'db.test.1.json'
      db.data.ident = 1
      db.save()
      db.filename = 'db.test.2.json'
      db.data.ident = 2
      db.save()
      db.filename = 'db.test.1.json'
      expect(db.data.ident).toBe(1)
      db.filename = 'db.test.2.json'
      expect(db.data.ident).toBe(2)
    })
  })
  describe('.save()', () => {
    it("saves changes", async () => {
      db.data.working = true
      db.save()
      const data = readFile('db.test.json')
      expect(data).toBe(`
{
  "working": true
}`.trim())
    })
  })
  describe(".touch()", () => {
    it("should add an object to .data", () => {
      expect(db.data.example).toBeUndefined()
      let obj = db.touch("example")
      expect(obj).toEqual(expect.any(Object))
      expect(db.data.example).toBe(obj)
      expect(db.touch("example")).toBe(obj)
    })
  })
})