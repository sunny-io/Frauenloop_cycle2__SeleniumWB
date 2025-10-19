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
const baseURL = "https://some.url"; // replace by page to test
const expectedTitle = "some test page"; //fill in expected page title to assert you opened the right one

async function test() {
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

    //scroll element by ID to ensure visibility
    /* const element = await driver.findElement({ id: "myID" });
    await driver.executeScript("arguments[0].scrollIntoView(true);", element); */
  } catch (e) {
    console.log(` error ${e} in function test`);
  } finally {
    //await driver.quit();
  }
}

test();
