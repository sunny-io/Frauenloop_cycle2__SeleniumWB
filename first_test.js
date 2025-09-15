const assert = require("node:assert");
const { WebDriver, until, Builder, Key } = require("selenium-webdriver");

require("chromedriver");

async function firstTest() {
  let driver;
  try {
    driver = await new Builder().forBrowser("chrome").build();
    await driver.get("https://duckduckgo.com");
    console.log(await driver.getTitle());
    await driver
      .findElement({ id: "searchbox_input" })
      .sendKeys("Selenium Webdriver documentation", Key.ENTER);
    await driver.wait(until.titleContains("Selenium"), 1000);
    console.log(await driver.getTitle());
    assert.equal(
      await driver.getTitle(),
      "Selenium Webdriver documentation at DuckDuckGo"
    );
  } catch (e) {
    console.log(e);
  } finally {
    await driver.quit();
  }
}

firstTest();
