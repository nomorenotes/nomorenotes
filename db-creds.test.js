const puppeteer = require("puppeteer")

/**
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://developers.google.com/web/');

  // Type into search box.
  await page.type('.devsite-search-field', 'Headless Chrome');

  // Wait for suggest overlay to appear and click "show all results".
  const allResultsSelector = '.devsite-suggest-all-results';
  await page.waitForSelector(allResultsSelector);
  await page.click(allResultsSelector);

  // Wait for the results page to load and display the results.
  const resultsSelector = '.gsc-results .gs-title';
  await page.waitForSelector(resultsSelector);

  // Extract the results from the page.
  const links = await page.evaluate(resultsSelector => {
    return [...document.querySelectorAll(resultsSelector)].map(anchor => {
      const title = anchor.textContent.split('|')[0].trim();
      return `${title} - ${anchor.href}`;
    });
  }, resultsSelector);

  // Print all the files.
  console.log(links.join('\n'));

  await browser.close();
})();
*/

const SELECTORS = {
  USERNAME: "input#identification",
  PASSWORD: "input#pwd",
  CONTINUE: "button#authn-go-button"
}

describe("'db.json'.creds", () => {
  let creds = require('./db.json').creds
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
    if (id === 'username') continue;
    let cred = creds[id]
    for (let i = 0; i < cred.length; i++) {
      test(`${id}[${i}]`, async () => {
        await page.waitForSelector(SELECTORS.USERNAME)
        await page.type(SELECTORS.USERNAME, id)
        await page.waitForSelector(SELECTORS.PASSWORD)
        await page.type(SELECTORS.PASSWORD, cred[i])
        await page.waitForSelector(SELECTORS.CONTINUE)
        const wf = Promise.race([
          page.waitForSelector('.cs-error', { timeout: 5000 }).then(() => false),
          page.waitForNavigation({waitUntil: 'domcontentloaded', timeout: 5000 }).then(() => true)
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