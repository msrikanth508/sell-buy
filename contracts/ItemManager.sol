// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.4;
import "./Item.sol";

contract ItemManager {
    struct S_Item {
        Item item;
    }
    
    struct Product {
        string  title;
        string  description;
        uint256  price;
        address sellerAccount;
        string sellerName;
        uint256 id;
        bool isSold;
        string imageAddress;
        address productAddress;
    }

    mapping(uint256 => S_Item) items;
    uint256 index = 0;
    address userContractAddress;

    function createItem(
        string memory _title,
        string memory _description,
        uint256 _price,
        string memory name,
        string memory imageHash
    ) public returns(address _itemAddress) {
        Item item = new Item(_title, _description, _price, msg.sender, name, index, imageHash);
        items[index].item = item;
        index++;

        return address(item);
    }

    function getItems() public view returns(Product[] memory){
        Product[] memory products = new Product[](index);
        
        for(uint i = 0; i < index; i++) {
            products[i].title = items[i].item.title();
            products[i].description = items[i].item.description(); 
            products[i].price = items[i].item.price();
            products[i].sellerAccount = items[i].item.sellerAccount();
            products[i].sellerName = items[i].item.sellerName();
            products[i].id = items[i].item.id();
            products[i].isSold = items[i].item.isSold(); 
            products[i].imageAddress = items[i].item.imageAddress();
            products[i].productAddress = address(items[i].item);
        }

       return products;
    }

    function buyItem(uint itemIndex) public payable returns(bool isSuccess) {
        uint u = uint(itemIndex);

        require(items[u].item.isSold() == false, "Item not available");
        require(msg.sender != items[u].item.sellerAccount(), "You can not buy your own posted item.");
        require(items[u].item.price() == msg.value, "Insufficient balance");
        payable(items[u].item.sellerAccount()).transfer(msg.value);
        items[u].item.setItemSold();
        
        return true;
    }
}
