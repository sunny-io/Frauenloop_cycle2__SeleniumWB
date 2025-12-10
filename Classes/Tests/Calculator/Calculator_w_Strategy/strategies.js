const Calculator = require("./CalculatorPageModel");
require("chromedriver");
const chrome = require("selenium-webdriver/chrome");
const firefox = require("selenium-webdriver/firefox");
const safari = require("selenium-webdriver/safari");
const { Builder, Browser } = require("selenium-webdriver");

class chromeCalculator extends Calculator {
  constructor() {
    super();
    this.browser = "chrome";
  }

  async open() {
    const options = new chrome.Options();
    options.addArguments("--force-device-scale-factor=0.75");
    this.driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();
    await this.driver.get(this.url);
  }
}

class firefoxCalculator extends Calculator {
  constructor() {
    super();
    this.browser = "firefox";
  }

  async open() {
    let options = new firefox.Options();
    //options.addArguments("--force-device-scale-factor=0.75");
    options.setPreference("layout.css.devPixelsPerPx", "0.75");
    this.driver = new Builder()
      .forBrowser(Browser.FIREFOX)
      .setFirefoxOptions(options)
      .build();
    await this.driver.get(this.url);
  }
}

class safariCalculator extends Calculator {
  constructor() {
    super();
    this.browser = "safari";
  }

  async open() {
    const options = new safari.Options();
    this.driver = await new Builder()
      .forBrowser(Browser.SAFARI)
      .setSafariOptions(options)
      .build();

    await this.driver.get(this.url);
    await this.sleep(100);
  }
}

module.exports = { chromeCalculator, firefoxCalculator, safariCalculator };
