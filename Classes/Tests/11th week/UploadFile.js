const {
  Builder,
  By,
  Key,
  until,
  Origin,
  Button,
} = require("selenium-webdriver");
require("chromedriver");
const chrome = require("selenium-webdriver/chrome");

class Upload {
  constructor() {
    this.driver = null;
    this.url = "https://testpages.eviltester.com/pages/files/file-upload/";
  }

  async open() {}

  async setInput(id, input) {
    let n = await this.driver.findElement(By.id(id));
    await n.sendKeys(input);
  }

  async click(id) {
    await this.driver.findElement(By.id(id)).click();
    await this.sleep(100);
  }

  async submit() {
    await this.driver.findElement(By.css('input[type="submit"]')).submit();
    await this.sleep(1000);
    await this.driver.wait(until.titleContains("Upload Results"), 1000);
  }

  async getTxt(id) {
    return await this.driver.findElement(By.id(id)).getText();
  }

  async getTitle() {
    return await this.driver.getTitle();
  }

  async max() {
    await this.driver.manage().window().maximize();
    await this.sleep(100);
  }

  async scroll(y) {
    await this.driver.actions().scroll(0, 0, 0, y).perform();
    await this.sleep(500);
  }

  async sleep(n) {
    await this.driver.sleep(n);
  }

  async close() {
    await this.driver.quit();
  }
}

module.exports = Upload;
