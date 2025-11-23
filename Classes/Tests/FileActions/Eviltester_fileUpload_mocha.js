//npx mocha ./FileActions/Eviltester_fileUpload_mocha.js
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

const file2Upload = "./calculator-0.png";
const f2Ushort = "calculator-0.png";
const screenshot = "ET_fileUpload";

const locators = {
  dropzone: {
    locatortype: "id",
    value: "drop-zone",
  },
  fileinput: {
    locatortype: "id",
    value: "fileinput",
  },
  imageRadio: {
    locatortype: "id",
    value: "itsanimage",
  },
  imageGeneral: {
    locatortype: "id",
    value: "itsafile",
  },
  uploadBtn: {
    locatortype: "attribute",
    attribute: "name",
    value: "upload",
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
    //console.log(locator);
    if (type == "id") {
      await this.driver.findElement(By.id(locator)).click();
    } else if (type == "attribute") {
      await this.driver.findElement(By.xpath(locator)).click();
    }
  }

  async uploadDnD(file2Upload) {
    try {
      let image = path.resolve(file2Upload);
      await this.driver.manage().setTimeouts({ implicit: 5000 });

      await this.driver.findElement(By.id("drop-zone")).sendKeys(image);
    } catch (e) {
      console.log(`error ${e} in uploadDnd`);
    }
  }

  async uploadFsSelect(file2Upload, ftype) {
    try {
      let typeLocator;
      if (ftype == "image") {
        typeLocator = "itsanimage";
      } else {
        typeLocator = "itsafile";
      }
      let image = path.resolve(file2Upload);

      let btn = await this.driver.findElement(By.id("fileinput"));
      const input = await this.driver.findElement(By.id("fileinput"));
      await input.sendKeys(image);

      await this.driver.manage().setTimeouts({ implicit: 5000 });
      await this.driver.findElement(By.id(typeLocator)).click();

      await this.driver.findElement(By.name("upload")).click();
    } catch (e) {
      console.log(`error ${e} in uploadDnd`);
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
  const fileUpload = new FileActions(
    "https://testpages.eviltester.com/pages/files/file-upload/"
  );

  before(async function () {
    //await fileUpload.open()
  });

  beforeEach(async function () {
    await fileUpload.open();
  });

  after(async function () {
    //await fileUpload.close()
  });

  afterEach(async function () {
    //await fileUpload.close();
  });

  it("Open Page and Assert title", async function () {
    let title = await fileUpload.getTitle();
    assert.equal(title, "File Upload | Test Pages");
  });
  it("Upload image using file selection box", async function () {
    let targetFT = "image";
    await fileUpload.uploadFsSelect(file2Upload, targetFT);
    await fileUpload.sleep(500);

    let newUrl = "https://testpages.eviltester.com/uploads/fileprocessor";
    let newBtn = "goback";
    let currUrl = await fileUpload.getCurrUrl();
    assert.equal(currUrl, newUrl);
    let uploadedFT = await fileUpload.getText(By.id("uploadedfiletype"));
    assert.equal(await uploadedFT, targetFT);
    let uploadedFile = await fileUpload.getText(By.id("uploadedfilename"));
    assert.equal(uploadedFile, f2Ushort);
    fileUpload.click("id", newBtn);
  });
  it.skip("Upload image using file selection box and setting radio to general", async function () {
    //this one fails bc the filetype is set according to the actual file, not the radio button setting
    let targetFT = "other";
    await fileUpload.uploadFsSelect(file2Upload, targetFT);
    await fileUpload.sleep(500);

    let newUrl = "https://testpages.eviltester.com/uploads/fileprocessor";
    let newBtn = "goback";
    let currUrl = await fileUpload.getCurrUrl();
    assert.equal(currUrl, newUrl);
    let uploadedFT = await fileUpload.getText(By.id("uploadedfiletype"));
    assert.equal(await uploadedFT, targetFT);
    let uploadedFile = await fileUpload.getText(By.id("uploadedfilename"));
    assert.equal(uploadedFile, f2Ushort);
    fileUpload.click("id", newBtn);
  });

  it("Upload text file using file selection box", async function () {
    let targetFT = "other";
    let otherFile = "someFile.txt";
    await fileUpload.uploadFsSelect(otherFile, targetFT);
    await fileUpload.sleep(500);

    let newUrl = "https://testpages.eviltester.com/uploads/fileprocessor";
    let newBtn = "goback";
    let currUrl = await fileUpload.getCurrUrl();
    assert.equal(currUrl, newUrl);
    let uploadedFT = await fileUpload.getText(By.id("uploadedfiletype"));
    assert.equal(await uploadedFT, targetFT);
    let uploadedFile = await fileUpload.getText(By.id("uploadedfilename"));
    assert.equal(uploadedFile, otherFile);
  });

  it.skip("Upload text file using drop area", async function () {
    //this one does not work, it would need a different approach
    let targetFT = "other";
    let otherFile = "someFile.txt";
    await fileUpload.uploadDnD(otherFile);
    await fileUpload.sleep(500);

    let newUrl = "https://testpages.eviltester.com/uploads/fileprocessor";
    let newBtn = "goback";
    let currUrl = await fileUpload.getCurrUrl();
    assert.equal(currUrl, newUrl);
    let uploadedFT = await fileUpload.getText(By.id("uploadedfiletype"));
    assert.equal(await uploadedFT, targetFT);
    let uploadedFile = await fileUpload.getText(By.id("uploadedfilename"));
    assert.equal(uploadedFile, otherFile);
  });
});
