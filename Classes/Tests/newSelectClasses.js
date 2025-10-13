// load all required modules
//const assert = require("node:assert");
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

const baseURL = "https://yekoshy.github.io/Dropdown/select_demo.html";
const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunay", // spelling error to make sure there test fails if option is not found
];

async function testWeekdaySelect(driver, daysOfWeek) {
  try {
    for (let i = 0; i < daysOfWeek.length; i++) {
      const selectElement = await driver.findElement(By.id("day-select"));
      const select = new Select(selectElement);
      await select.selectByVisibleText(daysOfWeek[i]);
      let selectDisplay = await driver
        .findElement({
          css: "div#selected-day-display strong",
        })
        .getText();

      assert.equal(
        selectDisplay,
        daysOfWeek[i],
        "Mismatch of selected day and display"
      );
    }
  } catch (e) {
    console.log(`error ${e} in TestWeekdaySelect`);
  }
}

async function test() {
  try {
    var driver = await new Builder().forBrowser(Browser.CHROME).build();

    await driver.get(baseURL);
    await driver.sleep(500);
    assert.equal(
      await driver.getTitle(),
      "Advanced Select List Demos",
      "page Title does not match"
    ); // check page
    await testWeekdaySelect(driver, daysOfWeek);
  } catch (e) {
    console.log(e);
  } finally {
    //await driver.quit();
  }
}
test();
