const chai = require("chai");

//using expect style
const expect = chai.expect;

// expected example for failed test
let a = 1,
  b = 1;
//console.log(a, b);

/* try {
  expect(a).to.be.equals(b, "a and b are not equal");
} catch (e) {
  console.log(e.message);
} // e.message gives me only the error message, not the whole stacktrace like e - don't really understand why yet.
 */
// working with objects
function myObj() {
  return {
    a: 100,
    b: "Hello",
  };
}

(x = new myObj()), (y = new myObj());

// each try/catch blocks catches only the first error
try {
  expect(x).to.be.equals(
    y,
    "simple equals on objects fails with:  x and y are not equal"
  );
} catch (e) {
  console.log(e.message);
}

/* try {
 
  expect(x).to.be.deep.equals(
    y,
    "deep equals on an objects fails only if object content is different"
  );
} catch (e) {
  console.log(e.message);
}
 */

//chaining expects

try {
  expect(x)
    .to.be.an("object", "x is not an object")
    .and.to.be.deep.equals(y, " x and y are not deep.equals");
} catch (e) {
  console.log(e.message);
}

//x = 101;

try {
  expect(x)
    .to.be.an("object", "x is not an object")
    .and.to.be.deep.equals(y, " x and y are not deep.equals");
} catch (e) {
  console.log(e.message);
}

//working with arrays
let numbers = [1, 2, 3, 0];
//numbers = 4;
try {
  expect(numbers)
    .to.be.an("array", "numbers is no array")
    .that.includes(3, "no 3 in array");
} catch (e) {
  console.log(e.message);
}

// should style
const should = chai.should();

a.should.be.equals(b);
try {
  x.should.be.equals(y, "x and y are not equals"); // should throw error bc they are objects
} catch (e) {
  console.log(e.message);
}

try {
  x.should.be.deep.equals(y, "x and y are not deep.equals"); // should not throw error yet
} catch (e) {
  console.log(e.message);
}

try {
  x.a = 101; //temporarily change content of x
  x.should.be.deep.equals(y, "x and y are not deep.equals"); // should throw error
} catch (e) {
  console.log(e.message);
  x.a = 100; //reset x
}

// chained should

try {
  x.should.be.an("object").and.to.be.deep.equals(y); // should not throw error
} catch (e) {
  console.log(e.message);
}

try {
  numbers.should.be.an("array").that.includes(3); // no error
} catch (e) {
  console.log(e.message);
}

try {
  numbers.should.be.an("array").that.includes(4); //  error
} catch (e) {
  console.log(e.message);
}

// assert style - no chaining possible
const assert = chai.assert;

try {
  assert.equal(a, b, "a and b are not equal"); // no error
} catch (e) {
  console.log(e.message);
}
a = 2;
try {
  assert.equal(a, b, "a and b are not equal"); //  error
} catch (e) {
  console.log(e.message);
}

try {
  assert.deepEqual(x, y, "x and y are not equal"); // no error
} catch (e) {
  console.log(e.message);
}

try {
  x.a = 101;
  assert.deepEqual(x, y, "x and y are not equal"); //  error
} catch (e) {
  console.log(e.message);
  x.a = 100;
}

try {
  assert.isArray(numbers, "numbers is not an array"); // no error
} catch (e) {
  console.log(e.message);
}

try {
  numbers = 4;
  assert.isArray(numbers, "numbers is not an array"); //  error
} catch (e) {
  console.log(e.message);
  numbers = [1, 2, 3, 0];
}
