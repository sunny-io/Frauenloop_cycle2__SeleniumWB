//npx mocha ./Interations_mocha.js
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
/* 

    To pick up a draggable item, press the space bar.
    While dragging, use the arrow keys to move the item.
    Press space again to drop the item in its new position, or press escape to cancel. */

class Interaction {
  constructor(url) {
    this.driver = null;
    this.url = url;
  }

  async open() {
    this.driver = await new Builder().forBrowser("chrome").build();
    await this.driver.get(this.url);
  }

  async getAllButtons() {
    let buttons = [];
    let raw = await this.driver.findElements({ css: "button" });
    for (let element in raw) {
      let bID = await element.getAttribute("id");
      buttons.push(bID);
    }
    console.log(buttons);
    return buttons;
  }

  async click(id) {
    await this.driver.findElement(By.id(id)).click();
  }

  async focus(id) {
    const el = await this.driver.findElement({ id: id });
    //hack but works
    await this.driver.executeScript("arguments[0].focus();", el);

    //according to documentation and chatgtp, the following should work but does not
    //const actions = this.driver.actions({ async: true });
    //await actions.move({ origin: el }).perform();
  }

  async keyDown() {
    await this.driver.actions().keyDown(Key.SPACE).perform();
  }
  async keyUp() {
    await this.driver.actions().keyDown(Key.SPACE).perform();
    await this.driver.actions().keyUp(Key.SPACE).perform();
  }

  async keyPress() {
    await this.driver.actions().sendKeys(Key.SPACE).perform();
  }

  async contextMenu(id) {
    const el = await this.driver.findElement({ id: id });
    const actions = this.driver.actions({ async: true });
    await actions.contextClick(el).perform();
  }

  async getResult(id) {
    let result = await this.driver.findElement({ id: id }).getText();
    return result;
  }

  async getClass(id) {
    let bClass = await this.driver
      .findElement({ id: id })
      .getAttribute("class");
    console.log(bClass);
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

  async takeScreenshot() {
    let image = await this.driver.takeScreenshot();
    fs.writeFileSync("screenshot.png", image, "base64");
  }
}

describe("Testsuit", function () {
  //remove --no-timeouts
  this.timeout(0);
  const intObj = new Interaction("");

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
    // await intObj.close();
  });

  it.skip("Open Page and Assert title", async function () {
    let title = await intObj.getTitle();
    assert.equal(title, "");
  });
  it("Handle onKeyDown", async function () {
    await intObj.click("onkeydown");
    await intObj.keyDown();
    assert.equal(
      await intObj.getClass("onkeydown"),
      "styled-click-button-triggered"
    );
    assert.equal(await intObj.getResult("onkeydownstatus"), "Event Triggered");
  });

  it("Handle onKeyUp", async function () {
    await intObj.click("onkeyup");
    await intObj.keyUp();
    assert.equal(
      await intObj.getClass("onkeyup"),
      "styled-click-button-triggered"
    );
    assert.equal(await intObj.getResult("onkeyupstatus"), "Event Triggered");
  });
  it("Handle onKeyPress", async function () {
    await intObj.click("onkeypress");
    await intObj.keyPress();
    assert.equal(
      await intObj.getClass("onkeypress"),
      "styled-click-button-triggered"
    );
    assert.equal(await intObj.getResult("onkeypressstatus"), "Event Triggered");
  });
  it.only("Handle ConetxtClick", async function () {
    await intObj.click("oncontextmenu");
    await intObj.contextMenu("oncontextmenu");
    assert.equal(
      await intObj.getClass("oncontextmenu"),
      "styled-click-button-triggered"
    );
    assert.equal(
      await intObj.getResult("oncontextmenustatus"),
      "Event Triggered"
    );
  });
});
