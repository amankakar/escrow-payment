import Web3 from "web3";
//access our local copy to contract deployed on rinkeby testnet
//use your own contract address

const address = "0xe1b1487b61E39d0A2bAC4CE74b2A18AA4EA2B72E"; //"0x249Ea4c4cbF74E51309bF15c9b4fF120cf550d6B"; //"0xe1b1487b61E39d0A2bAC4CE74b2A18AA4EA2B72E"
let web3 = new Web3(
  Web3.givenProvider ||
    "wss://ropsten.infura.io/ws/v3/43cda5da85674a7a88c5e531e2a09a76"
);
// var parsed = JSON.parse(fs.readFileSync(HBL_MARKET));
var abi = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "lastContractAddress",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    name: "widgets",
    outputs: [
      { internalType: "address", name: "contractAddress", type: "address" },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "contractAddress",
        type: "address",
      },
    ],
    name: "logNewPurchaseContract",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "key",
        type: "bytes32",
      },
    ],
    name: "logRemovePurchaseContract",
    type: "event",
  },
  {
    constant: false,
    inputs: [
      { internalType: "bytes32", name: "key", type: "bytes32" },
      { internalType: "string", name: "title", type: "string" },
      { internalType: "string", name: "ipfsHash", type: "string" },
    ],
    name: "createPurchaseContract",
    outputs: [{ internalType: "bool", name: "createResult", type: "bool" }],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getContractCount",
    outputs: [
      { internalType: "uint256", name: "contractCount", type: "uint256" },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ internalType: "uint256", name: "index", type: "uint256" }],
    name: "getContractKeyAtIndex",
    outputs: [{ internalType: "bytes32", name: "key", type: "bytes32" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ internalType: "bytes32", name: "key", type: "bytes32" }],
    name: "getContractByKey",
    outputs: [
      { internalType: "address", name: "contractAddress", type: "address" },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ internalType: "bytes32", name: "key", type: "bytes32" }],
    name: "removeContractByKey",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];
//use the ABI from your contract
// console.log(abi);
export default new web3.eth.Contract(abi, address);
