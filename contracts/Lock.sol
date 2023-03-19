// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract BuyMeACoffee {
    event NewMemo(
        address indexed from,
        uint256 timestep,
        string name,
        string message);

    struct Memo{
        
    }
        
    Memo[] memos;

    address payable owner;

    constructor(){
        owner = payable(msg.sender);
    }

    function BuyCoffee(string memory _name, string memory _message)public payable{
        require(msg.value>0,"Can't buy a coffee with 0 eth");

        memos.push(Memo(
            msg.sender;
            block.timestamp;
            string _name;
            string _message;
        ));

        emit NewMemo(
            msg.sender;
            block.timestamp;
            string _name;
            string _message;)
    }

    function withdrawTips() public{
        require(owner.send(address(this).balance));
    }

    function getMemos() public view returns(Memo[] memory){
        return memos;
    }

}
