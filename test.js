var testT = require("./test2.js");
var testF = require("./test1.js");
testT.increment();
console.log("test里为"+testT.get());
testF.increment();
console.log("test1里为"+testF.get());