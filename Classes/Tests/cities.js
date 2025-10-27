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
const baseURL = "https://yekoshy.github.io/Dropdown/"; // replace by page to test
const expectedTitle = "Dropdown Test Examples"; //fill in expected page title to assert you opened the right one

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
    const selectInput = await driver.findElement({ id: "city-select" });
    assert.isDefined(selectInput);

    //scroll element by ID to ensure visibility
    const element = await driver.findElement({ id: "selected-cities" });
    await driver.executeScript("arguments[0].scrollIntoView(true);", element);

    const select = await new Select(selectInput);
    let options;
    options = await select.getOptions();
    let items = [];
    for (i = 0; i < options.length; i++) {
      item = await options[i].getText();
      items.push(item);
    }
    console.log(items);

    await driver
      .findElement({ css: "textarea.select2-search__field" })
      .sendKeys("ph");

    let searchResultRaw = await driver.findElements({
      css: "ul.select2-results__options li",
    });
    let searchResultsOptions = [];
    for (i = 0; i < searchResultRaw.length; i++) {
      item = await searchResultRaw[i].getText();
      searchResultsOptions.push(item);
    }
    console.log(searchResultsOptions);

    for (let i = 0; i < searchResultRaw.length; i++) {
      await searchResultRaw[i].click();
    }

    //await select.selectByVisibleText("Phoenix");
  } catch (e) {
    console.log(` error ${e} in function test`);
  } finally {
    //await driver.quit();
  }
}

test();
