const assert = require("node:assert");
const { WebDriver, until, Builder, Key } = require("selenium-webdriver");

require("chromedriver");

const testcases = [
  { Data: 9999999, "expected Output": "Valid Value" },
  { Data: "#$%^#", "expected Output": "Invalid Value" },
  { Data: "hendd**", "expected Output": "Valid Value" },
  { Data: "AHYEDIO", "expected Output": "Valid Value" },
  { Data: "jdtegdj", "expected Output": "Valid Value" },
  { Data: 3705490, "expected Output": "Valid Value" },
  { Data: "ASHFbnj", "expected Output": "Valid Value" },
  { Data: "hye76BG", "expected Output": "Valid Value" },
  { Data: "23BgbG*", "expected Output": "Valid Value" },
  { Data: "gyr$%8N", "expected Output": "Invalid Value" },
  { Data: "bhtr50", "expected Output": "Invalid Value" },
  { Data: "huy bh", "expected Output": "Invalid Value" },
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
      .findElement({ name: "characters" })
      .sendKeys(testcase.Data, Key.ENTER);
    await driver.findElement({ name: "validate" }).click();

    await driver.sleep(2000);

    let result = "";
    result = await driver
      .findElement({ name: "validation_message" })
      .getAttribute("value");
    console.log(result);

    assert.equal(result, testcase["expected Output"]);
    console.log(
      `Test passed for ${testcase.Data}, ${testcase["expected Output"]}`
    );
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

//runTest(testcases[3]);

runAllTests();
