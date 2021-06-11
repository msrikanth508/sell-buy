const UsersContract = artifacts.require("./Users.sol");
const ItemManagerContract = artifacts.require("./ItemManager.sol");

module.exports = async function (deployer) {
 
  deployer.deploy(UsersContract);
  deployer.deploy(ItemManagerContract);
  //const userContract = await UsersContract.deployed();
  //console.log('userContract.address', userContract.address);
  //deployer.deploy(ItemManagerContract, userContract.address);
};
