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

const pageElements = {
  titleInput: "note-title-input", //id
  noteInput: "note-details-input", //id
  noteStatus: "note-status-details", //id
  addBtn: "add-note", //this is a selector, not a color!
  updateBtn: "update-note", //id
  cancelBtn: "cancel-note", //id
  clearAllBtn: "clear-notes", //id
  listOfNotes: "list-of-notes", //id
  noteItemClass: ".note-in-list",
  delNoteBtnClass: "button.delete-note-in-list", // delete button of div.note-in-list
  editNoteBtnClass: "button.edit-note-in-list", // edit button of div.note-in-list
  noteDateKey: "data-key", //data-key attribute of div.note-in-list
};

const testcases = [
  {
    testID: "snt001",
    description: "create short note",
    actions: {
      action: ["createNewNote"],
      fieldTitle: "Title new note",
      fieldNote: "some text for new note",
      btn: "add-note",
      infoText: "Added Note",
    },
  },
  {
    testID: "snt002",
    description: "cancel note creation after input",
    actions: {
      action: ["createNewNote"],
      fieldTitle: "Title new note 2",
      fieldNote: "some text for new note2",
      btn: "cancel-note",
      infoText: "Cancelled Edit",
    },
  },
  {
    testID: "snt003",
    description: "create note with title > 255char",
    actions: {
      action: ["createNewNote"],
      fieldTitle:
        "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata",
      fieldNote: "some text for new note",
      btn: "add-note",
      infoText: "Added Note",
    },
  },
  {
    testID: "snt004",
    description: "create note with text > 255char",
    actions: {
      action: ["createNewNote"],
      fieldTitle: "long note",
      fieldNote:
        "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata", //skipped 32k test for practical reasons
      btn: "add-note",
      infoText: "Added Note",
    },
  },
  {
    testID: "snt005",
    description: "open note to edit, do no action",
    actions: {
      action: ["openNote"],
      notePosition: 0,
      infoText: "Editing Note: ",
    },
  },
  {
    testID: "snt006",
    description: "open note to edit, update: title and text",
    actions: {
      action: ["openNote", "BtnAction"],
      fieldTitle: "Edited 1st note title",
      btn: "update-note",
      notePosition: 0,
      infoText: "Updated Note",
    },
  },
  {
    testID: "snt007",
    description: "open note to edit, save changes as new note",
    actions: {
      action: ["openNote", "BtnAction"],
      fieldTitle: "Copied 2nd note",
      btn: "add-note",
      notePosition: 1,
      infoText: "Added Note",
    },
  },
  {
    testID: "snt008",
    description: "open note to edit, change data, cancel",
    actions: {
      action: ["openNote", "BtnAction"],
      fieldTitle: "Edited 1st note",
      fieldNote: " some text for new note edited",
      btn: "cancel-note",
      notePosition: 2,
      infoText: "Cancelled Edit",
    },
  },

  {
    testID: "snt009",
    description: "delete note (confirm)",
    actions: {
      action: ["delNote"],
      btn: "delete-note-in-list",
      notePosition: 2,
      infoText: "Deleted Note: ",
      confirm: true,
    },
  },
  {
    testID: "snt010",
    description: "delete note (dismiss)",
    actions: {
      action: ["delNote"],
      btn: "delete-note-in-list",
      notePosition: 1,
      infoText: "Delete Note Cancelled",
      confirm: false,
    },
  },
];

async function inputOutput(driver, actions) {
  //input function for note title and text
  try {
    if (actions.fieldTitle) {
      // no changing of the title when editing an existing note without set new title
      await driver
        .findElement({ id: pageElements.titleInput })
        .sendKeys(actions.fieldTitle);
    }
    if (actions.fieldNote) {
      // no changing of the note details when editing an existing note without set new text
      await driver
        .findElement({ id: "note-details-input" })
        .sendKeys(actions.fieldNote);
    }
    if (actions.btn) {
      //no clicking the button if edit is aborted without cancel
      await driver.findElement({ id: actions.btn }).click();

      await driver.sleep(1000);
      let output = await driver
        .findElement({ id: "note-status-details" })
        .getText();

      return output;
    } else {
      //note status when editing is aborted without cancel
      return "Editing Note: ";
    }
  } catch (e) {
    console.log(`Error in InputOutput: ${e}`);
  }
}

async function delNote(driver, actions) {
  try {
    // find all delete buttons
    let delButtons = await driver.findElements({
      css: ".delete-note-in-list",
    });

    //store id of note to be deleted and determine locator of note-to-be-deleted
    let noteID = await delButtons[actions.notePosition].getAttribute(
      "data-key"
    );
    //generate locator for later assertion
    locator = `div.note-in-list[data-key = "${noteID}"]`;

    //click delete button
    await delButtons[actions.notePosition].click();

    await driver.sleep(1000);

    //switch to alert
    let alert = await driver.switchTo().alert();

    // handle alert depending on test case
    if (actions.confirm) {
      //confirm delete alert
      await alert.accept();

      await driver.sleep(1000);

      //assert if element is no longer there
      let isPresent = await driver.findElements({ css: locator });

      assert.equal(isPresent.length, 0);
    } else {
      await alert.dismiss();

      await driver.sleep(1000);
      //assert if element is still there
      let isPresent = await driver.findElements({ css: locator });

      assert.equal(isPresent.length, 1);
    }
  } catch (e) {
    console.log(`error ${e} in delNote`);
  }
}

async function test() {
  try {
    var driver = await new Builder().forBrowser(Browser.CHROME).build();

    await driver.get(baseURL);
    await driver.sleep(1000);
    // confirm this is the expected page
    let pageTitle = await driver.getTitle();
    assert.equal(pageTitle, "Simple Note Taker", "Page Title Mismatch");

    // loop through test cases
    for (let i = 0; i < testcases.length; i++) {
      let testcase = testcases[i];
      /* console.log(testcase.testID);
      console.log(testcase.actions.action[0]); */

      // store current number of notes for later assertions
      let noOfNotes = Number(
        (await driver.findElements({ css: ".note-in-list" })).length
      );

      // handle different test case actions
      if (testcase.actions.action[0] == "createNewNote") {
        //handle note creation from scratch

        let result = await inputOutput(driver, testcase.actions);
        assert.equal(result, testcase.actions.infoText);
      } else if (testcase.actions.action[0] == "openNote") {
        // handle open existing note for editing - actual editing or creating copy handled in inputOutput

        // find alle edit buttons
        let editButtons = await driver.findElements({
          css: ".edit-note-in-list",
        });
        // click edit button for note position
        await editButtons[testcase.actions.notePosition].click();
        await driver.sleep(1000);

        // call inputOutput for actual text input handling
        let result = await inputOutput(driver, testcase.actions);

        // assert note status
        assert.equal(result, testcase.actions.infoText);
      } else if (testcase.actions.action[0] == "delNote") {
        // handle clicking of delete-button for note in position
        await delNote(driver, testcase.actions);
      } else {
        console.log("actions not recognized");
      }
      // store number of notes after action
      let newNoOfNotes = (await driver.findElements({ css: ".note-in-list" }))
        .length;

      // check result according to test case
      if (testcase.actions.btn == "add-note") {
        assert.equal(noOfNotes + 1, newNoOfNotes);
      } else if (testcase.actions.btn == "update-note") {
        assert.equal(noOfNotes, newNoOfNotes);
      } else if (
        testcase.actions.btn == "delete-note-in-list" &&
        testcase.actions.confirm
      ) {
        assert.equal(noOfNotes - 1, newNoOfNotes);
      } else if (
        testcase.actions.btn == "delete-note-in-list" &&
        !testcase.actions.confirm
      ) {
        assert.equal(noOfNotes, newNoOfNotes);
      }
      console.log(
        `testcase ${testcase.testID}: ${testcase.description} passed`
      );
    }
  } catch (e) {
    console.log(e);
  } finally {
    await driver.quit();
  }
}

test();
