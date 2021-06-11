// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.4;

contract Item {
    string public title;
    string public description;
    uint256 public price;
    uint256 public id;
    bool public isSold;
    address public sellerAccount;
    string public sellerName;
    string public imageAddress;

    constructor(
        string memory _title,
        string memory _description,
        uint256 _price,
        address _addr,
        string memory _seller,
        uint256 _id,
        string memory _imageAddress
    )  {
       price = _price;
       description = _description;
       title =_title;
       id = _id;
       isSold = false;
       sellerAccount = _addr;
       sellerName = _seller;
       imageAddress= _imageAddress;
    }

    function setItemSold() public {
        isSold = true;
    }

    // receive() external payable  {
    //     require(isSold == false, "Item not available");
    //     require(msg.sender != sellerAccount, "You can not buy your own posted item.");
    //     require(msg.value == price, "Insufficient balance");
    //     payable(sellerAccount).transfer(msg.value);
    //     setItemSold();
    // }
}
