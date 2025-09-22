const assert = require("node:assert");
const { WebDriver, until, Builder, Key } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const extensionPath =
  "/Users/sunny-io/Library/Application Support/Google/Chrome/Default/Extensions/cfhdojbkjhnklbpkdaibdccddilifddb";
require("chromedriver");
// adblockerPlus /Users/sunny-io/Library/Application\ Support/Google/Chrome/Default/Extensions cfhdojbkjhnklbpkdaibdccddilifddb
const options = new chrome.Options();
// For unpacked extension:
options.addArguments(`--load-extension=${extensionPath}`);
// For .crx file: options.addExtensions('/path/to/extension.crx');
//options.addExtensions("../Adblock-Plus.crx");

//test fails for testcase 3 bc the radiobutton is disabled
const testcases = [
  { radio: "yesRadio", expected: "Yes" },
  { radio: "impressiveRadio", expected: "Impressive" },
  { radio: "NoRadio", expected: "No" },
];

/* const driver = await new Builder()
  .forBrowser("chrome")
  .setChromeOptions(options)
  .build(); */

async function runTest(testcase) {
  let driver;
  try {
    //tried to start chrome with adblocker, didn't work
    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();
    //normal start
    /*  driver = await new Builder().forBrowser("chrome").build(); */
    console.log("driver loaded");
    await driver.get("https://demoqa.com/radio-button");
    console.log(await driver.getTitle());
    await driver.sleep(1000);
    console.log(testcase.radio);
    assert.ok(driver.findElement({ id: testcase.radio }));

    await driver.findElement({ css: `label[for="${testcase.radio}"]` }).click();
    await driver.sleep(2000);
    await driver.findElement({ className: "text-success" });
    let result = "";
    result = await driver.findElement({ className: "text-success" }).getText();
    console.log(result);

    assert.equal(result, testcase.expected);
    console.log(`Test passed for ${testcase.radio}, ${testcase.expected}`);
  } catch (e) {
    console.log(e);
  } finally {
    await driver.quit();
  }
}

//loop through all testcases
async function runAllTests() {
  for (let i = 0; i < testcases.length; i++) {
    await runTest(testcases[i]);
  }
}

//runTest(testcases[0]);

runAllTests();
