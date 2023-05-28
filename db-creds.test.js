const puppeteer = require("puppeteer")

const SELECTORS = {
  USERNAME: "input#identification",
  PASSWORD: "input#pwd",
  CONTINUE: "button#authn-go-button",
}

xdescribe("'db.json'.creds", () => {
  let creds = require("./db.json").creds
  let puppet
  let page
  beforeAll(async () => {
    puppet = await puppeteer.launch()
  })
  beforeEach(async () => {
    page = await puppet.newPage()
    await page.goto("https://my.ccpsnet.net")
  })
  for (let id in creds) {
    if (id === "username") continue
    let cred = creds[id]
    for (let i = 0; i < cred.length; i++) {
      test(`${id}[${i}]`, async () => {
        await page.waitForSelector(SELECTORS.USERNAME)
        await page.type(SELECTORS.USERNAME, id)
        await page.waitForSelector(SELECTORS.PASSWORD)
        await page.type(SELECTORS.PASSWORD, cred[i])
        await page.waitForSelector(SELECTORS.CONTINUE)
        const wf = Promise.race([
          page
            .waitForSelector(".cs-error", { timeout: 5000 })
            .then(() => false),
          page
            .waitForNavigation({ waitUntil: "domcontentloaded", timeout: 5000 })
            .then(() => true),
        ])
        await page.click(SELECTORS.CONTINUE)
        expect(await wf).toBe(true)
      })
    }
  }
  afterEach(async () => {
    await page.close()
    page = null
  })
  afterAll(async () => {
    await puppet.close()
    puppet = null
  })
})
