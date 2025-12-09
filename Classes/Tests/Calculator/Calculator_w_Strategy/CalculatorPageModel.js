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
const forEach = require("mocha-each");

class Calculator {
  constructor(url) {
    this.driver = null;
    this.url =
      "https://testpages.eviltester.com/apps/calculator-api/form-calculator/";
    this.locators = {
      field1: By.id("number1"), // first input field
      field2: By.id("number2"), // second input
      selList: By.id("function"), // selection list for functions
      calBtn: By.id("calculate"), // Submit button
      answer: By.id("answer"), // span in result div
    };
    this.selListOptions = ["plus", "times", "minus", "divide"];
  }

  async open() {
    this.driver = await new Builder().forBrowser("chrome").build();
    await this.driver.get(this.url);
  }

  async resize(width, heigth) {
    await this.driver
      .manage()
      .window()
      .setRect({ width: width, height: heigth });
    await this.sleep(300);
  }

  async isPresent(locator) {
    try {
      await this.driver.findElement(locator);
      return true;
    } catch (e) {
      return false; // element not found
    }
  }

  async checkElements() {
    let elCheck = [];
    elCheck.push(await calculator.isPresent(this.locators.field1));
    elCheck.push(await calculator.isPresent(locators.field2));
    elCheck.push(await calculator.isPresent(locators.selList));
    elCheck.push(await calculator.isPresent(locators.calBtn));
    elCheck.push(await calculator.isPresent(locators.answer));
    return elCheck;
  }

  async setInput(locator, input) {
    let n = await this.driver.findElement(locator);
    await n.clear();
    await n.sendKeys(input);
  }

  async selectInList(locator, input) {
    try {
      let selList = await this.driver.findElement(locator);

      let select = await new Select(selList);
      await select.selectByVisibleText(input);
      const selectedRaw = await select.getFirstSelectedOption();
      const selected = await selectedRaw.getText();

      assert.equal(
        selected,
        input,
        `selected function is not expected operator`
      );
    } catch (e) {
      console.log(`error ${e} in selectInList`);
    }
  }

  async click(locator) {
    try {
      await this.driver.findElement(locator).click();
    } catch (e) {
      console.log(`error ${e} in click`);
    }
  }

  async sleep(n) {
    await this.driver.sleep(n);
  }

  async setAllInput(testcase) {
    try {
      await this.setInput(this.locators.field1, testcase.field1);
      await this.setInput(this.locators.field2, testcase.field2);
      await this.selectInList(this.locators.selList, testcase.operator);
      await this.click(this.locators.calBtn);
      await this.sleep(100);
    } catch (e) {
      console.log(`error ${e} in setAllInputs`);
    }
  }

  async getAnswer() {
    try {
      let answer = this.driver.findElement(this.locators.answer);
      await this.driver.wait(until.elementIsVisible(answer));
      return await answer.getText();
    } catch (e) {
      console.log(`error ${e} in getAnswer`);
    }
  }

  async getTitle() {
    return await this.driver.getTitle();
  }

  async close() {
    await this.driver.quit();
  }
}

module.exports = Calculator;
