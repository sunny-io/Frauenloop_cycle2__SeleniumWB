//npx mocha ./FileActions/herokuapp_fileDownload_mocha.js
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
const chrome = require("selenium-webdriver/chrome");
const { assert } = require("chai");
const fs = require("fs");
const path = require("path");
const forEach = require("mocha-each");
const { validateHeaderName } = require("http");
const downloadDir = "Download";

const locators = {
  titleInPage: {
    locatortype: "css",
    hits: 1,
    value: "h3",
  },
  dlLinks: {
    locatortype: "css",
    hits: 2,
    value: "div.example a",
  },
};

class FileActions {
  constructor(url) {
    this.driver = null;
    this.url = url;
  }

  async open() {
    const options = new chrome.Options();
    let folderPath = path.resolve("/Users/sunny-io/Downloads");
    options.setUserPreferences({
      "download.default_directory": folderPath,
      "download.prompt_for_download": false,
      "safebrowsing.enabled": true,
    });
    this.driver = await new Builder().forBrowser("chrome").build();
    await this.driver.get(this.url);
  }

  async isFound(filename) {
    let filePath = path.resolve("/Users/sunny-io/Downloads/" + filename);
    await this.waitforFile(filename);
    return fs.existsSync(filePath);
  }

  async waitforFile(filename) {
    let filePath = path.resolve("/Users/sunny-io/Downloads/" + filename);
    console.log(filePath);
    let flag = fs.existsSync(filePath);
    if (!flag) {
      await this.sleep(1000);
      await this.driver.wait(async () => {
        let flag = await this.waitforFile(filename);
        return flag;
      }, 5000);
      return fs.existsSync(filePath);
    } else {
      console.log("not found");
    }
  }

  makeLocator(item) {
    let locator;
    if (item.locatortype == "id") {
      locator = item.value;
    } else if (item.locatortype == "attribute") {
      let attribute = item.attribute;
      //console.log(attribute);
      locator = "//button[@" + attribute + "=" + "'" + item.value + "']";
    }
    return locator;
  }
  async getLinkList(locator) {
    let files = [];
    let els = await this.driver.findElements(locator);
    for (let el of els) {
      let href = await el.getAttribute("href");
      let name = await el.getText();
      files.push({ name: name, link: href });
    }
    //console.log(files);
    return files;
  }

  async click(type, locator) {
    try {
      let element;
      console.log(`type: ${type}, locator: ${locator}`);
      if (type == "id") {
        element = await this.driver.findElement(By.id(locator));
      } else if (type == "attribute") {
        element = await this.driver.findElement(By.xpath(locator));
      } else if (type == "css") {
        element = await this.driver.findElement(By.css(locator));
      } else {
        console.log(`type ${type} not defined`);
      }
      console.log(await element.getText());
      await this.driver.executeScript(
        "arguments[0].scrollIntoView({block:'center', inline:'nearest'});",
        element
      );
      await this.sleep(1000);
      await element.click();
    } catch (e) {
      console.log(`Error ${e} in click()`);
    }
  }

  async focus(locator) {
    const el = await this.driver.findElement(locator);
    //hack but works
    await this.driver.executeScript("arguments[0].focus();", el);
  }

  async keyDown(key) {
    await this.driver.actions().keyDown(key).perform();
  }
  async keyUp(key) {
    await this.driver.actions().keyDown(key).perform();
    await this.driver.actions().keyUp(key).perform();
  }

  async keyPress(key) {
    await this.driver.actions().sendKeys(key).perform();
  }

  async contextMenu(locator) {
    const el = await this.driver.findElement(locator);
    const actions = this.driver.actions({ async: true });
    await actions.contextClick(el).perform();
  }

  async getText(locator) {
    let result = await this.driver.findElement(locator).getText();
    return result;
  }

  async getClass(locator) {
    let bClass = await this.driver.findElement(locator).getAttribute("class");
    //console.log(bClass);
    return bClass;
  }

  async sleep(n) {
    await this.driver.sleep(n);
  }

  async getTitle() {
    return await this.driver.getTitle();
  }

  async close() {
    await this.driver.quit();
  }

  async takeScreenshot(fname) {
    let image = await this.driver.takeScreenshot();
    fs.writeFileSync(fname, image, "base64");
  }

  async getCurrUrl() {
    let currUrl = await this.driver.getCurrentUrl();
    return currUrl;
  }
}

describe("Testsuit", function () {
  //remove --no-timeouts
  this.timeout(0);
  const fileDownload = new FileActions(
    "https://the-internet.herokuapp.com/download"
  );

  before(async function () {
    //await fileDownload.open()
  });

  beforeEach(async function () {
    await fileDownload.open();
    await fileDownload.sleep(1000);
  });

  after(async function () {
    //await fileDownload.close()
  });

  afterEach(async function () {
    await fileDownload.close();
  });

  it("Open Page and Assert title", async function () {
    let title = await fileDownload.getTitle();
    console.log(title);
    assert.equal(title, "The Internet");
    let h1 = await fileDownload.getText(By.css("h3"));
    assert.equal(h1, "File Downloader");
  });

  it("Download all files from list", async function () {
    let files = await fileDownload.getLinkList(By.css(locators.dlLinks.value));

    for (let i = 0; i < files.length; i++) {
      console.log(files[i]);
      let locator = `//a[contains(text(),'${files[i].name}')]`;
      console.log(locator);
      let dl = await fileDownload.click("attribute", locator);

      let fileFound = await fileDownload.isFound(files[i].name);
      assert.isTrue(await fileFound);
    }
  });
});
