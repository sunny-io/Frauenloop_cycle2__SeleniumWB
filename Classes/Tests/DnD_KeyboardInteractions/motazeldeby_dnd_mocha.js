//npx mocha ./DnD_KeyboardInteractions/motazeldeby_dnd_mocha.js
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
const { validateHeaderName } = require("http");

const items = {
  item1: {
    locatortype: "attribute",
    attribute: "data-test",
    value: "drag-handle-Item 1",
  },
  item2: {
    locatortype: "attribute",
    attribute: "data-test",
    value: "drag-handle-Item 2",
  },
  item3: {
    locatortype: "attribute",
    attribute: "data-test",
    value: "drag-handle-Item 3",
  },
  item4: {
    locatortype: "attribute",
    attribute: "data-test",
    value: "drag-handle-Item 4",
  },
  item5: {
    locatortype: "attribute",
    attribute: "data-test",
    value: "drag-handle-Item 5",
  },
};
const screenshot = "motaDnD";

const testcases = [
  {
    id: "t001",
    name: "move i1 1 down",
    handle: items.item1,
    movedown: 1,
    moveup: 0,
    expectedIndex: 1,
  },
  {
    id: "t002",
    name: "move i2 1 down",
    handle: items.item2,
    movedown: 1,
    moveup: 0,
    expectedIndex: 2,
  },
  {
    id: "t003",
    name: "move i3 1 down",
    handle: items.item3,
    movedown: 1,
    moveup: 0,
    expectedIndex: 3,
  },
  {
    id: "t004",
    name: "move i4 1 down",
    handle: items.item4,
    movedown: 1,
    moveup: 0,
    expectedIndex: 4,
  },
  {
    id: "t005",
    name: "move i5 1 up",
    handle: items.item5,
    movedown: 0,
    moveup: 1,
    expectedIndex: 3,
  },
];

class Interaction {
  constructor(url) {
    this.driver = null;
    this.url = url;
  }

  async open() {
    this.driver = await new Builder().forBrowser("chrome").build();
    await this.driver.get(this.url);
  }

  makeLocator(item) {
    let locator;
    if (item.locatortype == "id") {
      locator = item.value;
    } else if (item.locatortype == "attribute") {
      let attribute = item.attribute;
      //console.log(attribute);
      locator = "//button[@" + attribute + "=" + "'" + item.value + "']";
    }
    return locator;
  }

  async getButtonList() {
    let buttonlist = [];
    let buttons = await this.driver.findElements(By.css("main button"));
    for (let b of buttons) {
      let pseud = await b.getAttribute("data-test");
      buttonlist.push(pseud);
    }
    return buttonlist;
  }

  async click(type, locator) {
    //console.log(locator);
    if (type == "id") {
      await this.driver.findElement(By.id(locator)).click();
    } else if (type == "attribute") {
      await this.driver.findElement(By.xpath(locator)).click();
    }
  }

  async focus(locator) {
    const el = await this.driver.findElement(locator);
    //hack but works
    await this.driver.executeScript("arguments[0].focus();", el);
  }

  async keyDown(key) {
    await this.driver.actions().keyDown(key).perform();
  }
  async keyUp(key) {
    await this.driver.actions().keyDown(key).perform();
    await this.driver.actions().keyUp(key).perform();
  }

  async keyPress(key) {
    await this.driver.actions().sendKeys(key).perform();
  }

  async contextMenu(locator) {
    const el = await this.driver.findElement(locator);
    const actions = this.driver.actions({ async: true });
    await actions.contextClick(el).perform();
  }

  async getText(locator) {
    let result = await this.driver.findElement(locator).getText();
    return result;
  }

  async getClass(locator) {
    let bClass = await this.driver.findElement(locator).getAttribute("class");
    //console.log(bClass);
    return bClass;
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

  async takeScreenshot(fname) {
    let image = await this.driver.takeScreenshot();
    fs.writeFileSync(fname, image, "base64");
  }
}

describe("Testsuit", function () {
  //remove --no-timeouts
  this.timeout(0);
  const intObj = new Interaction(
    "https://moatazeldebsy.github.io/test-automation-practices/?#/drag-drop"
  );

  before(async function () {
    //await intObj.open()
  });

  beforeEach(async function () {
    await intObj.open();
  });

  after(async function () {
    //await intObj.close()
  });

  afterEach(async function () {
    await intObj.close();
  });

  it.skip("Open Page and Assert title", async function () {
    let title = await intObj.getTitle();
    assert.equal(title, "Test Automation Practices (Web and Mobile Web)");
  });
  it.skip("Move item 1 one down", async function () {
    let item = intObj.makeLocator(items.item1);
    await intObj.click(items.item1.locatortype, item);
    await intObj.keyDown(Key.SPACE);
    await intObj.sleep(500);
    await intObj.keyPress(Key.ARROW_DOWN);
    await intObj.sleep(500);
    await intObj.keyUp(Key.SPACE);
    await intObj.sleep(500);
    await intObj.click(items.item1.locatortype, item);

    let after = await intObj.getButtonList();
    console.log(after[1]);
    assert.equal(after[1], items.item1.value);
  });
  testcases.forEach(({ name, handle, movedown, moveup, expectedIndex }) => {
    it(`Testing DnD ${name},item: ${handle.value}, movedown: ${movedown}, moveup: ${moveup} & expecting: ${expectedIndex}`, async function () {
      let item = intObj.makeLocator(handle);
      await intObj.click(handle.locatortype, item);
      let before = await intObj.getButtonList();
      let posBefore = before.indexOf(handle.value);
      await intObj.keyDown(Key.SPACE);
      await intObj.sleep(500);
      for (let i = 0; i < movedown; i++) {
        await intObj.keyPress(Key.ARROW_DOWN);
        await intObj.sleep(500);
      }
      for (let i = 0; i < moveup; i++) {
        await intObj.keyPress(Key.ARROW_UP);
        await intObj.sleep(500);
      }
      await intObj.keyUp(Key.SPACE);
      await intObj.sleep(500);
      let after = await intObj.getButtonList();
      let posAfter = after.indexOf(handle.value);
      assert.equal(posAfter, expectedIndex);
    });
  });
});
