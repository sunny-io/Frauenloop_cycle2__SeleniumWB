const testSetEqui = [
  {
    input: [4, 4, 4],
    output: "Equilateral",
  },
  {
    input: [7, 7, 7],
    output: "Equilateral",
  },
  {
    input: [15, 15, 15],
    output: "Equilateral",
  },
  {
    input: [49, 49, 49],
    output: "Equilateral",
  },
];

const testDataNan = [
  { input: [1, 1, ""], output: "Error: Side 3 is missing" },
  { input: [4, -4, 4], output: "Error: Not a Triangle" },
  { input: ["a", 2, 3], output: "Error: Side 1 is not a Number" },
  { input: [2, "b", 4], output: "Error: Side 2 is not a Number" },
  { input: [3, 4, "%"], output: "Error: Side 3 is not a Number" },
];

const testDataVeryLarge = [
  { input: [1234567890, 1234567890, 1234567890], output: "Equilateral" },
  { input: [1234567890, 1234567890, 123456], output: "Isosceles" },
];

const testSetScalene = [
  {
    input: [5, 6, 7],
    output: "Scalene",
  },
  {
    input: [8, 10, 13],
    output: "Scalene",
  },
  {
    input: [7, 9, 11],
    output: "Scalene",
  },
  {
    input: [4, 6, 9],
    output: "Scalene",
  },
  {
    input: [3, 5, 7],
    output: "Scalene",
  },
];

const testSetIso = [
  {
    input: [5, 5, 6],
    output: "Isosceles",
  },
  {
    input: [10, 10, 8],
    output: "Isosceles",
  },
  {
    input: [7, 7, 5],
    output: "Isosceles",
  },
  {
    input: [12, 12, 10],
    output: "Isosceles",
  },
  {
    input: [9, 9, 4],
    output: "Isosceles",
  },
];

const testSetNaT = [
  {
    input: [4, 4, 8],
    output: "Error: Not a Triangle",
  },
  {
    input: [6, 8, 15],
    output: "Error: Not a Triangle",
  },
  {
    input: [1, 2, 3],
    output: "Error: Not a Triangle",
  },
  {
    input: [3, 4, 7],
    output: "Error: Not a Triangle",
  },
  {
    input: [9, 14, 25],
    output: "Error: Not a Triangle",
  },
];

export {
  testDataNan,
  testDataVeryLarge,
  testSetEqui,
  testSetIso,
  testSetNaT,
  testSetScalene,
};
