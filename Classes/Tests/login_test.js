//requirements node
const assert = require("node:assert");
const { WebDriver, until, Builder, Key } = require("selenium-webdriver");

require("chromedriver");

//first try to define a page object
const pageObject = {
  baseUrl: "https://practicetestautomation.com/practice-test-login/",
  main: 'section[id="login"]',
  inputFields: [
    { username: { locatortype: "id", locator: "username" } },
    { password: { locatortype: "id", locator: "password" } },
  ],
  buttons: [{ submit: { locatortype: "id", locator: "submit" } }],
};

//testcases
testcases = [
  {
    testid: "loginSuccess",
    baseUrlTitle: "Test Login | Practice Test Automation",
    action: "fillAndSubmitForm",
    data: [
      { locator: pageObject.inputFields.username, content: "student" },
      { locator: pageObject.inputFields.password, content: "Password123" },
    ],
    submitBtn: pageObject.buttons[0],
  },
];

// reusable function to fill a field. Currently only locatortype id supported
async function fillField(locator, content) {
  console.log("started fillField");
  if (locator.locatortype == "id") {
    try {
      await driver
        .findElement({ id: locator.locator })
        .sendKeys(content, Key.ENTER);
      await driver.wait(
        until.findElement({ id: locator.locator }).value == content,
        1000
      );
      console.log(await driver.findElement({ id: locator.locator }).value);
      assert.equal(
        await driver.findElement({ id: locator.locator }).value,
        content
      );
      console.log(`field ${locator.locator} filled with ${content}`);
    } catch (e) {
      console.log(`error in fillField ${e}`);
    }
  }
}

// function to loop through all input fields in the test case
async function fillFields(data) {
  try {
    for (i = 0; i < data.length; i++) {
      await fillField(data.locator, data.content);
    }
  } catch (e) {
    console.log(`error in fillFields ${e}`);
  }
}

async function executeTestLogic(testcase) {
  if (testcase.action == "fillAndSubmitForm") {
    try {
      await fillFields(testcase.data);
    } catch (e) {
      console.log(`error in executeTestLogic ${e}`);
    }
    try {
      driver.findElement({ id: "submit" }).click(); //fixed id for now
    } catch (e) {
      console.log(`error in clicking Submit Button ${e}`);
    }
  }
}

// function the coordinate the actual test
async function runTest(testcase) {
  console.log(testcase.testid);
  let driver;
  try {
    driver = await new Builder().forBrowser("chrome").build();
    await driver.get(pageObject.baseUrl);
    assert.equal(await driver.getTitle(), testcase.baseUrlTitle);

    await executeTestLogic(testcase);
  } catch (e) {
    console.log(e);
  } finally {
    await driver.quit();
  }
}

runTest(testcases[0]);
