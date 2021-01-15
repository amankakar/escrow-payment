// import React, { Component } from "react";
// import Web3 from "web3";
// import "./App.css";
// // import { TODO_LIST_ABI, TODO_LIST_ADDRESS } from "./config";
// // import TodoList from "./TodoList";

// className App extends Component {
//   componentWillMount() {
//     this.loadBlockchainData();
//   }

//   async loadBlockchainData() {
//     let web3;
//     // web3 = new Web3(
//     //   new Web3.providers.HttpProvider(
//     //     "https://ropsten.infura.io/v3/43cda5da85674a7a88c5e531e2a09a76"
//     //   )
//     // );
//     if (window.ethereum) {
//       web3 = new Web3(window.ethereum);
//       try {
//         window.ethereum.enable().then(function () {
//           // User has allowed account access to DApp...
//         });
//       } catch (e) {
//         // User has denied account access to DApp...
//       }
//     }
//     // Legacy DApp Browsers
//     else if (window.web3) {
//       web3 = new Web3(window.web3.currentProvider);
//     }
//     // Non-DApp Browsers
//     else {
//       alert("You have to install MetaMask !");
//     }
//     // const web3 = new Web3(Web3.givenProvider);
//     // console.log(accounts1);
//     // if (Web3.ethEnabled()) {
//     //   console.log("here");
//     // }
//     console.log(web3);
//     const accounts = await web3.eth.getAccounts();
//     console.log("accounts", accounts);
//     this.setState({ account: accounts[0] });
//     // const todoList = new web3.eth.Contract(TODO_LIST_ABI, TODO_LIST_ADDRESS);
//     // this.setState({ todoList });
//     // const taskCount = await todoList.methods.taskCount().call();
//     // this.setState({ taskCount });
//     // for (var i = 1; i <= taskCount; i++) {
//     //   const task = await todoList.methods.tasks(i).call();
//     //   this.setState({
//     //     tasks: [...this.state.tasks, task],
//     //   });
//     // }
//     // this.setState({ loading: false });
//   }

//   constructor(props) {
//     super(props);
//     this.state = {
//       account: "",
//       taskCount: 0,
//       tasks: [],
//       loading: true,
//     };

//     // this.createTask = this.createTask.bind(this);
//     // this.toggleCompleted = this.toggleCompleted.bind(this);
//   }

//   // createTask(content) {
//   //   this.setState({ loading: true });
//   //   this.state.todoList.methods
//   //     .createTask(content)
//   //     .send({ from: this.state.account })
//   //     .once("receipt", (receipt) => {
//   //       this.setState({ loading: false });
//   //     });
//   // }

//   toggleCompleted(taskId) {
//     this.setState({ loading: true });
//     this.state.todoList.methods
//       .toggleCompleted(taskId)
//       .send({ from: this.state.account })
//       .once("receipt", (receipt) => {
//         this.setState({ loading: false });
//       });
//   }

//   render() {
//     return (
//       <div>
//         <nav classNameName="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
//           <a
//             classNameName="navbar-brand col-sm-3 col-md-2 mr-0"
//             href="http://www.dappuniversity.com/free-download"
//             // target="_blank"
//           >
//             Dapp University | Todo List
//           </a>
//           <ul classNameName="navbar-nav px-3">
//             <li classNameName="nav-item text-nowrap d-none d-sm-none d-sm-block">
//               <small>
//                 {/* <a classNameName="nav-link" href="#">
//                   <span id="account"></span>
//                 </a> */}
//               </small>
//             </li>
//           </ul>
//         </nav>
//         <div classNameName="container-fluid">
//           <div classNameName="row">
//             <main
//               role="main"
//               className="col-lg-12 d-flex justify-content-center"
//             >
//               {this.state.loading ? (
//                 <div id="loader" className="text-center">
//                   <p className="text-center">Loading...</p>
//                 </div>
//               ) : (
//                 <p>{this.state.account}</p>
//                 // <TodoList
//                 //   tasks={this.state.tasks}
//                 //   createTask={this.createTask}
//                 //   toggleCompleted={this.toggleCompleted}
//                 // />
//               )}
//             </main>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// export default App;
import ipfs from "./ipfs";
import hbl_contract from "./hbl_market";
import React, { Component, useState } from "react";
import { Route, Link, BrowserRouter, Switch } from "react-router-dom";
import Home from "./components/createPurchase";
import CreatePurchase from "./components/createPurchase";
import ViewPurchase from "./components/viewPurchase";
import Navbar from "./components/Navbar";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
const infuraProjectId = "43cda5da85674a7a88c5e531e2a09a76";
class App extends Component {
  // componentWillMount() {
  //   this.loadBlockchainData();
  // }
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     accounts: [],
  //     loading: true,
  //     selectedFile: null,
  //     ipfsHash: null,
  //     buffer: null,
  //     productId: "",
  //     productName: "",
  //     web3: "",
  //     contractAddress: "",
  //   };
  //   this.onFileChange = this.onFileChange.bind(this);
  //   this.onFileUpload = this.onFileUpload.bind(this);
  //   this.onProductId = this.onProductId.bind(this);
  //   this.onProductName = this.onProductName.bind(this);
  // }
  // async loadBlockchainData() {
  //   let web3;
  //   if (window.ethereum) {
  //     web3 = new Web3(window.ethereum);
  //     try {
  //       window.ethereum.enable().then(function () {
  //         // User has allowed account access to DApp...
  //         web3 = new Web3(
  //           Web3.givenProvider ||
  //             "wss://ropsten.infura.io/ws/v3/43cda5da85674a7a88c5e531e2a09a76"
  //         );
  //       });
  //     } catch (e) {
  //       // User has denied account access to DApp...
  //     }
  //   }
  //   // Legacy DApp Browsers
  //   else if (window.web3) {
  //     web3 = new Web3(window.web3.currentProvider);
  //   }
  //   // Non-DApp Browsers
  //   else {
  //     alert("You have to install MetaMask !");
  //   }
  //   this.setState({ web3: web3 });
  //   let accounts = await web3.eth.getAccounts();
  //   this.setState({ accounts: accounts });
  // }
  // onFileChange = async (event) => {
  //   // Update the state
  //   // event.preventDefault();
  //   this.setState({ selectedFile: await event.target.files[0] });
  //   console.log(this.state.selectedFile);
  // };
  // onProductId = async (event) => {
  //   this.setState({ productId: event.target.value });
  // };
  // onProductName = async (event) => {
  //   this.setState({ productName: event.target.value });
  // };
  // onFileUpload = async (event) => {
  //   this.setState({ loading: false });
  //   const file_data = this.state.selectedFile;
  //   console.log(file_data);
  //   const reader = new window.FileReader();
  //   reader.readAsArrayBuffer(file_data);
  //   reader.onloadend = async () => {
  //     this.setState({ buffer: await Buffer(reader.result) });
  //     console.log("buffer:", this.state.buffer);
  //   };

  //   await ipfs.add(this.state.buffer, (err, ipfsHash) => {
  //     if (err) {
  //       console.log("Error::", err);
  //     } else {
  //       console.log(ipfsHash);
  //     }

  //     //setState by setting ipfsHash to ipfsHash[0].hash
  //     this.setState({ ipfsHash: ipfsHash[0].hash });
  //     console.log(this.state.ipfsHash);
  //     this.setState({ loading: false });
  //   });
  // };

  // onSubmit = async (event) => {
  //   event.preventDefault();
  //   const web3 = this.state.web3;
  //   // console.log(accounts);
  //   console.log(this.state.productId, this.state.productName);
  //   const bytes32Key = web3.utils.fromAscii(this.state.productId);
  //   console.log(bytes32Key);
  //   const wei = web3.utils.toWei("0.0004", "Ether");

  //   console.log(hbl_contract.methods);
  //   hbl_contract.methods
  //     .createPurchaseContract(
  //       bytes32Key,
  //       this.state.productName,
  //       this.state.ipfsHash
  //     )
  //     .send({
  //       from: this.state.accounts[0],
  //       value: wei,
  //     });
  // };
  // // getContract = async () => {
  // //   let address = await hbl_contract.methods
  // //     .getContractKeyAtIndex(1)
  // //     .call({ from: this.state.accounts[0] });
  // //   console.log(address);
  // // };
  // getContract = async () => {
  //   const bytes32Key = this.state.web3.utils.fromAscii(this.state.productId);

  //   let address = await hbl_contract.methods
  //     .widgets(bytes32Key)
  //     .call({ from: this.state.accounts[0] });
  //   this.setState({ contractAddress: address });
  //   console.log(address);
  //   // console.log(SafePurchase(address));
  //   // this.purchaseContract(address);
  // };

  // purchaseContract = async (address) => {
  //   const web3 = this.state.web3;
  //   let contract = await SafePurchase(address);
  //   let price = await contract.methods.price().call({
  //     from: this.state.accounts[0],
  //   });
  //   let price_ether = web3.utils.fromWei(price, "Ether");

  //   console.log(price_ether);
  // };

  render() {
    return (
      <>
        <BrowserRouter>
          <Navbar />
          <div className="container mt-2" style={{ marginTop: 40 }}>
            <Switch>
              <Route path="/createpurchase">
                <CreatePurchase />
              </Route>
              <Route path="/ViewPurchase">
                <ViewPurchase />
              </Route>
            </Switch>
          </div>
        </BrowserRouter>
      </>
    );
  }
}
export default App;
