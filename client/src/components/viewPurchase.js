import ipfs from "../ipfs";
import hbl_contract from "../hbl_market";
import React, { Component, useState } from "react";
import Web3 from "web3";
import SafePurchase from "../SafePurchase";
import { Document, Page, pdfjs } from "react-pdf";
// import Modal from "react-bootstrap/Modal";
import { Button, Modal } from "react-bootstrap";

import "../App.css";
import "bootstrap/dist/css/bootstrap.css";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

class CreatePurchase extends Component {
  componentWillMount() {
    this.loadBlockchainData();
  }
  constructor(props) {
    super(props);
    this.state = {
      accounts: [],
      loading: false,
      selectedFile: null,
      ipfsHash: null,
      buffer: null,
      productId: "",
      productName: "",
      web3: "",
      contractAddress: "",
      price: "",
      contractFound: false,
      title: "",
      state: "",
      showHide: false,
      ipfs: "",
      pageNumber: 1,
      numPages: null,
    };

    this.onProductId = this.onProductId.bind(this);
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

    this.setState({ web3: web3 });
    let accounts = await web3.eth.getAccounts();
    console.log(accounts);
    this.setState({ accounts: accounts });
  }
  handleModalShowHide(event) {
    // event.preventDefault();
    this.setState({ showHide: !this.state.showHide });
  }
  onDocumentLoad = ({ numPages }) => {
    this.setState({ numPages });
  };
  onProductId = async (event) => {
    this.setState({ productId: event.target.value });
  };
  onSubmit = async () => {
    this.setState({ loading: true });
    const bytes32Key = this.state.web3.utils.fromAscii(this.state.productId);
    console.log(this.state.contractFound);

    let address = await hbl_contract.methods
      .widgets(bytes32Key)
      .call({ from: this.state.accounts[0] });
    if (address != "") {
      this.setState({ contractAddress: address });
    }
    console.log(this.state.contractFound);
    // console.log(SafePurchase(address));
    await this.purchaseContractDetails(address);
    this.setState({ loading: false });
  };
  purchaseContractDetails = async (address) => {
    const web3 = this.state.web3;
    let contract = SafePurchase(address);
    let price = await contract.methods.price().call({
      from: this.state.accounts[0],
    });
    let price_ether = web3.utils.fromWei(price, "Ether");
    this.setState({});
    let seller = await contract.methods.seller().call({
      from: this.state.accounts[0],
    });
    let buyer = await contract.methods.buyer().call({
      from: this.state.accounts[0],
    });
    let title = await contract.methods.title().call({
      from: this.state.accounts[0],
    });
    this.setState({});
    let ipfsHash = await contract.methods.ipfsHash().call({
      from: this.state.accounts[0],
    });
    let state = await contract.methods.state().call({
      from: this.state.accounts[0],
    });
    if (state == "0") {
      state = "Created";
    } else if (state == "1") {
      state = "Locked";
    } else {
      state = "Inactive";
    }
    this.setState({
      price: price_ether,
      ipfsHash: ipfsHash,
      title: title,
      contractFound: true,
      state: state,
    });

    console.log(seller);
    console.log("buyer", buyer);
  };
  onActive = async (event) => {
    this.state.loading = true;
    event.preventDefault();
    const { web3 } = this.state;
    let contract = SafePurchase(this.state.contractAddress);
    const wei = web3.utils.toWei("0.0004", "Ether");

    let locked = await contract.methods.buyerConfirmPurchase().send({
      from: this.state.accounts[0],
      value: wei,
    });
    console.log(locked);
    this.state.loading = false;
  };
  onBuyerConfirmReceived = async (event) => {
    this.state.loading = true;
    event.preventDefault();
    const { web3 } = this.state;
    let contract = SafePurchase(this.state.contractAddress);
    let confirm_received = await contract.methods.buyerConfirmReceived().send({
      from: this.state.accounts[0],
    });
    console.log(confirm_received);
    this.state.loading = false;
  };
  render() {
    const isContractFound = this.state.contractFound;
    const { pageNumber, numPages } = this.state;
    {
      console.log(`https://ipfs.io/ipfs/${this.state.ipfsHash}`);
    }

    return (
      <div className="App" className="container-fluid">
        <div>
          <h4 className="text-center"> Enter Product ID </h4>
          <div className="row justify-content-center">
            <form>
              <div className="form-group row">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Product ID"
                  id="product_id"
                  onChange={this.onProductId}
                />
              </div>
              &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;
              &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.onSubmit}
              >
                {this.state.loading && (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}
                Request Contract
              </button>
            </form>
          </div>
          {isContractFound ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Price</th>
                  <th>title</th>
                  <th>IPFS Hash</th>
                  <th>State</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{this.state.productId}</td>
                  <td>{this.state.price} ETH</td>
                  <td>{this.state.title}</td>
                  <td>
                    <a
                      href="javascript:void(0)"
                      onClick={() => this.handleModalShowHide()}
                    >
                      {this.state.ipfsHash}
                    </a>
                  </td>
                  <td>{this.state.state}</td>
                  <td>
                    {(this.state.state == "Locked" && (
                      <button
                        className="btn btn-success"
                        type="button"
                        onClick={this.onBuyerConfirmReceived}
                      >
                        Confirm Received
                      </button>
                    )) ||
                      (this.state.state == "Create" && (
                        <button
                          className="btn btn-primary"
                          type="button"
                          onClick={this.onActive}
                        >
                          {this.state.loading && (
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>
                          )}
                          Activate
                        </button>
                      ))}
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <p>Contract not Found</p>
          )}
        </div>
        <Modal
          aria-labelledby="contained-modal-title-vcenter"
          centered
          size="lg"
          show={this.state.showHide}
        >
          <Modal.Header closeButton onClick={() => this.handleModalShowHide()}>
            <Modal.Title>Widget Document</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div class=" btn-group" role="group" aria-label="Basic example">
              <button
                className="btn btn-default"
                onClick={() =>
                  this.setState((prevState) => ({
                    pageNumber: prevState.pageNumber - 1,
                  }))
                }
              >
                <i class="fa fa-arrow-left"></i>
              </button>
              <button
                className="btn btn-default"
                style={{ marginLeft: 710 }}
                onClick={() =>
                  this.setState((prevState) => ({
                    pageNumber: prevState.pageNumber + 1,
                  }))
                }
              >
                <i class="fa fa-arrow-right"></i>
              </button>
            </div>
            <Document
              file={`https://ipfs.io/ipfs/${this.state.ipfsHash}`}
              onLoadSuccess={this.onDocumentLoad}
            >
              <div style={{ color: "white", textAlign: "center" }}>
                <p>
                  <Page pageNumber={pageNumber} /> page {pageNumber} of{" "}
                  {numPages}
                </p>
              </div>
            </Document>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}
export default CreatePurchase;
