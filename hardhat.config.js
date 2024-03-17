require("@nomicfoundation/hardhat-toolbox");

const alchemy_key = "";
const wallet_key = "4163a5233797407bec5c2e45b2c246c4e5c2f076928c9b1865851616d33566f3";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/XFNoe5WjBD3EKqND2UOAqCJw1ceWVroP",
      accounts: [wallet_key],
    },
  },
};