const { Builder, By } = require("selenium-webdriver");
require("chromedriver");
const { assert } = require("chai");

class DragnDrop {
  constructor(driver, url) {
    this.driver = driver;
    this.url = url;
  }

  async open() {
    await this.driver.get(this.url);
  }

  async dragDrop(dragID, dropID) {
    const draggable = await this.driver.findElement(By.id(dragID));
    const droppable = await this.driver.findElement(By.id(dropID));
    const actions = this.driver.actions({ async: true });
    await actions.dragAndDrop(draggable, droppable).perform();
  }

  async getResult(resultId) {
    return await this.driver.findElement(By.id(resultId)).getText();
  }
}

async function test() {
  //open Chrome browser

  let driver;
  try {
    driver = await new Builder().forBrowser("chrome").build();
    let url = "https://www.selenium.dev/selenium/web/mouse_interaction.html";
    let obj = new DragnDrop(driver, url);
    await obj.open();
    await obj.dragDrop("draggable", "droppable");
    let result = await obj.getResult("drop-status");
    assert.deepStrictEqual("dropped", result);
  } catch (e) {
    console.log(e);
  } finally {
    await driver.quit();
  }
}

test();
