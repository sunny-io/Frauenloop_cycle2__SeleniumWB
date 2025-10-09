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

//put all testSets in one variable to loop through them all
const testSets = [
  { name: "MT-A001", data: testSetEqui },
  { name: "MT-A002", data: testSetScalene },
  { name: "MT-A003", data: testSetIso },
  { name: "MT-A004", data: testSetNaT },
  { name: "MT-A005", data: testDataNan },
  { name: "T008", data: testDataVeryLarge },
];

async function inputOutput(driver, testcase) {
  //clear fields before new input
  await driver.findElement({ id: guiLocators.input1 }).clear();
  await driver.findElement({ id: guiLocators.input2 }).clear();
  await driver.findElement({ id: guiLocators.input3 }).clear();
  await driver.sleep(500);

  //fill fields
  await driver
    .findElement({ id: guiLocators.input1 })
    .sendKeys(testcase.input[0]);
  await driver.sleep(500);
  await driver
    .findElement({ id: guiLocators.input2 })
    .sendKeys(testcase.input[1]);

  await driver.sleep(500);
  await driver
    .findElement({ id: guiLocators.input3 })
    .sendKeys(testcase.input[2]);
  await driver.sleep(500);

  //click button to eveluate input
  await driver.findElement({ id: "identify-triangle-action" }).click();
  await driver.sleep(500);

  //assert output
  let answer = await driver.findElement({ id: "triangle-type" }).getText();

  assert.equal(answer, testcase.output, "Expected did not match actual answer");
  await driver.executeScript(
    "document.getElementById('triangle-type').textContent = '';"
  );
  await driver.sleep(500);
}

async function test(testset) {
  try {
    var driver = await new Builder().forBrowser(Browser.CHROME).build();

    await driver.get(baseURL);
    await driver.sleep(500);
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
    console.log("All input elements present");

    // loop for all testcases in set

    for (let i = 0; i < testset.data.length; i++) {
      //call inputOutput for testset.data[i]
      //console.table(testset.data[i]);
      await inputOutput(driver, testset.data[i]);

      //log sucessfull test
      console.log(`${testset.name} test ${i + 1}: success`);
    }
  } catch (e) {
    console.log(e);
  } finally {
    await driver.quit();
  }
}

async function runAll(testSets) {
  //each testSet runs in its own browser instance
  try {
    for (let i = 0; i < testSets.length; i++) {
      await test(testSets[i]);
    }
  } catch (e) {
    console.log(`error ${e} in testSets loop`);
  }
}

runAll(testSets);
