pragma solidity ^0.4.24;


contract IERC20Token {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;

    function balanceOf(address _owner) public view returns (uint256 balance);
    function transfer(address _to, uint256 _value)  public returns (bool success);
    function transferFrom(address _from, address _to, uint256 _value)  public returns (bool success);
    function approve(address _spender, uint256 _value)  public returns (bool success);
    function allowance(address _owner, address _spender)  public view returns (uint256 remaining);

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
}


// //TODO:
// First create a tx with user details : requires timeout, dest, digest, token.
// create claim, refund, txInitiate
contract Counter {
    struct Tx {
        bool isInitiator;
        uint timeOut;
        uint amount;
        address destination;
        address erc20;
        bytes32 digest;
    }

    mapping(address => Tx) public transactionMapping;

    modifier isNotInACurrentTx {
        Tx storage trans = transactionMapping[msg.sender];
        require(trans.destination == address(0), "Already in a current tx");
        _;
    }

    constructor() public {}

    //user should approve transfer first on erc20 for our contract address
    //approval takes 45225 gas
    //this fn takes 164756 gas
    function createTx(bool isInitiator, address dest, bytes32 digest, address erc20, uint amount) public
    isNotInACurrentTx { 
        transactionMapping[msg.sender] = Tx(isInitiator, now + 1 hours, amount, dest, erc20, digest);
        IERC20Token token = IERC20Token(erc20);
        //token.approve(address(this), amount); 
        token.transferFrom(msg.sender, address(this), amount); 
        //used transferfrom instead of delegate call
    }

    function claim(string _hash, address _initiator, uint _amountExpected) public {
        Tx storage transaction = transactionMapping[_initiator];
        require(msg.sender == transaction.destination, "Not the right person");
        require(transaction.amount == _amountExpected, "Not the right amount");
        if (transaction.isInitiator) {
            require(now <= transaction.timeOut - 0.8 * 1 hours, "too late to withdraw");
        }
        require(now <= transaction.timeOut, "too late to withdraw");
        require(transaction.digest == keccak256(abi.encodePacked(_hash)), "Hash doesn't match");
        IERC20Token token = IERC20Token(transaction.erc20);
        token.transfer(transaction.destination, transaction.amount);
        delete transactionMapping[_initiator];
    }

    function refund() public {
        Tx storage transaction = transactionMapping[msg.sender];
        require(now >= transaction.timeOut, "Timeout not done");
        IERC20Token token = IERC20Token(transaction.erc20);
        token.transfer(msg.sender, transaction.amount);
        delete transactionMapping[msg.sender];
    }
}