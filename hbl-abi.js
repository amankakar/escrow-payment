const Web3 = require("web3");
//access our local copy to contract deployed on rinkeby testnet
//use your own contract address
// const HBL_MARKET = require("./build/contracts/hblMarket.json");
const Purchase = require("./build/contracts/hblMarket.json");

const fs = require("fs");

// const address = "0x249Ea4c4cbF74E51309bF15c9b4fF120cf550d6B";
// let web3 = new Web3(
//   Web3.givenProvider ||
//     "wss://ropsten.infura.io/ws/v3/43cda5da85674a7a88c5e531e2a09a76"
// );
// console.log(HBL_MARKET);
var parsed = JSON.parse(fs.readFileSync("./build/contracts/hblMarket.json"));
var abi = parsed.abi;
//use the ABI from your contract
console.log(abi);
fs.writeFile("mynewfile3.json", JSON.stringify(abi), function (err) {
  if (err) throw err;
  console.log("Saved!");
});
// fs.writeFile()
// export default new web3.eth.Contract(abi, address);
