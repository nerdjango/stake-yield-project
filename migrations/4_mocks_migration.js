const mockPriceFeed = artifacts.require("MockV3Aggregator");
const daiToken = artifacts.require("MockDAI");
const wethToken = artifacts.require("MockWETH");
const Web3 = require("web3")

module.exports = async function(deployer) {
    let decimals = 18
    let priceValue = Web3.utils.toWei("2000", "ether")
    await deployer.deploy(mockPriceFeed, decimals, priceValue);
    await deployer.deploy(daiToken);
    await deployer.deploy(wethToken);
};