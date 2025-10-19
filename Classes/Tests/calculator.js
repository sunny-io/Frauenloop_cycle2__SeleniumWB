// load all required modules
//const assert = require("node:assert"); //not importing node assert but chai
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

// import chai
const chai = require("chai");
const assert = chai.assert;

// test data
const baseURL = "https://testpages.eviltester.com/styled/calculator"; // replace by page to test
const expectedTitle = "Selenium Simplified Calculator"; //fill in expected page title to assert you opened the right one

//locators for important elements
// calculator form
const field1 = "number1"; // first input field
const field2 = "number2"; // secone input field
const selList = "function"; // selection list for functions
const calBtn = "calculate"; // Submit button
const answer = "answer"; // span in result div
const selListOptions = ["plus", "times", "minus", "divide"];

// import test data sets
const { testcases } = require("./testdata_calculator");

async function checkElementsDefined(driver, elements) {
  try {
    for (let i = 0; i < elements.length; i++) {
      assert.isDefined(
        await driver.findElement({ id: elements[i] }),
        `element with id ${elements[i]} not found`
      );
      console.log("all elements found");
    }
  } catch (e) {
    console.log(`error ${e} in checkElementsDefined`);
  }
}

async function fillField(driver, fieldId, keys) {
  try {
    await driver.findElement({ id: fieldId }).sendKeys(keys);

    let fieldContents = await driver
      .findElement({ id: fieldId })
      .getAttribute("value");

    assert.equal(
      fieldContents,
      keys,
      `field content in ${fieldId} does not match keys`
    );
  } catch (e) {
    console.log(`error ${e} in fillField`);
  }
}

async function doSelect(driver, operator) {
  try {
    const selectElement = await driver.findElement({ id: selList });

    const select = await new Select(selectElement);
    await select.selectByVisibleText(operator);
    const selectedRaw = await select.getFirstSelectedOption();
    const selected = await selectedRaw.getText();

    assert.equal(
      selected,
      operator,
      `selected function is not expected operator`
    );
  } catch (e) {
    console.log(`error ${e} in doSelect`);
  }
}

async function fillFieldsAndCheck(driver, testcase) {
  //fill fields and calculate
  try {
    await fillField(driver, field1, testcase.field1);
    await fillField(driver, field2, testcase.field2);
    await doSelect(driver, testcase.operator);
    await driver.findElement({ id: calBtn }).click();

    //assert result
    const result = await driver.findElement({ id: answer }).getText();

    assert.equal(result, testcase.expected);

    console.log(`${testcase.name}: ${testcase.description} passed`);
  } catch (e) {
    console.log(
      `error ${e} in fillFieldsAndCheck for testcase ${testcase.name}`
    );
  }
}

async function test(testcase) {
  try {
    var driver = await new Builder().forBrowser(Browser.CHROME).build();

    await driver.get(baseURL);
    await driver.sleep(500);
    // check page
    assert.equal(
      await driver.getTitle(),
      expectedTitle,
      "page Title does not match"
    );
    // assert specific elements required to execute test
    await checkElementsDefined(driver, [
      field1,
      field2,
      calBtn,
      selList,
      answer,
    ]);

    await fillFieldsAndCheck(driver, testcase);

    //scroll element by ID to ensure visibility
    /* const element = await driver.findElement({ id: "myID" });
    await driver.executeScript("arguments[0].scrollIntoView(true);", element); */
  } catch (e) {
    console.log(` error ${e} in function test`);
  } finally {
    await driver.quit();
  }
}
//loop through all testcases
async function runAllTests() {
  for (let i = 0; i < testcases.length; i++) {
    await test(testcases[i]);
  }
}

//test(testcases[19]);

runAllTests(testcases);
