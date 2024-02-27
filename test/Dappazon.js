const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Dappazon", () => {

  let dappazon;
  let deployer,  buyer;

  beforeEach(async () => {

    // Fetch Accounts

    [deployer, buyer] = await ethers.getSigners()

    // Deploy Contract
    const Dappazon = await ethers.getContractFactory("Dappazon");
    dappazon = await Dappazon.deploy();

    
  });

  describe("Deployment", () => {

    it("Sets the owner", async () => {
      expect(await dappazon.owner()).to.be.equal(deployer.address);
    });
  });
});
