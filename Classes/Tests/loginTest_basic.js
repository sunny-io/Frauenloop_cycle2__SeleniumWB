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
  errorMsgs: { locatortype: "id", locator: "error" },
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
  {
    testid: "userNameFail",
    baseUrlTitle: "Test Login | Practice Test Automation",
    action: "fillAndSubmitForm",
    data: {
      username: {
        locator: pageObject.inputFields.username,
        content: "incorrectUser",
      },
      password: {
        locator: pageObject.inputFields.password,
        content: "Password123",
      },
    },
    submitBtn: pageObject.buttons[0],
    resultItems: {
      errorMsgs: {
        locator: pageObject.errorMsgs.locator,
        content: "Your username is invalid!",
        keyword: "username",
      },
    },
  },
  {
    testid: "passwordFail",
    baseUrlTitle: "Test Login | Practice Test Automation",
    action: "fillAndSubmitForm",
    data: {
      username: {
        locator: pageObject.inputFields.username,
        content: "student",
      },
      password: {
        locator: pageObject.inputFields.password,
        content: "incorrectPassword",
      },
    },
    submitBtn: pageObject.buttons[0],
    resultItems: {
      errorMsgs: {
        locator: pageObject.errorMsgs.locator,
        content: "Your password is invalid!",
        keyword: "password",
      },
    },
  },
];

async function fillField(dataset, driver) {
  console.log("started fillField");
  //console.log(JSON.stringify(dataset));
  if (dataset.locator.locatortype == "id") {
    try {
      console.log("started try fillField");
      await driver
        .findElement({ id: dataset.locator.locator })
        .sendKeys(dataset.content, Key.ENTER);
      /*   console.log(
        await driver.findElement({ id: dataset.locator.locator }).value
      );
      assert.equal(
        await driver.findElement({ id: dataset.locator.locator }).value,
        dataset.content
      );
      console.log(
        `field ${dataset.locator.locator} filled with ${dataset.content}`
      ); */
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

async function runTest(testcase) {
  console.log(testcase.testid);
  let driver;
  try {
    //initialize driver
    driver = await new Builder().forBrowser("chrome").build();
    await driver.get(pageObject.baseUrl);
    assert.equal(await driver.getTitle(), testcase.baseUrlTitle);
    console.log(await driver.getTitle());

    // fill fields
    if (testcase.action == "fillAndSubmitForm") {
      console.log(`testcase action: ${testcase.action}`);
      try {
        console.log(`testcase.data: ${JSON.stringify(testcase.data)}`);
        await fillFields(testcase.data, driver);
        await driver.findElement({ id: "submit" }).click();
      } catch (e) {
        console.log(`error in filling form ${e}`);
      }
    } else {
      console.log("action not supported");
    }
    // assert single-page result
    if (!testcase.resultPageObject) {
      console.log("asserting single-page results started");
      try {
        /* await driver.wait(
          until.elementTextContains(
            By.id("error"),
            testcase.resultItems.errorMsgs.keyword
          ),
          1000
        ); */
        await driver.sleep(1000); // fixed wait bc commented out wait block throws an error
        const errorElement = await driver.findElement({
          id: "error",
        });

        const classValue = await errorElement.getAttribute("class");
        console.log(`classValue: ${classValue}`);
        //this did not work as expected
        /*   if (assert.ok(classValue.includes("show"))) {
          assert.equal(
            await driver.findElement(
              {
                id: "error",
              }.innerText
            ),
            testcase.resultItems.errorMsgs
          );
        } else {
          assert.ok(classValue.includes("show"));
        } */
        let showSet = assert.ok(classValue.includes("show"));
        let text = await driver.findElement(By.id("error")).getText();
        let text2 = await driver
          .findElement({
            id: "error",
          })
          .getText();
        console.log(text, text2); // if this works, why does the assert get a type error?
        let textOK = assert.equal(
          await driver.f
            .findElement({
              id: "error",
            })
            .getText(),
          testcase.resultItems.errorMsgs
        ); //this seems to throw a type error
        console.log(
          ` assertion results: showSet: ${showSet}, testOK: ${textOK}`
        );
      } catch (e) {
        console.log(`error ${e} in asserting same-page result`);
      }
    }
  } catch (e) {
    console.log(e);
  } finally {
    //await driver.quit();
  }
}
runTest(testcases[2]);
