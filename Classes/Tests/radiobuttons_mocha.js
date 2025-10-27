//npx mocha ./radiobuttons_mocha.js' --no-timeouts
//does not work yet, locators not working
const { Builder, By, Key, until } = require("selenium-webdriver");
require("chromedriver");
const { assert } = require("chai");
const fs = require("fs");
const forEach = require("mocha-each");

class simpleRB {
  constructor(url) {
    this.driver = null;
    this.url = url;
  }

  async open() {
    this.driver = await new Builder().forBrowser("chrome").build();
    await this.driver.get(this.url);
  }

  async isSelected(id) {
    return await this.driver.findElement({ id: id }).isSelected();
  }

  async getContainerTitle(id) {
    let title = await this.driver.findElement({ id: id }).getText();
    return title;
  }

  async setRadioOption(id) {
    await this.driver.findElement({ id: id }).click();
  }

  async readResult(id) {
    let result = await this.driver.findElement({ id: id }).getText();
    return result;
  }

  async takeScreenshot() {
    let image = await this.driver.takeScreenshot();
    fs.writeFileSync("screenshot.png", image, "base64");
  }

  async close() {
    await this.driver.quit();
  }
}

describe("Testsuit", function () {
  //remove --no-timeouts
  this.timeout(0);
  const rbContainer = new simpleRB(
    "https://yekoshy.github.io/RadioBtn-n-Checkbox/"
  );
  before(async function () {
    //await rbContainer.open()
  });

  beforeEach(async function () {
    await rbContainer.open();
  });

  after(async function () {
    //await rbContainer.close()
  });

  afterEach(async function () {
    await rbContainer.close();
  });

  it("Check if Container Title is present", async function () {
    let containerTitle = await rbContainer.getContainerTitle("firstTitle");
    assert.equal(containerTitle, "Radio Button Demo");
  });

  forEach([
    ["male-single", "Male"],
    ["female-single", "Female"],
  ]).it(
    "Check option %s and assert result %s",
    async function (checkID, expected) {
      await rbContainer.setRadioOption(checkID);
      let isSelected = await rbContainer.isSelected(checkID);
      let result = await rbContainer.readResult("single-radio-output");
      assert.include(result, expected);
      assert.isTrue(isSelected);
    }
  );

  it.skip("Check option: Male and assert result text", async function () {
    await rbContainer.setRadioOption("male-single");
    let isSelected = await rbContainer.isSelected("male-single");
    let result = await rbContainer.readResult("single-radio-output");
    assert.equal(result, "Radio button 'Male' is checked");
    assert.isTrue(isSelected);
  });
  it.skip("Check option: Female and assert result text", async function () {
    await rbContainer.setRadioOption("female-single");
    let isSelected = await rbContainer.isSelected("female-single");
    let result = await rbContainer.readResult("single-radio-output");
    assert.equal(result, "Radio button 'Female' is checked");
    assert.isTrue(isSelected);
  });
});
