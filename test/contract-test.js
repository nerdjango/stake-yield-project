const truffleAssert = require("truffle-assertions")

const YieldFarm = artifacts.require("YieldFarm");
const Token = artifacts.require("DeFiToken");

//Development Mocks: in production these wouldnt be required
const mockPriceFeed = artifacts.require("MockV3Aggregator");
const daiToken = artifacts.require("MockDAI");
const wethToken = artifacts.require("MockWETH");

contract("YieldFarm", accounts => {
    it("should allow only owner to add allowed tokens.", async() => {
        let yieldFarm = await YieldFarm.deployed()
        let DFT = await Token.deployed()
        let DAI = await daiToken.deployed()
        let WETH = await wethToken.deployed()
        let priceFeed = await mockPriceFeed.deployed()

        await truffleAssert.reverts(yieldFarm.addAllowedTokens(DFT.address, { from: accounts[1] })) // should revert as non-owners can't add tokens
        await truffleAssert.passes(yieldFarm.addAllowedTokens(DFT.address, { from: accounts[0] }))
        await truffleAssert.passes(yieldFarm.addAllowedTokens(DAI.address, { from: accounts[0] }))
        await truffleAssert.passes(yieldFarm.addAllowedTokens(WETH.address, { from: accounts[0] }))

    })
})