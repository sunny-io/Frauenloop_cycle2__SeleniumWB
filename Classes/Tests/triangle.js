// load all required modules
//const assert = require("node:assert");
const {
  WebDriver,
  until,
  Builder,
  Key,
  By,
  Browser,
} = require("selenium-webdriver");

require("chromedriver");

// import chai
const chai = require("chai");
const assert = chai.assert;

// test data
const baseURL =
  "https://testpages.eviltester.com/styled/apps/triangle/triangle001.html"; // page to test

// import test data sets
const {
  testDataNan,
  testDataVeryLarge,
  testSetEqui,
  testSetIso,
  testSetNaT,
  testSetScalene,
} = require("./testdata_triangle");

const guiLocators = {
  input1: "side1",
  input2: "side2",
  input3: "side3",
  button: "identify-triangle-action",
  answer: "triangle-type",
};

async function inputOutput(driver, testcase) {
  await driver
    .findElement({ id: guiLocators.input1 })
    .sendKeys(testcase.input[0]);
  await driver.sleep(1000);
  await driver
    .findElement({ id: guiLocators.input2 })
    .sendKeys(testcase.input[1]);

  await driver.sleep(1000);
  await driver
    .findElement({ id: guiLocators.input3 })
    .sendKeys(testcase.input[2]);
  await driver.sleep(1000);

  await driver.findElement({ id: "identify-triangle-action" }).click();
  await driver.sleep(1000);
  let answer = await driver.findElement({ id: "triangle-type" }).getText();

  assert.equal(answer, testcase.output, "Expected did not match actual answer");
}

async function test() {
  try {
    var driver = await new Builder().forBrowser(Browser.CHROME).build();

    await driver.get(baseURL);
    await driver.sleep(1000);
    assert.equal(
      await driver.getTitle(),
      "Triangle",
      "page Title does not match"
    ); // check page

    // make sure fields and button are there
    const input1 = await driver.findElement({ id: "side1" });
    assert.isDefined(input1, "input field side1 not found");

    const input2 = await driver.findElement({ id: "side2" });
    assert.isDefined(input2, "input field side2 not found");

    const input3 = await driver.findElement({ id: "side3" });
    assert.isDefined(input3, "input field side3 not found");

    const checkBtn = await driver.findElement({
      id: "identify-triangle-action",
    });
    assert.isDefined(checkBtn, "Button 'Identify Triangle Type' not found");

    // toDo: build loop for all testcases
    await inputOutput(driver, testSetIso[0]); //POC the setup works
  } catch (e) {
    console.log(e);
  } finally {
    await driver.quit();
  }
}

test();
