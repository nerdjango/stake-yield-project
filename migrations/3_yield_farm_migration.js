const YieldFarm = artifacts.require("YieldFarm");
const Token = artifacts.require("DeFiToken");

module.exports = async function(deployer) {
    const token = await Token.deployed();
    const tokenAddress = token.address;
    await deployer.deploy(YieldFarm, tokenAddress);
};