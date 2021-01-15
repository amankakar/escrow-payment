pragma solidity 0.5.11;

import "./HitchensUnorderedKeySet.sol";

contract hblMarket {
    using HitchensUnorderedKeySetLib for HitchensUnorderedKeySetLib.Set;
    HitchensUnorderedKeySetLib.Set widgetSet;

    struct WidgetStruct {
        address contractAddress;
    }

    mapping(bytes32 => WidgetStruct) public widgets;
    string public name;
    address public lastContractAddress;

    constructor() public {
        name = "hblMarket Smart Contract";
    }

    event logNewPurchaseContract(address contractAddress);
    event logRemovePurchaseContract(address sender, bytes32 key);

    function createPurchaseContract(
        bytes32 key,
        string memory title,
        string memory ipfsHash
    ) public payable returns (bool createResult) {
        widgetSet.insert(key); // Note that this will fail automatically if the key already exists.
        WidgetStruct storage w = widgets[key];

        SafeRemotePurchase c =
            (new SafeRemotePurchase).value(msg.value)(
                msg.sender,
                key,
                title,
                ipfsHash
            );
        lastContractAddress = address(c);
        w.contractAddress = lastContractAddress;

        emit logNewPurchaseContract(lastContractAddress);

        return true;
    }

    function getContractCount() public view returns (uint256 contractCount) {
        return widgetSet.count();
    }

    function getContractKeyAtIndex(uint256 index)
        public
        view
        returns (bytes32 key)
    {
        return widgetSet.keyAtIndex(index);
    }

    function getContractByKey(bytes32 key)
        public
        view
        returns (address contractAddress)
    {
        require(
            widgetSet.exists(key),
            "Can't get a widget that doesn't exist."
        );
        WidgetStruct storage w = widgets[key];
        return (w.contractAddress);
    }

    function removeContractByKey(bytes32 key) public {
        // Note that this will fail automatically if the key doesn't exist
        widgetSet.remove(key);
        delete widgets[key];
        emit logRemovePurchaseContract(msg.sender, key);
    }
}

contract SafeRemotePurchase {
    address payable public seller;
    address payable public buyer;
    uint256 public price;
    bytes32 public key; //unique string identifier
    string public title;
    string public ipfsHash;

    enum State {Created, Locked, Inactive}
    State public state;

    // Contract created by the seller
    // Ensure that `msg.value` is an even number.
    // Division will truncate if it is an odd number.
    // Check via multiplication that it wasn't an odd number.
    constructor(
        address payable _contractSeller,
        bytes32 _key,
        string memory _title,
        string memory _ipfxHash
    ) public payable {
        seller = _contractSeller;
        key = _key;
        ipfsHash = _ipfxHash;
        title = _title;
        price = msg.value / 2;

        //to verify that it does not represent an empty string.
        require(_key[0] != 0);

        require(bytes(_title).length > 0);
        // Require a valid price
        require(price > 0);
        require((price * 2) == msg.value, "Value has to be even.");
    }

    modifier condition(bool _condition) {
        require(_condition, "Condition is false");
        _;
    }

    modifier onlyBuyer() {
        require(msg.sender == buyer, "Only buyer can call this.");
        _;
    }

    modifier onlySeller() {
        require(msg.sender == seller, "Only seller can call this.");
        _;
    }

    modifier inState(State _state) {
        require(state == _state, "Invalid state.");
        _;
    }

    event Aborted();
    event PurchaseConfirmed();
    event ItemReceived();

    // Confirm the purchase as buyer.
    // Transaction has to include `2 * value` ether.
    // The ether will be locked until confirmReceived
    // is called.
    function buyerConfirmPurchase()
        public
        payable
        inState(State.Created)
        condition(msg.value == (price * 2))
    {
        emit PurchaseConfirmed();
        buyer = msg.sender;
        state = State.Locked;
    }

    // Confirm that you (the buyer) received the item.
    // This will release the locked ether.
    function buyerConfirmReceived() public onlyBuyer inState(State.Locked) {
        emit ItemReceived();
        state = State.Inactive;

        buyer.transfer(price);
        seller.transfer(balanceOf());
    }

    // The seller has changed his mind and does not want to sell the item
    // Abort the purchase and reclaim the ether.
    // Can only be called by the seller if the contract is Created
    function abortBySeller() public onlySeller inState(State.Created) {
        emit Aborted();
        state = State.Inactive;

        seller.transfer(balanceOf());
    }

    //get balance of the contract
    function balanceOf() public view returns (uint256) {
        return address(this).balance;
    }
}
