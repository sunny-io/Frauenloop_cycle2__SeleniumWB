//npx mocha ./practice_automation-switch_windows.js
const {
  WebDriver,
  until,
  Builder,
  Key,
  By,
  Browser,
  Select,
} = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
require("chromedriver");
let opts = new chrome.Options();
//opts.addArguments("--headless");
const { assert } = require("chai");
const fs = require("fs");
const path = require("path");
const forEach = require("mocha-each");
const { validateHeaderName } = require("http");

describe("Interactions - Windows", function () {
  let driver;
  this.timeout(0);
  before(async function () {
    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(opts)
      .build();
  });

  //after(async () => await driver.quit());

  it.only("Should open new tab and switch", async function () {
    await driver.get("https://practice-automation.com/window-operations/");
    const initialWindow = await driver.getAllWindowHandles();
    console.log(JSON.stringify(initialWindow));
    assert.strictEqual(initialWindow.length, 1);

    // Opens a new tab and switches to new tab
    let buttons = await driver.findElements(By.css("button.custom_btn"));

    await buttons[0].click();

    let browserTabs = await driver.getAllWindowHandles();
    console.log(browserTabs);

    assert.strictEqual(browserTabs.length, 2);

    await driver.switchTo().newWindow("browserTabs[1]");
    browserTabs = await driver.getAllWindowHandles();
    console.log(browserTabs);

    let current = await driver.getWindowHandle();
    console.log(current);

    await driver.switchTo().newWindow("browserTabs[0]");
    current = await driver.getWindowHandle();
    console.log(current);
  });
});
