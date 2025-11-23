//npx mocha ./Forms/eviltester_special-forms.js
const {
  WebDriver,
  until,
  Builder,
  Key,
  By,
  Browser,
  Select,
} = require("selenium-webdriver");
require("chromedriver");
const { assert } = require("chai");
const fs = require("fs");
const path = require("path");
const forEach = require("mocha-each");
const { validateHeaderName } = require("http");

const file2Upload = "./calculator-0.png";
const f2Ushort = "calculator-0.png";

//const screenshot = "motaDnD";

const testcases = [
  {
    id: "SFC001",
    name: "Enter valid color using sendKeys ",
    type: "color",
    data: {
      field: By.id("color-input"),
      eventField: By.id("color-input-event-value"),
      value: "#454545",
    },
    expected: {
      resultlocator: By.id("color-input-value-value"),
      value: "#454545",
    },
  },
  {
    id: "SFC002",
    name: "Enter invalid color using sendKeys",
    type: "color",
    data: {
      field: By.id("color-input"),
      eventField: By.id("color-input-event"),
      value: "#ABABAH",
    },
    expected: {
      resultlocator: By.id("color-input-value-value"),
      value: "#000000",
    },
  },
  {
    id: "SFC003",
    name: "Enter valid color using sendKeys and hex",
    type: "color",
    data: {
      field: By.id("color-input"),
      eventField: By.id("color-input-event"),
      value: "#AB00A0",
    },
    expected: {
      resultlocator: By.id("color-input-value-value"),
      value: "#ab00a0",
    },
  },
  {
    id: "SFC004",
    name: "Enter valid color using sendKeys and hex expect lowercase",
    type: "color",
    data: {
      field: By.id("color-input"),
      eventField: By.id("color-input-event"),
      value: "#AB00A0",
    },
    expected: {
      resultlocator: By.id("color-input-value-value"),
      value: "#ab00a0",
    },
  },
  {
    id: "SFC005",
    name: "Enter valid color using sendKeys and rgb",
    type: "color",
    data: {
      field: By.id("color-input"),
      eventField: By.id("color-input-event"),
      value: "rgb(40,16,201)",
    },
    expected: {
      resultlocator: By.id("color-input-value-value"),
      value: "#2810c9",
    },
  },
];

const tc_fileUpload = [
  {
    id: "SFC005",
    name: "Select file for Upload",
    type: "file upload",
    data: {
      field: By.id("file-input"),
      eventField: By.id("file-input-event-value"),
      value: "./calculator-0.png",
    },
    expected: {
      resultlocator: By.id("file-input-event-value-value"),
      value: "calculator-0.png",
    },
  },
];

//the test results do not make any sense
const tc_dateTime = [
  {
    id: "SFC006",
    name: "Enter local Date-Time using SendKeys",
    type: "date-selection",
    data: {
      field: By.id("datetime-local-input"),
      eventField: By.id("datetime-local-input-event-value"),
      value: "01.12.1999,01:35",
    },
    expected: {
      resultlocator: By.id("datetime-local-input-value-value"),
      value: "1999-04-11T01:35",
    },
  },
  {
    id: "SFC007",
    name: "Enter local Date-Time ISO format using SendKeys",
    type: "date-selection",
    data: {
      field: By.id("datetime-local-input"),
      eventField: By.id("datetime-local-input-event-value"),
      value: "1999-04-11T01:35",
    },
    expected: {
      resultlocator: By.id("datetime-local-input-value-value"),
      value: "1999-04-11T01:35",
    },
  },
  {
    id: "SFC008",
    name: "Enter Date tt.mm.jjjj using SendKeys",
    type: "date-selection",
    data: {
      field: By.id("date-input"),
      eventField: By.id("date-input-event-value"),
      value: "11.04.1999",
    },
    expected: {
      resultlocator: By.id("date-input-value-value"),
      value: "1999-04-11",
    },
  },
  {
    id: "SFC009",
    name: "Enter local Date-Time ISO format using SendKeys",
    type: "date-selection",
    data: {
      field: By.id("date-input"),
      eventField: By.id("date-input-event-value"),
      value: "1999-04-11",
    },
    expected: {
      resultlocator: By.id("date-input-value-value"),
      value: "1999-04-11",
    },
  },

  {
    id: "SFC010",
    name: "Enter Month Year using SendKeys",
    type: "date-selection",
    data: {
      field: By.id("month-input"),
      eventField: By.id("month-input-event-value"),
      value: toString(new Date(2025, 10)),
    },
    expected: {
      resultlocator: By.id("month-input-value-value"),
      value: "2025-10",
    },
  },
];

class Form {
  constructor(url) {
    this.driver = null;
    this.url = url;
  }
  // general functions
  async open() {
    this.driver = await new Builder().forBrowser("chrome").build();
    await this.driver.get(this.url);
  }

  async sleep(n) {
    await this.driver.sleep(n);
  }

  async close() {
    await this.driver.quit();
  }

  async takeScreenshot(fname) {
    let image = await this.driver.takeScreenshot();
    fs.writeFileSync(fname, image, "base64");
  }

  // makeLocator serves to handle situations where several types of locators are used.
  makeLocator(item) {
    //console.log(JSON.stringify(item));
    try {
      let locator;
      if (item.locatortype == "id") {
        locator = By.id(item.value);
      } else if (item.locatortype == "attribute") {
        let attribute = item.attribute;
        //console.log(attribute);
        locator = By.xpath(
          "//button[@" + attribute + "=" + "'" + item.value + "']"
        );
      }
      return locator;
    } catch (e) {
      console.log(`error ${e} in makeLocator`);
    }
  }

  // getters
  async getFormElements() {
    try {
      let inputlist = [];

      let inputs = await this.driver.findElements(
        By.css("#special-format-controls input")
      );
      //console.log(inputs.length);
      //console.log(await inputs[1].getAttribute("name"));

      for (let i of inputs) {
        let iID = await i.getAttribute("id");

        let name = await i.getAttribute("name");
        let value = await i.getAttribute("value");
        let hidden = await i.getAttribute("hidden");
        let type = await i.getAttribute("type");
        inputlist.push([iID, name, type, value, hidden]);
      }
      //console.log(inputlist);
      return inputlist;
    } catch (e) {
      console.log(`error ${e} in getFormElements`);
    }
  }

  async getButtonList() {
    let buttonlist = [];
    let buttons = await this.driver.findElements(By.css("main button"));
    for (let b of buttons) {
      let pseud = await b.getAttribute("data-test");
      buttonlist.push(pseud);
    }
    return buttonlist;
  }

  async getText(locator) {
    try {
      //console.log(locator);
      let result = await this.driver.findElement(locator).getText();
      return result;
    } catch (e) {
      console.log(`error ${e} in getText`);
    }
  }
  async getValue(locator) {
    try {
      let value = await this.driver.findElement(locator).getAttribute("value");

      return value;
    } catch (e) {
      console.log(`error ${e} in getValue`);
    }
  }

  async getClass(locator) {
    let bClass = await this.driver.findElement(locator).getAttribute("class");
    //console.log(bClass);
    return bClass;
  }

  async getTitle() {
    return await this.driver.getTitle();
  }

  // Data input functions

  async setInput(locator, input) {
    try {
      await this.scroll(locator);
      console.log(`locator: ${locator}, input: ${input}`);
      let n = await this.driver.findElement(locator);
      await n.clear();
      await n.sendKeys(input);
    } catch (e) {
      console.log(`error ${e} in setInput`);
    }
  }
  async scroll(locator) {
    //scroll to an element to ensure visibility
    console.log(JSON.stringify(locator));
    try {
      await this.driver.wait(until.elementLocated(locator), 10000);
      const element = await this.driver.findElement(locator);
      await this.driver.executeScript(
        "arguments[0].scrollIntoView({block:'center', inline:'nearest'});",
        element
      );
      await this.driver.sleep(500);
    } catch (e) {
      console.log(`error ${e} in scroll`);
    }
  }
  async click(locator) {
    //console.log(JSON.stringify(locator));
    try {
      await this.scroll(locator);
      let el = await this.driver.findElement(locator);
      console.log("found element");
      await el.click();
      await this.driver.sleep(500);
      console.log("slept after click");
    } catch (e) {
      console.log(`error ${e} in click`);
    }
  }

  async dbclick(locator) {
    try {
      const el = driver.findElement(locator);
      const actions = driver.actions({ async: true });
      await actions.doubleClick(el).perform();
    } catch (e) {
      console.log(`error ${e} in dbclick`);
    }
  }

  async focus(locator) {
    const el = await this.driver.findElement(locator);
    //hack but works
    await this.driver.executeScript("arguments[0].focus();", el);
  }

  async blur(locator) {
    try {
      const el = await this.driver.findElement(locator);
      //if focus works, does blur?
      await this.driver.executeScript("arguments[0].blur();", el);
    } catch (e) {
      console.log(`error ${e} in blur`);
    }
  }

  async mouseout(locator) {
    //didn't work
    try {
      const mouseTracker = driver.findElement(locator);
      const actions = driver.actions({ async: true });
      await actions.move({ x: 8, y: 10, origin: mouseTracker }).perform();
    } catch (e) {
      console.log(`error ${e} in mouseout`);
    }
  }
  async uploadFsSelect(locator, file2Upload) {
    try {
      let image = path.resolve(file2Upload);

      let btn = await this.driver.findElement(locator);
      const input = await this.driver.findElement(locator);
      await input.sendKeys(image);

      await this.driver.manage().setTimeouts({ implicit: 5000 });
    } catch (e) {
      console.log(`error ${e} in uploadFsSelect`);
    }
  }

  async keyDown(key) {
    await this.driver.actions().keyDown(key).perform();
  }
  async keyUp(key) {
    await this.driver.actions().keyDown(key).perform();
    await this.driver.actions().keyUp(key).perform();
  }

  async keyPress(key) {
    await this.driver.actions().sendKeys(key).perform();
  }

  async contextMenu(locator) {
    const el = await this.driver.findElement(locator);
    const actions = this.driver.actions({ async: true });
    await actions.contextClick(el).perform();
  }
}

describe("Testsuit", function () {
  //remove --no-timeouts
  this.timeout(0);
  const currForm = new Form(
    "https://testpages.eviltester.com/pages/input-elements/special-formats/"
  );

  before(async function () {
    await currForm.open();
  });

  beforeEach(async function () {
    // await currForm.open();
  });

  after(async function () {
    //await currForm.close()
  });

  afterEach(async function () {
    //await currForm.close();
  });

  it("Open Page and Assert title and input fields", async function () {
    //test should fail if additional fields are added or fields have been removed
    let title = await currForm.getTitle();
    assert.equal(
      title,
      "Special Format Input Elements - Events Display | Test Pages"
    );
    let inputlist = await currForm.getFormElements();
    let expected = [
      ["color-input", "color", "color", "#000000", null],
      ["file-input", "file", "file", "", null],
      ["datetime-local-input", "datetime-local", "datetime-local", "", null],
      ["date-input", "date", "date", "", null],
      ["month-input", "month", "month", "", null],
      ["week-input", "week", "week", "", null],
      ["time-input", "time", "time", "", null],
      ["date-input-min-max", "date", "date", "", null],
    ];

    assert.deepEqual(inputlist, expected);
  });

  it("Testing Special Form Controls with valid color input", async function () {
    let expected = "#ababab";

    let field = By.id("color-input");
    await currForm.click(field);
    let lastEvent = await currForm.getText(By.id("color-input-event-value"));
    assert.equal(lastEvent, "click");
    await currForm.setInput(field, expected);
    let actual = await currForm.getValue(field);
    await currForm.keyPress(Key.RETURN);
    await currForm.click(By.id("color-input-event-value"));

    assert.equal(actual, expected);
    lastEvent = await currForm.getText(By.id("color-input-event-value"));
    assert.equal(lastEvent, "mouseleave");
  });
  it("Testing Special Form Controls with invalid color input", async function () {
    let value = "#ababaH";

    let field = By.id("color-input");
    await currForm.click(field);

    let lastEvent = await currForm.getText(By.id("color-input-event-value"));

    assert.equal(lastEvent, "click");

    await currForm.setInput(field, value);
    let actual = await currForm.getValue(field);
    await currForm.keyPress(Key.RETURN);
    await currForm.click(By.id("color-input-event-value"));

    assert.equal(actual, "#000000");

    lastEvent = await currForm.getText(By.id("color-input-event-value"));
    assert.equal(lastEvent, "mouseleave");
  });

  testcases.forEach(({ id, name, type, data, expected }) => {
    it(`Testing Color Field with ${id}, ${name}, ${type} and ${data.value} expecting ${expected.value}`, async function () {
      let field = data.field;
      let event = data.eventField;

      await currForm.click(field);

      let lastEvent = await currForm.getText(event);
      lastEvent = await currForm.getText(By.id("color-input-event-value"));
      assert.equal(lastEvent, "click");

      await currForm.setInput(field, data.value);
      await currForm.keyPress(Key.RETURN);
      let actual = await currForm.getValue(field);
      //console.log(actual);
      await currForm.click(By.id("color-input-event-value"));
      let shown = await currForm.getText(expected.resultlocator);
      //console.log(`shown: ${shown}`);
      assert.equal(actual, expected.value);
      assert.equal(actual, shown);
    });
  });
  tc_fileUpload.forEach(({ id, name, type, data, expected }) => {
    it(`Testing Color Field with ${id}, ${name}, ${type} and ${data.value} expecting ${expected.value}`, async function () {
      let field = data.field;
      let event = data.eventField;

      // programmatic click on the button is rejected even though it is found
      // therefore directly doing uploadFsSelect
      await currForm.uploadFsSelect(field, data.value);
      await currForm.keyPress(Key.RETURN);
      let actual = await currForm.getValue(field);

      await currForm.click(By.id("file-input-event-value"));
      let shown = await currForm.getText(expected.resultlocator);

      assert.equal(actual, expected.value);
      assert.equal(actual, shown);
    });
  });
  tc_dateTime.forEach(({ id, name, type, data, expected }) => {
    it.only(`Testing Color Field with ${id}, ${name}, ${type} and ${data.value} expecting ${expected.value}`, async function () {
      let field = data.field;
      let event = data.eventField;

      //await currForm.click(field);
      //await currForm.sleep(1000);
      //let lastEvent = await currForm.getText(event);
      //assert.equal(lastEvent, "click");

      await currForm.setInput(field, data.value);
      await currForm.sleep(1000);
      await currForm.click(event);
      //await currForm.keyPress(Key.RETURN);
      let actual = await currForm.getValue(field);

      let shown = await currForm.getText(expected.resultlocator);

      assert.equal(actual, expected.value);
      assert.equal(actual, shown);
    });
  });
});
