//npx mocha ./validator_moch.js' --no-timeouts
//does not work yet, locators not working
const { Builder, By, Key, until } = require("selenium-webdriver");
require("chromedriver");
const { assert } = require("chai");
const fs = require("fs");

class Validator {
  constructor(url) {
    this.driver = null;
    this.url = url;
  }

  async open() {
    this.driver = await new Builder().forBrowser("chrome").build();
    await this.driver.get(this.url);
  }

  async setInput(input) {
    let n = this.driver.findElement({ css: "form input[type=text]" });
    await n.clear();
    await n.sendKeys(input);
  }

  async click() {
    await this.driver.findElement({ css: "form input[type:button]" }).click();
  }

  async sleep(n) {
    await this.driver.sleep(n);
  }

  async setAllInput(input) {
    await this.setInput(input);
    await this.click();
    await this.sleep(100);
  }

  async getTitle() {
    return await this.driver.getTitle();
  }

  async close() {
    await this.driver.quit();
  }

  async validationShow() {
    let list = await this.driver
      .findElement({ name: "validation_message" })
      .getAttribute("class");
    return list;
  }

  async getValMsg() {
    let msg = await this.driver.findElement({ css: "" }).getText();
    return msg;
  }

  async takeScreenshot() {
    let image = await this.driver.takeScreenshot();
    fs.writeFileSync("screenshot.png", image, "base64");
  }
}

const data = [
  { input: 9999999, expectedOutput: "Valid Value" },
  { input: "#$%^#", expectedOutput: "Invalid Value" },
  { input: "hendd**", expectedOutput: "Valid Value" },
  { input: "AHYEDIO", expectedOutput: "Valid Value" },
  { input: "jdtegdj", expectedOutput: "Valid Value" },
  { input: 3705490, expectedOutput: "Valid Value" },
  { input: "ASHFbnj", expectedOutput: "Valid Value" },
  { input: "hye76BG", expectedOutput: "Valid Value" },
  { input: "23BgbG*", expectedOutput: "Valid Value" },
  { input: "gyr$%8N", expectedOutput: "Invalid Value" },
  { input: "bhtr50", expectedOutput: "Invalid Value" },
  { input: "huy bh", expectedOutput: "Invalid Value" },
];

async function test() {
  const classTest = new Validator(
    "https://testpages.eviltester.com/styled/apps/7charval/simple7charvalidation.html"
  );

  try {
    await classTest.open();
    console.log("opened page from class");

    await classTest.setAllInput(9999999);
    //await
  } catch (e) {
    console.log(e);
  } finally {
    //classTest.close();
  }
}

test();
