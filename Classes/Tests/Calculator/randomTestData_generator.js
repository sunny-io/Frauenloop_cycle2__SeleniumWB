class Generator {
  constructor() {
    this.testcases = [];
    this.tcDefinitions = [
      {
        name: "test2",
        description: "add positive integers",
        min: 0,
        max: 100,
        type: "++",
        sort: "ASC",
        operator: "plus",
      },
      {
        name: "test3",
        description: "add positive and negative integers",
        min: 0,
        max: 100,
        type: "+-",
        sort: "ASC",
        operator: "plus",
      },
      {
        name: "test3a",
        description: "add negative and positive integers",
        min: 0,
        max: 100,
        type: "+-",
        sort: "DSC",
        operator: "plus",
      },
      {
        name: "test4",
        description: "add negative integers",
        min: 0,
        max: 100,
        type: "--",
        sort: "ASC",
        operator: "plus",
      },
      {
        name: "test5",
        description: "multiply positive integers",
        min: 0,
        max: 100,
        type: "++",
        sort: "ASC",
        operator: "times",
      },
      {
        name: "test6",
        description: "multiply a positive integer with a negative",
        min: 0,
        max: 100,
        type: "+-",
        sort: "ASC",
        operator: "times",
      },
      {
        name: "test6a",
        description: "multiply a negative integer with a positive",
        min: 0,
        max: 100,
        type: "+-",
        sort: "DSC",
        operator: "times",
      },
      {
        name: "test7",
        description: "multiply two negative integers",
        min: 0,
        max: 100,
        type: "--",
        sort: "ASC",
        operator: "times",
      },
      {
        name: "test8",
        description: "multiply zero with positive integer ",
        min: 0,
        max: 100,
        type: "zero",
        sort: "zero",
        operator: "times",
      },
      {
        name: "test9",
        description: "divide positive integers, smalles first",
        min: 0,
        max: 100,
        type: "++",
        sort: "ASC",
        operator: "divide",
      },
      {
        name: "test10",
        description: "divide positive integers, largest first",
        min: 0,
        max: 100,
        type: "++",
        sort: "DSC",
        operator: "divide",
      },
      {
        name: "test11",
        description: "divide positive integer by negative integer",
        min: 0,
        max: 100,
        type: "+-",
        sort: "ASC",
        operator: "divide",
      },
      {
        name: "test12",
        description: "divide negative integer by positive integer",
        min: 0,
        max: 100,
        type: "+-",
        sort: "DSC",
        operator: "divide",
      },
      {
        name: "test13",
        description: "divide negative integers, smallest first",
        min: 0,
        max: 100,
        type: "--",
        sort: "ASC",
        operator: "divide",
      },
      {
        name: "test14",
        description: "divide negative integers, largest first",
        min: 0,
        max: 100,
        type: "--",
        sort: "DSC",
        operator: "divide",
      },
      {
        name: "test15",
        description: "divide by zero",
        min: 0,
        max: 100,
        type: "zero",
        sort: "zero",
        operator: "divide",
      },
      {
        name: "test16",
        description: "substract positive integers, largest first",
        min: 0,
        max: 100,
        type: "++",
        sort: "DSC",
        operator: "minus",
      },
      {
        name: "test17",
        description: "substract positive integers, smallest first",
        min: 0,
        max: 100,
        type: "++",
        sort: "ASC",
        operator: "minus",
      },
      {
        name: "test18",
        description: "substract negative integers, largest first",
        min: 0,
        max: 100,
        type: "--",
        sort: "DSC",
        operator: "minus",
      },
      {
        name: "test19",
        description: "substract negative integers, smallest first",
        min: 0,
        max: 100,
        type: "--",
        sort: "ASC",
        operator: "minus",
      },
      {
        name: "test22",
        description: "substract large positive integers, smallest first",
        min: 100000,
        max: 1000000,
        type: "++",
        sort: "ASC",
        operator: "minus",
      },
      {
        name: "test22A",
        description: "add large positive integers, smallest first",
        min: 100000,
        max: 1000000,
        type: "++",
        sort: "ASC",
        operator: "plus",
      },
      {
        name: "test22B",
        description: "divide large positive integers, smallest first",
        min: 100000,
        max: 1000000,
        type: "++",
        sort: "ASC",
        operator: "divide",
      },
      {
        name: "test22C",
        description: "multiply large positive integers, smallest first",
        min: 100000,
        max: 1000000,
        type: "++",
        sort: "ASC",
        operator: "times",
      },
      {
        name: "test22D",
        description: "multiply very large positive integers, smallest first",
        min: 1000000000,
        max: 100000000000,
        type: "++",
        sort: "ASC",
        operator: "times",
      },
      {
        name: "test22E",
        description: "multiply very large positive integers, smallest first",
        min: 10000000000,
        max: 1000000000000,
        type: "++",
        sort: "ASC",
        operator: "times",
      },
    ];
  }
  _getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  generateTestData(testcase) {
    try {
      let testData = {
        name: testcase.name,
        description: testcase.description,
        operator: testcase.operator,
      };
      //console.log(JSON.stringify(testData));
      testData.operator = testcase.operator;
      let rawnumber = [];
      for (let i = 0; i < 2; i++) {
        rawnumber[i] = this._getRandomInt(testcase.min, testcase.max);
        //console.log(rawnumber);
      }
      switch (testcase.type) {
        case "++":
          break;

        case "+-":
          rawnumber[1] = -rawnumber[1];
          break;
        case "--":
          rawnumber[0] = -rawnumber[0];
          rawnumber[1] = -rawnumber[1];
          break;
        case "zero":
          rawnumber[1] = 0;
          break;
        default:
          console.log("Unknown type.");
          break;
      }

      switch (true) {
        case testcase.sort === "zero":
          testData.field1 = rawnumber[0];
          testData.field2 = rawnumber[1];
          break;
        case testcase.sort === "ASC" && rawnumber[0] <= rawnumber[1]:
          testData.field1 = rawnumber[0];
          testData.field2 = rawnumber[1];
          break;
        case testcase.sort === "DSC" && rawnumber[0] <= rawnumber[1]:
          testData.field1 = rawnumber[1];
          testData.field2 = rawnumber[0];
          break;
        case testcase.sort === "ASC" && rawnumber[0] > rawnumber[1]:
          testData.field1 = rawnumber[1];
          testData.field2 = rawnumber[0];
          break;
        case testcase.sort === "DSC" && rawnumber[0] > rawnumber[1]:
          testData.field1 = rawnumber[0];
          testData.field2 = rawnumber[1];
          break;
      }

      switch (testcase.operator) {
        case "plus":
          testData.expected = testData.field1 + testData.field2;
          break;
        case "minus":
          testData.expected = testData.field1 - testData.field2;
          break;
        case "times":
          testData.expected = testData.field1 * testData.field2;
          break;
        case "divide":
          if (testData.field2 == 0) {
            testData.expected = "Error: Division by zero";
          } else {
            testData.expected = testData.field1 / testData.field2;
          }
      }
      this.testcases.push(testData);

      return true;
    } catch (e) {
      console.log(`error ${e} in random test case generator`);
    }
  }
  generateTestSet() {
    for (let tc of this.tcDefinitions) {
      this.generateTestData(tc);
    }
    return this.testcases;
  }
}

//const generator = new Generator();
//const testcases = generator.generateTestSet();
//console.log(JSON.stringify(testcases));

export { Generator };
