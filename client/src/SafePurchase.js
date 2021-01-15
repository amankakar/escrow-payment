import Web3 from "web3";
//access our local copy to contract deployed on rinkeby testnet
//use your own contract address
export default function safepurchase(address) {
  let web3 = new Web3(
    Web3.givenProvider ||
      "wss://ropsten.infura.io/ws/v3/43cda5da85674a7a88c5e531e2a09a76"
  );

  const abi = [
    {
      constant: true,
      inputs: [],
      name: "seller",
      outputs: [{ internalType: "address payable", name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "key",
      outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "title",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "buyer",
      outputs: [{ internalType: "address payable", name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "price",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "state",
      outputs: [
        {
          internalType: "enum SafeRemotePurchase.State",
          name: "",
          type: "uint8",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "ipfsHash",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address payable",
          name: "_contractSeller",
          type: "address",
        },
        { internalType: "bytes32", name: "_key", type: "bytes32" },
        { internalType: "string", name: "_title", type: "string" },
        { internalType: "string", name: "_ipfxHash", type: "string" },
      ],
      payable: true,
      stateMutability: "payable",
      type: "constructor",
    },
    { anonymous: false, inputs: [], name: "Aborted", type: "event" },
    { anonymous: false, inputs: [], name: "PurchaseConfirmed", type: "event" },
    { anonymous: false, inputs: [], name: "ItemReceived", type: "event" },
    {
      constant: false,
      inputs: [],
      name: "buyerConfirmPurchase",
      outputs: [],
      payable: true,
      stateMutability: "payable",
      type: "function",
    },
    {
      constant: false,
      inputs: [],
      name: "buyerConfirmReceived",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [],
      name: "abortBySeller",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "balanceOf",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
  ];
  return new web3.eth.Contract(abi, address);
}
// export default abi;
