const solc = require("solc");
const path = require("path");
const fs = require("fs");

const counterPath = path.resolve(__dirname, "contracts", "ERC20Token.sol");
const counterFileStream = fs.readFileSync(counterPath, "utf8");

module.exports = solc.compile(counterFileStream, 1).contracts[':ERC20Token'];
//npm install --save solc