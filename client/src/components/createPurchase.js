import ipfs from "../ipfs";
import hbl_contract from "../hbl_market";
import React, { Component, useState } from "react";
import Web3 from "web3";
import SafePurchase from "../SafePurchase";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import "../App.css";
import "bootstrap/dist/css/bootstrap.css";
class CreatePurchase extends Component {
  componentWillMount() {
    this.loadBlockchainData();
  }
  constructor(props) {
    super(props);
    this.state = {
      accounts: [],
      loading: true,
      selectedFile: null,
      ipfsHash: null,
      buffer: null,
      productId: "",
      productName: "",
      web3: "",
      contractAddress: "",
    };
    this.onFileChange = this.onFileChange.bind(this);
    this.onFileUpload = this.onFileUpload.bind(this);
    this.onProductId = this.onProductId.bind(this);
    this.onProductName = this.onProductName.bind(this);
  }
  async loadBlockchainData() {
    let web3;
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      try {
        window.ethereum.enable().then(function () {
          // User has allowed account access to DApp...
          web3 = new Web3(
            Web3.givenProvider ||
              "wss://ropsten.infura.io/ws/v3/43cda5da85674a7a88c5e531e2a09a76"
          );
        });
      } catch (e) {
        // User has denied account access to DApp...
      }
    }
    // Legacy DApp Browsers
    else if (window.web3) {
      web3 = new Web3(window.web3.currentProvider);
    }
    // Non-DApp Browsers
    else {
      alert("You have to install MetaMask !");
    }
    this.setState({ web3: web3 });
    let accounts = await web3.eth.getAccounts();
    this.setState({ accounts: accounts });
  }
  onFileChange = async (event) => {
    // Update the state
    // event.preventDefault();
    this.setState({ selectedFile: await event.target.files[0] });
    console.log(this.state.selectedFile);
  };
  onProductId = async (event) => {
    this.setState({ productId: event.target.value });
  };
  onProductName = async (event) => {
    this.setState({ productName: event.target.value });
  };
  onFileUpload = async (event) => {
    this.setState({ loading: false });
    const file_data = this.state.selectedFile;
    console.log(file_data);
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file_data);
    reader.onloadend = async () => {
      this.setState({ buffer: await Buffer(reader.result) });
      console.log("buffer:", this.state.buffer);
    };

    await ipfs.add(this.state.buffer, (err, ipfsHash) => {
      if (err) {
        console.log("Error::", err);
      } else {
        console.log(ipfsHash);
      }

      //setState by setting ipfsHash to ipfsHash[0].hash
      this.setState({ ipfsHash: ipfsHash[0].hash });
      console.log(this.state.ipfsHash);
      this.setState({ loading: false });
    });
  };

  onSubmit = async (event) => {
    event.preventDefault();
    const web3 = this.state.web3;
    // console.log(accounts);
    console.log(this.state.productId, this.state.productName);
    const bytes32Key = web3.utils.fromAscii(this.state.productId);
    console.log(bytes32Key);
    const wei = web3.utils.toWei("0.0004", "Ether");

    console.log(hbl_contract.methods);
    hbl_contract.methods
      .createPurchaseContract(
        bytes32Key,
        this.state.productName,
        this.state.ipfsHash
      )
      .send({
        from: this.state.accounts[0],
        value: wei,
      });
  };
  // getContract = async () => {
  //   let address = await hbl_contract.methods
  //     .getContractKeyAtIndex(1)
  //     .call({ from: this.state.accounts[0] });
  //   console.log(address);
  // };
  getContract = async () => {
    const bytes32Key = this.state.web3.utils.fromAscii(this.state.productId);

    let address = await hbl_contract.methods
      .widgets(bytes32Key)
      .call({ from: this.state.accounts[0] });
    this.setState({ contractAddress: address });
    console.log(address);
    // console.log(SafePurchase(address));
    // this.purchaseContract(address);
  };

  purchaseContract = async (address) => {
    const web3 = this.state.web3;
    let contract = await SafePurchase(address);
    let price = await contract.methods.price().call({
      from: this.state.accounts[0],
    });
    let price_ether = web3.utils.fromWei(price, "Ether");

    console.log(price_ether);
  };

  render() {
    return (
      <div className="App" className="container-fluid">
        <div>
          <h3 className="text-center"> Product Details </h3>
          <div className="row justify-content-center">
            <form onSubmit={this.onSubmit}>
              <div className="form-group row">
                <input
                  class="form-control"
                  type="text"
                  placeholder="Product ID"
                  id="product_id"
                  onChange={this.onProductId}
                />
              </div>
              <div className="form-group row">
                <input
                  class="form-control "
                  type="text"
                  placeholder="Product Name"
                  id="product_name"
                  onChange={this.onProductName}
                />
              </div>
              <div className="form-group row">
                <input
                  class="form-control"
                  type="text"
                  placeholder="IPFS_Hash"
                  id="ipfs_hash"
                  value={this.state.ipfsHash}
                  disabled
                />
              </div>

              <fieldset className="form-group">
                <div className="form-group row">
                  <input
                    class="form-control"
                    type="file"
                    placeholder="File"
                    name="file"
                    onChange={this.onFileChange}
                  />
                  <br></br>
                  <br></br>
                </div>
              </fieldset>
              {/* <div> {this.state.selectedFile ? this.fileData() : ""}</div> */}
              <div class="btn-group" role="group" aria-label="Basic example">
                <button
                  type="button"
                  class="btn btn-primary"
                  onClick={this.onFileUpload}
                >
                  Upload File
                </button>{" "}
                &nbsp;&nbsp;
                <button type="submit" class="btn btn-primary">
                  Create Purchase
                </button>
                &nbsp;&nbsp;
                {/* <button
                  type="button"
                  class="btn btn-warning"
                  onClick={this.onClick}
                >
                  Get Transaction Receipt
                </button> */}
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
export default CreatePurchase;
