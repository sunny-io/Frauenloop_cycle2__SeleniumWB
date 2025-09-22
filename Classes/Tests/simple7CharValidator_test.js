const assert = require("node:assert");
const { WebDriver, until, Builder, Key } = require("selenium-webdriver");

require("chromedriver");

const testcases = [
  { Data: 9999999, "expected Output": "Valid Value" },
  { Data: "#$%^#", "expected Output": "Invalid value" },
  { Data: "hendd**", "expected Output": "valid value" },
  { Data: "AHYEDIO", "expected Output": "valid value" },
  { Data: "jdtegdj", "expected Output": "valid value" },
  { Data: 3705490, "expected Output": "valid value" },
  { Data: "ASHFbnj", "expected Output": "valid value" },
  { Data: "hye76BG", "expected Output": "valid value" },
  { Data: "23BgbG*", "expected Output": "valid value" },
  { Data: "gyr$%8N", "expected Output": "invalid value" },
  { Data: "bhtr50", "expected Output": "invalid value" },
  { Data: "huy bh", "expected Output": "invalid value" },
];

async function runTest(testcase) {
  let driver;
  try {
    driver = await new Builder().forBrowser("chrome").build();
    await driver.get(
      "https://testpages.eviltester.com/styled/apps/7charval/simple7charvalidation.html"
    );
    console.log(await driver.getTitle());
    await driver
      .findElement({ css: "input[name = 'characters']" })
      .sendKeys(testcase.Data, Key.ENTER);
    await driver.findElement({ css: "input[name = 'validate']" }).click();

    await driver.sleep(1000);
    assert.equal(
      await driver.findElement({ css: "input[name = 'validation_message']" }),
      testcase["expected output"]
    );
  } catch (e) {
    console.log(e);
  } finally {
    await driver.quit();
  }
}

//loop through all testcases
function runAllTests() {
  for (let i = 0; i < testcases.length; i++) {}
}
runTest(testcases[3]);
