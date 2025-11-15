//npx mocha ./triangle_mocha.js --no-timeouts
const { Builder, By, Key, until } = require("selenium-webdriver");
require("chromedriver");
const { assert } = require("chai");
const fs = require("fs");
const locators = {
  side1Input: By.id("side1"),
  side2Input: By.id("side2"),
  side3Input: By.id("side3"),
  button: By.id("identify-triangle-action"),
  answer: By.id("triangle-type"),
};

class Triangle {
  constructor(url) {
    this.driver = null;
    this.url = url;
  }

  async open() {
    this.driver = await new Builder().forBrowser("chrome").build();
    await this.driver.get(this.url);
  }

  async setInput(locator, input) {
    let n = await this.driver.findElement(locator);
    await n.clear();
    await n.sendKeys(input);
  }

  async click(locator) {
    await this.driver.findElement(locator).click();
  }

  async sleep(n) {
    await this.driver.sleep(n);
  }

  async getTitle() {
    let t = await this.driver.getTitle();
    return await t;
  }

  async findAllElements() {}

  async setTriangle(input) {
    for (let i = 0; i < 3; i++) {
      await this.setInput(input[i][0], input[i][1]);
      await this.sleep(500);
    }
    await this.click(input[3]);
  }

  async getAnswer() {
    let a = await this.driver.findElement(locators.answer).getText();
    return a;
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
  const triangle = new Triangle(
    "https://testpages.eviltester.com/apps/triangle/"
  );

  before(async function () {
    await triangle.open();
  });

  beforeEach(async function () {
    //await triangle.open();
  });

  after(async function () {
    //await triangle.close()
  });

  afterEach(async function () {
    //await triangle.close();
  });

  it("Check title", async function () {
    await triangle.findAllElements();

    let title = await triangle.getTitle();
    assert.equal(title, "Triangle | Test Pages");
  });

  //prepare for the forEach
  /* cases.forEach(({ sides, expected }) => {
    it(`Testing sides ${sides[0]},${sides[1]},${sides[2]} & expecting: ${expected[0]}`, async function () {});
  });
 */
  it("Equi triangle", async function () {
    await triangle.setTriangle([
      [locators.side1Input, 4],
      [locators.side2Input, 4],
      [locators.side3Input, 4],
      locators.button,
    ]);
    await triangle.sleep(1000);
    await triangle.takeScreenshot();
    const savedImg = fs.readFileSync("screenshot.png", "base64");
    const expectedImg = fs.readFileSync("saved/screenshot.png", "base64");
    assert.equal(expectedImg, savedImg);
    let answer = await triangle.getAnswer;
    assert(answer, "Equilateral");
  });

  it.skip("Negative username test", async function () {
    await triangle.setAllInput("incorrectUser", "Password123");
    let errorShow = await triangle.errorShow();
    assert.equal(errorShow, "show");
    let errorMsg = await triangle.getErrMsg();
    assert.equal(errorMsg, "Your username is invalid!");
  });
  it.skip("Negative password test", async function () {
    await triangle.setAllInput("student", "incorrectPassword");
    let errorShow = await triangle.errorShow();
    assert.equal(errorShow, "show");
    let errorMsg = await triangle.getErrMsg();
    assert.equal(errorMsg, "Your password is invalid!");
  });
});
