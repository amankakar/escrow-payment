const hblMarket = artifacts.require("../contracts/hblMarket");
const SafeRemotePurchase = artifacts.require(
  "../build/contracts/SafeRemotePurchase"
);
var BN = web3.utils.BN;

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised).should();

contract("hblMarket", (accounts) => {
  let [deployer, seller, buyer] = accounts;
  let contractInstance;

  before(async () => {
    // To get an instance of a deployed contract in truffle
    contractInstance = await hblMarket.deployed();

    // specify three test accounts
    console.log(`deployer account: ${deployer}`);
    console.log(`seller account: ${seller}`);
    console.log(`buyer account: ${buyer}`);
  });

  describe("deployment", async () => {
    it("deploys successfully", async () => {
      const address = await contractInstance.address;
      console.log(`contract address: ${address}`);

      //make sure the address is real
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it("has a name", async () => {
      const name = await contractInstance.name();
      assert.equal(name, "hblMarket Smart Contract");
    });
  });
  describe("products", async () => {
    let transaction, productCount;

    before(async () => {
      const bytes32Key = web3.utils.fromAscii("sportBikeModelX01");
      const wei = web3.utils.toWei("1.4", "Ether");
      transaction = await contractInstance.createPurchaseContract(
        bytes32Key,
        "Sport bike",
        "ipfsHash001",
        {
          from: seller,
          value: wei,
        }
      );

      productCount = await contractInstance.getContractCount();
    });

    it("creates products", async () => {
      assert.equal(productCount, 1);

      // check for event fired
      const event = transaction.logs[0];
      assert.equal(event.event, "logNewPurchaseContract", "event is correct");

      const eventData = transaction.logs[0].args;
      console.log("product address", eventData.contractAddress);

      // Product must have a key
      let wei = web3.utils.toWei("1.4", "Ether");
      let bytes32Key = web3.utils.fromAscii("");
      await contractInstance.createPurchaseContract(
        bytes32Key,
        "Big Hummer",
        "ipfsHash001",
        {
          from: seller,
          value: wei,
        }
      ).should.be.rejected;

      // Product must have a title
      bytes32Key = web3.utils.fromAscii("bigHummerModel01");
      await contractInstance.createPurchaseContract(
        bytes32Key,
        "",
        "ipfsHash001",
        {
          from: seller,
          value: wei,
        }
      ).should.be.rejected;

      // Product must have a price
      await contractInstance.createPurchaseContract(
        bytes32Key,
        "Big Hummer",
        "ipfsHash001",
        {
          from: seller,
          value: 0,
        }
      ).should.be.rejected;

      // Product must have a unique key
      bytes32Key = web3.utils.fromAscii("sportBikeModelX01"); // we already have one with the same key
      await contractInstance.createPurchaseContract(
        bytes32Key,
        "Another sport bike",
        "ipfsHash001",
        {
          from: seller,
          value: wei,
        }
      ).should.be.rejected;

      // Create second product
      bytes32Key = web3.utils.fromAscii("sportBikeModelX02");
      await contractInstance.createPurchaseContract(
        bytes32Key,
        "Another sport bike",
        "ipfsHash001",
        {
          from: seller,
          value: wei,
        }
      ).should.be.fulfilled;
    });

    it("validate product", async () => {
      const bytes32Key = web3.utils.fromAscii("sportBikeModelX01");
      const address = await contractInstance.getContractByKey(bytes32Key);
      assert.notEqual(address, 0x0);

      // get instance of the SafeRemotePurchase contract by address
      const ins = await SafeRemotePurchase.at(address);

      // validate key
      const key = await ins.key();
      //based on https://ethereum.stackexchange.com/questions/47881/remove-trailing-zero-from-web3-toascii-conversion
      const keyAscii = web3.utils.hexToUtf8(key);
      assert.equal(keyAscii, "sportBikeModelX01", "key is correct");

      // validate title
      const title = await ins.title();
      assert.equal(title, "Sport bike", "title is correct");

      // validate price
      const priceBN = await ins.price(); // BN
      const priceWei = priceBN.toString(); //convert BN to wei
      const priceEth = web3.utils.fromWei(priceWei, "ether"); //convert wei to ether
      assert.equal(priceEth, "0.7", "price is correct");

      // validate ballance
      const balanceBN = await ins.balanceOf();
      // balance has to be 2x price
      assert.equal(
        balanceBN.eq(priceBN.mul(new BN(2))),
        true,
        "balance is correct"
      );

      // validate owner
      const owner = await ins.seller();
      assert.equal(owner, seller, "owner is correct");

      // validate state
      const state = (await ins.state()).toString();
      assert.equal(state, "0", "state Created is correct");
    });

    it("product purchase and delivery", async () => {
      const bytes32Key = web3.utils.fromAscii("sportBikeModelX01");
      const address = await contractInstance.getContractByKey(bytes32Key);
      // get instance of the SafeRemotePurchase contract by address
      const product = await SafeRemotePurchase.at(address);

      let tx, event, balanceBN, state;

      // Buyer makes purchase (2x of price)
      tx = await product.buyerConfirmPurchase({
        from: buyer,
        value: web3.utils.toWei("1.4", "Ether"),
      });

      // Check logs
      event = tx.logs[0];
      assert.equal(event.event, "PurchaseConfirmed", "event is correct");

      // validate ballance
      balanceBN = await product.balanceOf();
      const priceBN = await product.price();
      // balance has to be 4x price  = (2x from the seller and 2x from the buyer)
      assert.equal(
        balanceBN.eq(priceBN.mul(new BN(4))),
        true,
        "balance is correct"
      );

      // validate buyer
      const purchaser = await product.buyer();
      assert.equal(purchaser, buyer, "purchaser is correct");

      // validate state
      state = (await product.state()).toString();
      assert.equal(state, "1", "state Locked is correct");

      // Buyer confirm delivery
      const origSellerBalanceWei = await web3.eth.getBalance(seller);
      const origSellerBalanceBN = new BN(origSellerBalanceWei);

      tx = await product.buyerConfirmReceived({
        from: buyer,
      });

      // Check logs
      event = tx.logs[0];
      assert.equal(event.event, "ItemReceived", "event is correct");

      // validate ballance
      balanceBN = await product.balanceOf();
      // balance has to be 0)
      assert.equal(balanceBN.eq(new BN(0)), true, "balance is correct");

      //validate the seller balance
      const newSellerBalanceWei = await web3.eth.getBalance(seller);
      const newSellerBalanceBN = new BN(newSellerBalanceWei);

      // seller has to get back 3x price
      const expectedBalanceBN = origSellerBalanceBN.add(priceBN.mul(new BN(3)));
      assert.equal(
        newSellerBalanceBN.eq(expectedBalanceBN),
        true,
        "seller balance is correct"
      );

      // validate state
      state = (await product.state()).toString();
      assert.equal(state, "2", "state Inactive is correct");
    });

    it("product purchase failure", async () => {
      const bytes32Key = web3.utils.fromAscii("sportBikeModelX01");
      const address = await contractInstance.getContractByKey(bytes32Key);
      // get instance of the SafeRemotePurchase contract by address
      const product = await SafeRemotePurchase.at(address);

      // Buyer tries to buy without enough ether (must be 2x of price)
      await product.buyerConfirmPurchase({
        from: buyer,
        value: web3.utils.toWei("1", "Ether"),
      }).should.be.rejected;
    });
  });
});
