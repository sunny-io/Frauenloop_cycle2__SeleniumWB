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
    let url =
      "https://yekoshy.github.io/Drag-n-Drop/SeleniumEasyDragnDrop.html";
    let obj = new DragnDrop(driver, url);
    await obj.open();
    const dragables = [
      "draggable-1",
      "draggable-2",
      "draggable-3",
      "draggable-4",
    ];

    let expected = [
      "Draggable 1",
      "Draggable 1\nDraggable 2",
      "Draggable 1\nDraggable 2\nDraggable 3",
      "Draggable 1\nDraggable 2\nDraggable 3\nDraggable 4",
    ];
    for (let i = 0; i < dragables.length; i++) {
      await obj.dragDrop(dragables[i], "drop-zone");

      let result = await obj.getResult("dropped-items-list");
      assert.deepStrictEqual(result, expected[i]);
      expected += ", ";
    }
  } catch (e) {
    console.log(e);
  } finally {
    await driver.quit();
  }
}

test();
