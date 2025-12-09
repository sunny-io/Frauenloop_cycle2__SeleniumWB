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
const Calculator = require("./CalculatorPageModel");

const expectedTitle = "Server Side Calculator Using API | Test Pages"; //fill in expected page title to assert you opened the right one

// import test data
const testcases = require("./testdata_calculator.json");

describe("Testsuit for simple Calculator", function () {
  //remove --no-timeouts
  this.timeout(0);
  const calculator = new Calculator();
  let locators = calculator.locators;

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
  });

  testcases.forEach((testcase) => {
    it(`Testing calculator ${testcase.name},${testcase.description}: Field1: ${testcase.field1}, Field2: ${testcase.field2},Operator:  ${testcase.operator} & expecting: ${testcase.expected}`, async function () {
      await calculator.setAllInput(testcase);
      await calculator.sleep(1000);
      let answer = await calculator.getAnswer();

      assert.equal(await answer, testcase.expected);
    });
  });
});
