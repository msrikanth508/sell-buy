// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.4;

contract Users {
    struct User {
        string name;
        bool isActive;
    }

    mapping(address => User) users;
    function createUser(string memory name) public returns(string memory) {
        users[msg.sender].name = name;
        users[msg.sender].isActive = true;
        
        return name;
    }

    function getUser(address _addr) public view returns(string memory name)  {
        return users[_addr].name;
    }
}