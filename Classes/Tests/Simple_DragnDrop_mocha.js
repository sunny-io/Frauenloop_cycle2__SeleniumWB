// load all required modules
//npx mocha ./Simple_DragnDrop_mocha.js --no-timeouts

const {
  WebDriver,
  until,
  Builder,
  Key,
  By,
  Browser,
  Select,
} = require("selenium-webdriver");

require("chromedriver");

const { assert } = require("chai");
const fs = require("fs");
const forEach = require("mocha-each");

// test data
const baseURL =
  "https://yekoshy.github.io/Drag-n-Drop/SeleniumEasyDragnDrop.html"; // replace by page to test
const expectedTitle = "Drag and Drop Demo for Automation"; //fill in expected page title to assert you opened the right one

const locators = {
  sourceDiv: By.id("items-to-drag"), // div with dragable divs
  targetDiv: By.id("drop-zone"), // drop target div
  listDiv: By.id("dropped-items-list"), // div with one div for each
  dragables: [
    "draggable-1", // dragable item 1
    "draggable-2", // dragable item 2
    "draggable-3", // dragable item 3
    "draggable-4", // dragable item 4
  ],
};

class Dnd {
  constructor(url) {
    this.driver = null;
    this.url = url;
  }

  async open() {
    this.driver = await new Builder().forBrowser("chrome").build();
    await this.driver.get(this.url);
  }

  async getElement(locator) {
    let el = await this.driver.findElement(locator);
    return el;
  }

  async elPresent(locator) {
    //gets info on current element (id, class, text)
    let elInfo = {};
    let el = await this.driver.findElement(locator);
    elInfo.id = await el.getAttribute("id");
    elInfo.class = await el.getAttribute("class");
    elInfo.text = await el.getText();
    return elInfo;
  }
  async getChildren(locator1, locator2) {
    // gets array of ids of direct child elements
    let elList = [];
    let parent = await this.driver.findElement(locator1);
    let elements = await parent.findElements(locator2);
    for (let e of elements) {
      elList.push(e.getAttribute("id"));
    }
    return elList;
  }

  async getParent(id) {
    try {
      let locator = "//div[@id=" + "'" + id + "']//parent::*";
      console.log(locator);
      let parent = await this.driver.findElement(By.xpath(locator));

      let pID = await parent.getAttribute("id");
      console.log(pID);
      return pID;
    } catch (e) {
      console.log(`error ${e} in getParent`);
    }
  }

  async click(id) {
    await this.driver.findElement(By.id(id)).click();
  }

  async dragNDrop(source) {
    try {
      let draggable = await this.driver.findElement(By.id(source));
      let droppable = await this.driver.findElement(By.id("drop-zone"));
      let actions = this.driver.actions({ async: true });
      await actions.dragAndDrop(draggable, droppable).perform();
    } catch (e) {
      console.log(`error ${e} in dragNDrop`);
    }
  }

  async sleep(n) {
    await this.driver.sleep(n);
  }

  async getTitle() {
    return await this.driver.getTitle();
  }

  async close() {
    await this.driver.quit();
  }

  async takeScreenshot() {
    let image = await this.driver.takeScreenshot();
    fs.writeFileSync("screenshot.png", image, "base64");
  }
}

describe("Testsuit", function () {
  //remove --no-timeouts
  this.timeout(0);
  const dndObj = new Dnd(baseURL);

  before(async function () {
    await dndObj.open();
  });

  beforeEach(async function () {
    //await dndObj.open();
  });

  after(async function () {
    //await dndObj.close()
  });

  afterEach(async function () {
    //await dndObj.close();
  });

  it("Load Page, Assert title and elements", async function () {
    let title = await dndObj.getTitle();
    assert.equal(title, expectedTitle);
    assert.isDefined(await dndObj.getElement(locators.sourceDiv));
    assert.isDefined(await dndObj.getElement(locators.targetDiv));
    assert.isDefined(await dndObj.getElement(locators.listDiv));
  });

  it("Dnd first element", async function () {
    assert.equal(
      await dndObj.getParent(locators.dragables[0]),
      "items-to-drag"
    );
    await dndObj.dragNDrop(locators.dragables[0]);
    await dndObj.sleep(500);
    assert.equal(await dndObj.getParent(locators.dragables[0]), "drop-zone");
    assert.include(await dndObj.getChildren(locators.listDiv));

    /* locators.dragables.forEach(({dragable})=> {
    dndObj.dragNDrop(dragable, locators.targetDiv);

  }) */
  });
});
