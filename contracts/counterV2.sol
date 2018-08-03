pragma solidity ^0.4.24;

import "./IERC20Token.sol";


// //TODO:
// First create a tx with user details : requires timeout, dest, digest, token.
// create claim, refund, txInitiate
contract Counter {
    struct Tx {
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

    function createTx(address dest, bytes32 digest, address erc20, uint amount) public isNotInACurrentTx { 
        transactionMapping[msg.sender] = Tx(now + 1 hours, amount, dest, erc20, digest);
        IERC20Token token = IERC20Token(erc20);
        token.approve(address(this), amount); 
        token.transferFrom(msg.sender, address(this), amount); 
        //used transferfrom instead of delegate call
    }

    function claim(string _hash, address _initiator) public {
        Tx storage transaction = transactionMapping[_initiator];
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