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
    actions: {
      action: ["openNote"],
      notePosition: 0,
      infoText: "Editing note: ",
    },
  },
  {
    testID: "snt006",
    actions: {
      action: ["openNote", "BtnAction"],
      fieldTitle: "Edited 1st note",
      fieldNote: " some text for new note edited",
      btn: "update-note",
      notePosition: 0,
      infoText: "Updated Note",
    },
  },
  {
    testID: "snt007",
    actions: {
      actions: ["openNote", "BtnAction"],
      fieldTitle: "Copied 2nd note",
      fieldNote: " Copied some text for new note",
      btn: "add-note",
      notePosition: 1,
      infoText: "Added Note",
    },
  },
  {
    testID: "snt008",
    actions: {
      actions: ["openNote", "BtnAction"],
      fieldTitle: "Edited 1st note",
      fieldNote: " some text for new note edited",
      btn: "cancel-note",
      notePosition: 2,
      infoText: "Cancelled Edit",
    },
  },
  {
    testID: "snt009",
    actions: {
      action: ["BtnAction", "dialogue"],
      fieldTitle: "",
      fieldNote: "",
      btn: "",
      notePosition: "",
      infoText: "No Notes Deleted",
      dialogue: "Cancel",
    },
  },
  {
    testID: "snt010",
    actions: {
      action: ["BtnAction", "dialogue"],
      fieldTitle: "",
      fieldNote: "",
      AddBtn: "",
      CancelBtn: "",
      UpdateBtn: "",
      ClearAllBtn: "click",
      notePosition: "",
      infoText: "Deleted All Notes",
      dialogue: "OK",
    },
  },
];

async function inputOutput(driver, actions) {
  try {
    await driver
      .findElement({ id: pageElements.titleInput })
      .sendKeys(actions.fieldTitle);
    await driver
      .findElement({ id: "note-details-input" })
      .sendKeys(actions.fieldNote);
    await driver.findElement({ id: actions.btn }).click();

    await driver.sleep(1000);
    let output = await driver
      .findElement({ id: "note-status-details" })
      .getText();
    console.log(`note status: ${output}`);
    return output;
  } catch (e) {
    console.log(`Error in InputOutput: ${e}`);
  }
}

async function test() {
  try {
    var driver = await new Builder().forBrowser(Browser.CHROME).build();

    await driver.get(baseURL);
    await driver.sleep(1000);
    let pageTitle = await driver.getTitle();
    assert.equal(pageTitle, "Simple Note Taker", "Page Title Mismatch");

    for (let i = 0; i < testcases.length; i++) {
      let testcase = testcases[i];
      console.log(testcase.testID);
      if (testcase.actions.action[0] == "createNewNote") {
        let noteListLength = (
          await driver.findElements({ css: ".note-in-list" })
        ).length;
        console.log(noteListLength);
        console.log(testcase.actions.infoText);
        let result = await inputOutput(driver, testcase.actions);
        assert.equal(result, testcase.actions.infoText);
      } else if (testcase.actions.action[0] == "openNote") {
        console.log(testcase.actions.notePosition);
        let editButtons = await driver.findElements({
          css: ".edit-note-in-list",
        });
        await editButtons[0].click();
        console.log(notes[0].getText());
      }
    }
  } catch (e) {
    console.log(e);
  } finally {
    //await driver.quit();
  }
}

test();
