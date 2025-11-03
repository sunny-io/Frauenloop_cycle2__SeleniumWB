//npx mocha '.\.js' --no-timeouts
const { Builder, By, Key, until } = require("selenium-webdriver");
require("chromedriver");
const { assert } = require("chai");
const fs = require("fs");
const forEach = require("mocha-each");

class Login {
  constructor(url) {
    this.driver = null;
    this.url = url;
  }

  async open() {
    this.driver = await new Builder().forBrowser("chrome").build();
    await this.driver.get(this.url);
  }

  async setInput(id, input) {
    let n = await this.driver.findElement(By.id(id));
    await n.clear();
    await n.sendKeys(input);
  }

  async click(id) {
    await this.driver.findElement(By.id(id)).click();
  }

  async sleep(n) {
    await this.driver.sleep(n);
  }

  async setAllInput(username, password) {
    await this.setInput("username", username);
    await this.setInput("password", password);
    await this.click("submit");
    await this.sleep(100);
  }

  async getNewTitle(title) {
    await this.driver.wait(until.titleContains(title), 1000);
  }

  async getTitle() {
    return await this.driver.getTitle();
  }

  async close() {
    await this.driver.quit();
  }

  async errorShow() {
    let list = await this.driver
      .findElement({ id: "error" })
      .getAttribute("class");
    return list;
  }

  async getErrMsg() {
    let msg = await this.driver.findElement({ id: "error" }).getText();
    return msg;
  }

  async takeScreenshot() {
    let image = await this.driver.takeScreenshot();
    fs.writeFileSync("screenshot.png", image, "base64");
  }
}

describe("Testsuit", function () {
  //remove --no-timeouts
  this.timeout(0);
  const loginObject = new Login(
    "https://practicetestautomation.com/practice-test-login/"
  );

  before(async function () {
    //await loginObject.open()
  });

  beforeEach(async function () {
    await loginObject.open();
  });

  after(async function () {
    //await loginObject.close()
  });

  afterEach(async function () {
    await loginObject.close();
  });

  it("Positive LogIn test + Assert title", async function () {
    await loginObject.setAllInput("student", "Password123");
    await loginObject.getNewTitle("Logged In Successfully");
    let title = await loginObject.getTitle();
    assert.equal(title, "Logged In Successfully | Practice Test Automation");
  });

  it("Positive LogIn test + Assert Screenshot", async function () {
    await loginObject.setAllInput("student", "Password123");
    await loginObject.sleep(1000);
    await loginObject.takeScreenshot();
    const savedImg = fs.readFileSync("screenshot.png", "base64");
    const expectedImg = fs.readFileSync("saved/screenshot.png", "base64");
    assert.equal(expectedImg, savedImg);
  });

  it("Negative username test", async function () {
    await loginObject.setAllInput("incorrectUser", "Password123");
    let errorShow = await loginObject.errorShow();
    assert.equal(errorShow, "show");
    let errorMsg = await loginObject.getErrMsg();
    assert.equal(errorMsg, "Your username is invalid!");
  });
  it("Negative password test", async function () {
    await loginObject.setAllInput("student", "incorrectPassword");
    let errorShow = await loginObject.errorShow();
    assert.equal(errorShow, "show");
    let errorMsg = await loginObject.getErrMsg();
    assert.equal(errorMsg, "Your password is invalid!");
  });
});
