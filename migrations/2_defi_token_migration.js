const DeFiToken = artifacts.require("DeFiToken");

module.exports = function(deployer) {
    deployer.deploy(DeFiToken);
};