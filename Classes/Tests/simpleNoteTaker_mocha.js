//npx mocha ./simpleNoteTaker_mocha.js --no-timeouts

const { Builder, By, Key, until } = require("selenium-webdriver");
require("chromedriver");
const { assert } = require("chai");
const fs = require("fs");

class Notetaker {
  constructor(url) {
    this.driver = null;
    this.url = url;
    this.notelist = []; //to keep track of the notes I create
  }

  async open() {
    //open test page
    try {
      this.driver = await new Builder().forBrowser("chrome").build();
      await this.driver.get(this.url);
    } catch (e) {
      console.log(`${e} error in open page`);
    }
  }

  // fill empty input field
  async setNewInput(id, input) {
    let n = this.driver.findElement({ id: id });
    await n.clear();
    await n.sendKeys(input);
  }

  // add input to already filled field
  async editInput(id, input) {
    let n = this.driver.findElement({ id: id });
    //could I position the cursor in the input field and edit there?
    await n.sendKeys("newInput: ");
    await n.sendKeys(input);
  }

  // helper function to check up on all buttons
  async getButtonList() {
    console.log("get button list started");
    this.driver.sleep(1000);
    let n = await this.driver.findElements({ css: "button" });

    for (let i = 0; i < n.length; i++) {
      console.log(await n[i].getAttribute("id"));
    }
  }

  // click button, scrolling etc added to get around the button not clickable errors
  // does not help much
  async click(id) {
    console.log(`click button ${id}`);
    await this.scroll(id);
    try {
      const element = await this.driver.findElement({ id: id });
      await element.click();
    } catch (e) {
      console.log(`error ${e} in click`);
    }
  }

  async getNoteIndentifyer() {
    //find Note in list
  }

  async sleep(n) {
    await this.driver.sleep(n);
  }

  // put wait for element clickable before the actual input so maybe i get every note and not every second?
  async createNote(title, note) {
    try {
      const element = await this.driver.wait(
        until.elementLocated(By.id("add-note")),
        10000
      );
      await this.driver.wait(until.elementIsVisible(element), 5000);
      await this.driver.wait(until.elementIsEnabled(element), 5000);

      await this.setNewInput("note-title-input", title);
      await this.setNewInput("note-details-input", note);
      await this.click("add-note");
    } catch (e) {
      console.log(`error in create note: ${e}`);
    }
  }

  //get list of notes
  // didn't get it to work before the reload happens yet
  // didnät get clicking load and show to work either
  async getNoteList() {
    await this.driver.wait(
      until.elementLocated(By.css("div.note-in-list")),
      10000
    );

    let n = await this.driver.findElements({ css: "div.note-in-list" });

    let currNoteList = [];
    for (let i = 0; i < n.length; i++) {
      dk = n[i].getAttribute["data-key"];
      console.log(dk);
      currNoteList.push(dk);
    }
    console.log(currNoteList);
    return currNoteList;
  }

  async getTitle() {
    return await this.driver.getTitle();
  }

  //get status message. p#note-status-details always exists but is empty most of the time
  async getNoteStatus() {
    //problem with timing. The notes status only shows up for about 3 seconds before the page  reloads
    try {
      let n = await this.driver
        .findElement({ id: "note-status-details" })
        .getText();
      /*  let counter = 0;
      while ((await n) == "" || counter < 50) {
        n = await this.driver
          .findElement({ id: "note-status-details" })
          .getText();
        counter += 1;
        console.log(`counter: ${counter}`);
      } */
      return n;
    } catch (e) {
      console.log(` error ${e} in getNoteStatus`);
    }
  }

  //scroll to an input element to ensure its visible
  async scroll(id) {
    //scroll to a button to ensure visibility
    await this.driver.wait(until.elementLocated(By.id(id)), 10000);
    const element = await this.driver.findElement({ id: id });
    this.driver.executeScript("arguments[0].scrollIntoView(true);", element);
  }

  // clear all opens confirmation alert
  async confirmAlert() {
    await this.driver.wait(until.alertIsPresent());
    let alert = await this.driver.switchTo().alert();
    await alert.accept();
  }

  async close() {
    //  await this.driver.quit();
  }
}

describe("testsuite 1 Simple Note Taker", function () {
  this.timeout(0);
  const noteTaker = new Notetaker(
    "https://testpages.eviltester.com/apps/note-taker/"
  );
  before(async function () {
    await noteTaker.open();
  });

  after(async function () {
    //await noteTaker.close()
  });

  it("Create notes no assert", async function () {
    await noteTaker.sleep(500);
    let title = "Note ";
    let note = "Text for note: ";
    for (let i = 0; i < 5; i++) {
      await noteTaker.createNote(title + i, note + i);
      await noteTaker.sleep(1000);
    }
  });

  it("Create notes, assert loaded list", async function () {
    await noteTaker.sleep(500);
    let title = "Note ";
    let note = "Text for note: ";
    for (let i = 5; i < 10; i++) {
      await noteTaker.createNote(title + i, note + i);
      await noteTaker.sleep(1000);
    }
    await noteTaker.click("load-notes");
    await noteTaker.sleep(500);
    await noteTaker.click("show-notes");
    await noteTaker.sleep(1000);
    let noteStatus = await noteTaker.getNoteStatus();
    assert.equal(noteStatus, "Notes Shown");
    let currNoteList = await noteTaker.getNoteList;
    console.log(currNoteList);
  });
});

describe("Testsuit Simple Note Taker", function () {
  //remove --no-timeouts
  this.timeout(0);
  const noteTaker = new Notetaker(
    "https://testpages.eviltester.com/apps/note-taker/"
  );

  before(async function () {
    //await noteTaker.open()
  });

  beforeEach(async function () {
    await noteTaker.open();
    await noteTaker.scroll("load-notes");
    await noteTaker.sleep(1000);
    //await noteTaker.getButtonList();
  });

  after(async function () {
    //await noteTaker.close()
  });

  afterEach(async function () {
    //await noteTaker.close();
  });

  it.skip("Create one note and assert it was created", async function () {
    await noteTaker.sleep(500);
    await noteTaker.click("clear-notes");
    await noteTaker.confirmAlert();
    await noteTaker.sleep(100);

    await noteTaker.createNote("Title 1st note", "Some text for 1st note");
    let noteStatus = await noteTaker.getNoteStatus();
    console.log(noteStatus);
    //assert.equal(noteStatus, "Added Note");
    await noteTaker.click("load-notes");
    await noteTaker.sleep(500);
    await noteTaker.click("show-notes");
    let currNoteList = await noteTaker.getNoteList;
    console.log(currNoteList);
  });
});
