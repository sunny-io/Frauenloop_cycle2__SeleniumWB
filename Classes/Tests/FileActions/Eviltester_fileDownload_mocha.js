//npx mocha ./FileActions/Eviltester_fileDownload_mocha.js
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
const { assert } = require("chai");
const fs = require("fs");
const path = require("path");
const forEach = require("mocha-each");
const { validateHeaderName } = require("http");

const locators = {
  ffSasDO: {
    locatortype: "id",
    value: "server-fetch-data-object",
  },
  ffSandURI: {
    locatortype: "id",
    value: "server-fetch-uri-encoded",
  },
  gAndSaveDO: {
    locatortype: "id",
    value: "generate-data-object",
  },
  gAndURI: {
    locatortype: "id",
    value: "generate-uri-encoded",
  },
  directDL: {
    locatortype: "css",

    value: "p button#direct-download",
  },

  directLDL: {
    locatortype: "css",

    value: "a button#direct-download",
  },
  directDLNW: {
    locatortype: "id",

    value: "direct-download-window",
  },

  serverDL: {
    locatortype: "id",

    value: "direct-download-window",
  },
  postGetRedirect: {
    locatortype: "id",

    value: "post-getserver-download",
    resultpage: "https://testpages.eviltester.com/download/textfile.txt",
  },
  directLink: {
    locatortype: "id",

    value: "direct-link",
    resultpage: "https://testpages.eviltester.com/files/textfile.txt",
  },
};

class FileActions {
  constructor(url) {
    this.driver = null;
    this.url = url;
  }

  async open() {
    this.driver = await new Builder().forBrowser("chrome").build();
    await this.driver.get(this.url);
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

  async click(type, locator) {
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
    "https://testpages.eviltester.com/pages/files/file-downloads/"
  );

  before(async function () {
    //await fileDownload.open()
  });

  beforeEach(async function () {
    await fileDownload.open();
  });

  after(async function () {
    //await fileDownload.close()
  });

  afterEach(async function () {
    await fileDownload.close();
  });

  it("Open Page and Assert title", async function () {
    let title = await fileDownload.getTitle();
    assert.equal(title, "File Downloads | Test Pages");
  });

  it("Download using file Fetch From Server as Data Object", async function () {
    let locator = fileDownload.makeLocator(locators.ffSasDO);
    await fileDownload.click(locators.ffSasDO.locatortype, locator);
    await fileDownload.sleep(1000);

    let downloaded = await fileDownload.getText(By.id("status-display"));
    assert.notEqual(await downloaded, "Click a button to download a file");
  });

  it("Download using directLink", async function () {
    let locator = fileDownload.makeLocator(locators.directLink);
    console.log(locator);
    await fileDownload.click(locators.directLink.locatortype, locator);
    await fileDownload.sleep(1000);
    let currUrl = await fileDownload.getCurrUrl();
    assert.equal(currUrl, locators.directLink.resultpage);
  });
});
