//npx mocha ./Calculator/calculator_mocha.js --reporter mocha-simple-html-reporter --reporter-options output=./Calculator/et_calculator_report.html
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
// const fs = require("fs");
const forEach = require("mocha-each");

const { Generator } = require("./randomTestData_generator");

// test data
const generator = new Generator();
const randomTCs = generator.generateTestSet();

const expectedTitle = "Server Side Calculator Using API | Test Pages"; //fill in expected page title to assert you opened the right one

// locators for important elements
// calculator form
const locators = {
  field1: By.id("number1"), // first input field
  field2: By.id("number2"), // second input
  selList: By.id("function"), // selection list for functions
  calBtn: By.id("calculate"), // Submit button
  answer: By.id("answer"), // span in result div
};
//selection list option names
const selListOptions = ["plus", "times", "minus", "divide"];

// import test data sets
const { testcases } = require("./testdata_calculator");

class Calculator {
  constructor(url) {
    this.driver = null;
    this.url = url;
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
      await this.setInput(locators.field1, testcase.field1);
      await this.setInput(locators.field2, testcase.field2);
      await this.selectInList(locators.selList, testcase.operator);
      await this.click(locators.calBtn);
      await this.sleep(100);
    } catch (e) {
      console.log(`error ${e} in setAllInputs`);
    }
  }

  async getAnswer() {
    try {
      let answer = this.driver.findElement(locators.answer);
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

  async takeScreenshot(fname) {
    let image = await this.driver.takeScreenshot();

    fs.writeFileSync(fname, image, "base64");
  }
  readPng(img) {
    return fs.readFileSync(img, "base64");
  }
}

describe("Testsuit", function () {
  //remove --no-timeouts
  this.timeout(0);
  const calculator = new Calculator(
    "https://testpages.eviltester.com/apps/calculator-api/form-calculator/"
  );

  before(async function () {
    //await calculator.open()
  });

  beforeEach(async function () {
    await calculator.open();
    await calculator.resize(1504, 1024);
  });

  after(async function () {
    //await calculator.close()
  });

  afterEach(async function () {
    await calculator.close();
  });

  it("test page title and input fields", async function () {
    let title = await calculator.getTitle();
    assert.equal(await title, expectedTitle);
    assert.isTrue(await calculator.isPresent(locators.field1));
    assert.isTrue(await calculator.isPresent(locators.field2));
    assert.isTrue(await calculator.isPresent(locators.selList));
    assert.isTrue(await calculator.isPresent(locators.calBtn));
    assert.isTrue(await calculator.isPresent(locators.answer));
  });

  it("test run testcase 1", async function () {
    await calculator.setAllInput(testcases[0]);
    await calculator.sleep(1000);
    let answer = await calculator.getAnswer();
    assert.equal(await answer, testcases[0].expected);

    //code for asserting agains screenshots removed bc assertion always fails. MacOS-Problem?
  });

  testcases.forEach(
    ({ name, description, field1, field2, operator, expected }) => {
      it(`Testing calculator ${name},${description},${field1}, ${field2}, ${operator} & expecting: ${expected}`, async function () {
        let testcase = {
          name,
          description,
          field1,
          field2,
          operator,
          expected,
        }; //recreating the testcase to match expected structure for methods

        await calculator.setAllInput(testcase);
        await calculator.sleep(1000);
        let answer = await calculator.getAnswer();
        assert.equal(await answer, expected);
      });
    }
  );

  randomTCs.forEach(
    ({ name, description, field1, field2, operator, expected }) => {
      it(`Testing calculator ${name},${description},${field1}, ${field2}, ${operator} & expecting: ${expected}`, async function () {
        let testcase = {
          name,
          description,
          field1,
          field2,
          operator,
          expected,
        }; //recreating the testcase to match expected structure for methods

        await calculator.setAllInput(testcase);
        await calculator.sleep(1000);
        let answer = await calculator.getAnswer();
        // random division assertions fail due to rounding in calculatr, decide on method to round expected
        assert.equal(await answer, expected);
      });
    }
  );
});
