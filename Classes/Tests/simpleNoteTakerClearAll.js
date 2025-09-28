// load all required modules
const assert = require("node:assert");
const {
  WebDriver,
  until,
  Builder,
  Key,
  By,
  Browser,
} = require("selenium-webdriver");

require("chromedriver");

const baseURL =
  "https://testpages.eviltester.com/styled/apps/notes/simplenotes.html"; // page to test

const testcases = [
  { testID: "snt011", confirm: true },
  { testID: "snt012", confirm: false },
];

async function clearAll(driver, confirm) {
  try {
    // click Clear All button
    await driver.findElement({ id: "clear-notes" }).click();
    await driver.sleep(1000);

    // switch to alert for interaction with it
    let alert = await driver.switchTo().alert();
    // check if its the expected alert
    let alertText = await alert.getText();
    assert.equal(alertText, "Are you sure you want to delete all notes");
    //confirm or dismiss depending on test case
    if (confirm) {
      await alert.accept();
    } else {
      await alert.dismiss();
    }
  } catch (e) {
    console.log(`error in clear All ${e}`);
  }
}

async function test(testcase) {
  try {
    var driver = await new Builder().forBrowser(Browser.CHROME).build();

    await driver.get(baseURL);
    await driver.sleep(1000);
    let pageTitle = await driver.getTitle();
    assert.equal(pageTitle, "Simple Note Taker", "Page Title Mismatch");
    //set basics for note generation
    let noteTitelBase = "new Note ";
    let noteContent = "some note text";
    //generate three notes
    for (let i = 0; i < 3; i++) {
      noteTitelBase += "n";
      await driver
        .findElement({ id: "note-title-input" })
        .sendKeys(noteTitelBase);

      await driver
        .findElement({ id: "note-details-input" })
        .sendKeys(noteContent);

      await driver.findElement({ id: "add-note" }).click();

      await driver.sleep(1000);
    }
    // store number of notes after note creation
    let noOfNotes = Number(
      (await driver.findElements({ css: ".note-in-list" })).length
    );

    //call clear all function
    await clearAll(driver, testcase.confirm);

    //store number of notes after test case action
    let newNoOfNotes = (await driver.findElements({ css: ".note-in-list" }))
      .length;
    //assert based on testcase
    if (testcase.confirm) {
      //after deletion, note list should be empty
      assert.equal(newNoOfNotes, 0);
    } else {
      //when deletion was not confirmed, note list should be the same length as before
      assert.equal(newNoOfNotes, noOfNotes);
    }
    console.log(`testcase ${testcase.testID} passed`);
  } catch (e) {
    console.log(e);
  } finally {
    await driver.quit();
  }
}

// for some reason, I needed this to be an async function and could not run the loop directly (gave weird errors about require)
async function runTest(testcases) {
  for (let i = 0; i < testcases.length; i++) {
    await test(testcases[i]);
  }
}

runTest(testcases);
