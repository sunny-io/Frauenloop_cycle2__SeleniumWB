//requirements node
const assert = require("node:assert");
const { WebDriver, until, Builder, Key, By } = require("selenium-webdriver");

require("chromedriver");

//first try to define a page object
const pageObject = {
  baseUrl: "https://practicetestautomation.com/practice-test-login/",
  main: 'section[id="login"]',
  inputFields: {
    username: { locatortype: "id", locator: "username" },
    password: { locatortype: "id", locator: "password" },
  },

  buttons: { submit: { locatortype: "id", locator: "submit" }, logout: {} },
  errorMsgs: { locatortype: "id", locator: "error"},
};

//testcases
testcases = [
  {
    testid: "loginSuccess",
    baseUrlTitle: "Test Login | Practice Test Automation",
    action: "fillAndSubmitForm",
    data: {
      username: {
        locator: pageObject.inputFields.username,
        content: "student",
      },
      password: {
        locator: pageObject.inputFields.password,
        content: "Password123",
      },
    },
    submitBtn: pageObject.buttons[0],
    resultPageObject: {
      resultUrl: "practicetestautomation.com/logged-in-successfully/",
      resultUrlTitle: "Logged In Successfully | Practice Test Automation",
      resultItems: {
        firstTitle: { locatortype: "xpath", locator: "//h1.post-title" },
        resultButton: {
          locatortype: "xpath",
          locator: "//a.wp-block-button__link[text()='Log out']",
        },
      },
    },
  },
];

// reusable function to fill a field. Currently only locatortype id supported
async function fillField(dataset, driver) {
  console.log("started fillField");
  //console.log(JSON.stringify(dataset));
  if (dataset.locator.locatortype == "id") {
    try {
      console.log("started try fillField");
      await driver
        .findElement({ id: dataset.locator.locator })
        .sendKeys(dataset.content, Key.ENTER);
      await driver.wait(
        until.text_to_be_present_in_element_value(
          { id: dataset.locator.locator } == dataset.content
        ),
        1000
      );
      console.log(
        await driver.findElement({ id: dataset.locator.locator }).value
      );
      assert.equal(
        await driver.findElement({ id: dataset.locator.locator }).value,
        content
      );
      console.log(
        `field ${dataset.locator.locator} filled with ${dataset.content}`
      );
    } catch (e) {
      console.log(`error in fillField ${e}`);
    }
  }
}

// function to loop through all input fields in the test case
async function fillFields(data, driver) {
  try {
    for (const key of Object.keys(data)) {
      //console.log(JSON.stringify(data[key]));
      await fillField(data[key], driver);
    }
  } catch (e) {
    console.log(`error in fillFields ${e}`);
  }
}

async function assertResult(testcase, driver) {
  if (testcase.resultPageObject) {
    try {
      //assert new page result
      await driver.wait(
        until.urlContains(testcase.resultPageObject.resultUrl),
        1000
      );
      assert.ok(
        (await driver.getCurrentUrl()).includes(
          testcase.resultPageObject.resultUrl
        )
      );
      assert.ok(
        (await driver.getTitle()).includes(
          testcase.resultPageObject.resultUrlTitle
        )
      );

      assert.ok(
        await driver.findElement(
          By.xpath(testcase.resultPageObject.resultButton.locator)
        )
      );
      assert.ok(
        await driver.findElement(
          By.xpath(testcase.resultPageObject.firstTitle.locator)
        )
      );
    } catch (e) {
      console.log(`error while asserting resultsPage ${e}`);
    }
    } else {
        assert.ok (
            (await driver.findElement( {xpath: pageObject.errorMsgs })
            );
    }
}

async function executeTestLogic(testcase, driver) {
  console.log("executeTestLogic started");
  if (testcase.action == "fillAndSubmitForm") {
    console.log(`testcase action: ${testcase.action}`);
    try {
      console.log(`testcase.data: ${JSON.stringify(testcase.data)}`);
      await fillFields(testcase.data, driver);
    } catch (e) {
      console.log(`error in executeTestLogic ${e}`);
    }
    try {
      await driver.findElement({ id: "submit" }).click();
    } catch (e) {
      console.log(`error in clicking Submit Button ${e}`);
    }
    assertResult(testcase, driver);
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
    console.log(await driver.getTitle());

    await executeTestLogic(testcase, driver);
  } catch (e) {
    console.log(e);
  } finally {
    //await driver.quit();
  }
}

runTest(testcases[0]);
