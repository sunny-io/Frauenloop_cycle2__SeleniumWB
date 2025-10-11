// load all required modules
//const assert = require("node:assert"); //not importing node assert but chai
const {
  WebDriver,
  until,
  Builder,
  Key,
  By,
  Browser,
} = require("selenium-webdriver");

require("chromedriver");

// import chai
const chai = require("chai");
const assert = chai.assert;

// test data
const baseURL = "https://yekoshy.github.io/RadioBtn-n-Checkbox/"; // replace by page to test
const expectedTitle = "Complete Selection Test Site"; //fill in expected page title to assert you opened the right one

const baseDivLocator = "div.tree-view";
const interactionElements = {
  home: {
    id: "check-home",
    position: "0",
    type: "folder",
    toggleLocator: "div.tree-view ul li.folder.top-level span.toggle-arrow",
  },
  desktop: {
    id: "check-desktop",
    position: "0-1",
    type: "folder",
    toggleLocator: "div.tree-view > ul > li > ul > li:nth-child(1) > span",
  },
  notes: { id: "check-notes", position: "0-1-0" },
  commands: { id: "check-commands", position: "0-1-1" },
  documents: {
    id: "check-documents",
    position: "0-2",
    type: "folder",
    toggleLocator: "div.tree-view > ul > li > ul > li:nth-child(2) > span",
  },
  workspace: { id: "check-workspace", position: "0-2-0" },
  office: { id: "check-office", position: "0-2-1" },
  downloads: {
    id: "check-downloads",
    position: "0-2",
    type: "folder",
    toggleLocator: "div.tree-view > ul > li > ul > li:nth-child(3) > span",
  },
  wordfile: { id: "check-wordfile", position: "0-2-0" },
  excelfile: { id: "check-wordfile", position: "0-2-0" },
};

//helper function: check for toggle status

async function checkToggleStatus(driver, locator) {
  if (assert.isDefined(await driver.findElement(locator))) {
    let toggleClassList = await driver
      .findElement(locator)
      .getAttribute("class");
    return toggleClassList.includes("collapsed") ? "closed" : "open";
  } else {
    return "noToggle";
  }
}

async function checkTheBox(driver, locator) {
  try {
    // actually click a box
    let currBox = await driver.findElement({ id: locator });
    let currBoxValue = await currBox.getAttribute("value");

    let currBoxStatus = await currBox.isSelected();

    if (currBoxStatus == false) {
      await currBox.click();
      let output = await driver
        .findElement({ id: "checkbox-output" })
        .getText();
      assert.include(output, currBoxValue);
      return output;
    } else {
      await currBox.click();
      let output = await driver
        .findElement({ id: "checkbox-output" })
        .getText();
      assert.notInclude(output, currBoxValue);
      return output;
    }
  } catch (e) {
    console.log(`error ${e} in function checkTheBox`);
  }
}

async function test() {
  try {
    var driver = await new Builder().forBrowser(Browser.CHROME).build();

    await driver.get(baseURL);
    await driver.sleep(500);
    // check page
    assert.equal(
      await driver.getTitle(),
      expectedTitle,
      "page Title does not match"
    );
    // assert specific elements required to execute test
    const topLevelFolder = await driver.findElement({
      css: "div.tree-view ul li.folder.top-level",
    });
    const topLevelToggle = await driver.findElement({
      css: "div.tree-view ul li.folder.top-level span.toggle-arrow",
    });
    assert.isDefined(topLevelFolder, "top-level folder not defined");
    assert.isDefined(
      topLevelToggle,
      "top-level folder toogle-arrow not defined"
    );

    // set up simple test (open all levels and check from lowest to highest)
    await topLevelToggle.click();
    driver.sleep(500);
    const desktopToggle = await driver.findElement({
      css: interactionElements.desktop.toggleLocator,
    });

    assert.isDefined(desktopToggle, "desktop folder toggle not defined");
    await desktopToggle.click();

    const documentsToggle = await driver.findElement({
      css: interactionElements.documents.toggleLocator,
    });
    assert.isDefined(documentsToggle, "documents folder toggle not defined");
    await documentsToggle.click();

    const downloadsToggle = await driver.findElement({
      css: interactionElements.downloads.toggleLocator,
    });
    assert.isDefined(downloadsToggle, "downloads folder toggle not defined");
    await downloadsToggle.click();

    //scroll to panel output element to ensure visibility
    const element = await driver.findElement({ id: "checkbox-output" });
    await driver.executeScript("arguments[0].scrollIntoView(true);", element);

    //check all level2 checkboxes
    const leafCheckData = [
      {
        branch: "downloads",
        leaves: ["check-wordfile", "check-excelfile"],
        expected: "Downloads Word File.doc Excel File.doc",
      },
      {
        branch: "documents",
        leaves: ["check-office", "check-workspace"],
        expected: "Documents WorkSpace Office",
      },
      {
        branch: "desktop",
        leaves: ["check-notes", "check-commands"],
        expected: "Desktop Notes Commands",
      },
    ];

    for (let i = 0; i < leafCheckData.length; i++) {
      let currBoxData = [];

      let currBranch = leafCheckData[i].leaves;
      let expected = leafCheckData[i].expected;

      for (let j = 0; j < currBranch.length; j++) {
        result = await checkTheBox(driver, currBranch[j]);

        if (j == currBranch.length - 1) {
          assert.include(result, expected);
          if (i == leafCheckData.length - 1) {
            assert.equal(
              result,
              "Home Desktop Notes Commands Documents WorkSpace Office Downloads Word File.doc Excel File.doc"
            );
            console.log("Test passed: All checkboxes checked");
          }
        }
      }
    }
  } catch (e) {
    console.log(` error ${e} in function test`);
  } finally {
    //await driver.quit();
  }
}

test();
