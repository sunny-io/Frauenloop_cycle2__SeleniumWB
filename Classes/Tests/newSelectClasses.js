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

const multiOne = ["California", "Pennsylvania", "Ohio"]; //first option appears first in list
const multiTwo = ["Ohio", "New Jersey", "Florida", "Texas"]; //first option does not appear in list

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
      console.log(`Test for text ${daysOfWeek[i]} passed `);
    }
  } catch (e) {
    console.log(`error ${e} in TestWeekdaySelect`);
  }
}

async function testMultiselect(driver, multiSelection) {
  const selectElement = await driver.findElement(By.id("state-select"));
  const select = new Select(selectElement);
  try {
    for (let i = 0; i < multiSelection.length; i++) {
      await select.selectByVisibleText(multiSelection[i]);

      driver.sleep(500);
    }
    // get them before clicking
    let selected = await select.getAllSelectedOptions();
    //get all Selected options
    let allSelectedRaw = await select.getAllSelectedOptions();
    let allSelectedText = [];
    for (let option of allSelectedRaw) {
      allSelectedText.push(await option.getText());
    }
    let firstSelectedText = allSelectedText[0];
    allSelectedText = allSelectedText.join(", ");

    //assert first selected
    await driver.findElement({ id: "first-selected-btn" }).click();

    let firstSelectDisplay = await driver
      .findElement({
        css: "div#multi-select-display",
      })
      .getText();

    let firstSelectDisplaySelect = await driver
      .findElement({
        css: "div#multi-select-display strong",
      })
      .getText();

    // assert correct text before output
    assert.include(firstSelectDisplay, "First selected option is");

    // assert first item selected (DOM sequence) in the selection box matches item in sorted input
    let firstSequencial = multiSelection.slice().sort()[0];
    assert.equal(
      firstSelectedText,
      firstSequencial,
      "Selected first item does not match first element of sorted list"
    );

    //assert the first selected in the selection box matches the display below the box
    assert.equal(
      firstSelectDisplaySelect,
      firstSelectedText,
      "Display text of first selected does not match first element"
    );

    console.log(`Test for first selected passed `);

    //assert all selected
    await driver.findElement({ id: "first-selected-btn" }).click();

    let allSelectDisplay = await driver
      .findElement({
        css: "div#multi-select-display",
      })
      .getText();

    let allSelectDisplaySelect = await driver
      .findElement({
        css: "div#multi-select-display strong",
      })
      .getText();

    // Slice, sort and join multiselect array to compare against output
    let expectedAll = multiSelection.slice().sort().join(", ");

    //assert expected and actual match
    assert.equal(
      allSelectedText,
      expectedAll,
      "Display of all selected does not match first element"
    );
    console.log(`Test for all selected passed `);
  } catch (e) {
    console.log(`error ${e} in TestMultiselect`);
  } finally {
    await select.deselectAll();
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
    console.log("test MultiOne");
    await testMultiselect(driver, multiOne);

    console.log("test MultiTwo");
    await testMultiselect(driver, multiTwo);
  } catch (e) {
    console.log(e);
  } finally {
    //await driver.quit();
  }
}
test();
