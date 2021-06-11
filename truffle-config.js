const path = require("path");
require('dotenv').config({path: './.env'});
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 8545,
    },
    ropsten_infura: {
      provider(){
        return new HDWalletProvider(
          process.env.MNEMONIC,
          `wss://ropsten.infura.io/ws/v3/${process.env.INFURA_PROJECT_ID}`,
          0
        );
      },
      network_id: 3,
      networkCheckTimeout: 1000000,
      timeoutBlocks: 200
    },   
    kovan_infura: {
      provider: function() {
        return new HDWalletProvider(
          process.env.MNEMONIC,
          `https://kovan.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
          0
        )
      },
      network_id: 42,
      networkCheckTimeout: 1000000,
      timeoutBlocks: 200
    },
    goerli_infura: {
      provider: function() {
        return new HDWalletProvider(
          process.env.MNEMONIC,
          `https://goerli.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
          0
        )
      },
      network_id: 5,
      networkCheckTimeout: 1000000,
      timeoutBlocks: 200
    }
  },
  compilers: {
    solc: {
      version: "0.8.4",
    },
  },
};
