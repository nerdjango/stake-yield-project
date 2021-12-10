const truffleAssert = require("truffle-assertions")

const YieldFarm = artifacts.require("YieldFarm");
const Token = artifacts.require("DeFiToken");

//Development Mocks: in production these wouldnt be required
const mockPriceFeed = artifacts.require("MockV3Aggregator");
const daiToken = artifacts.require("MockDAI");
const wethToken = artifacts.require("MockWETH");

const Web3 = require("web3")

contract("YieldFarm", accounts => {
    it("should allow only owner to add allowed tokens.", async() => {
        let yieldFarm = await YieldFarm.deployed()
        let DFT = await Token.deployed()
        let DAI = await daiToken.deployed()
        let WETH = await wethToken.deployed()

        let sendAmount = Web3.utils.toWei("999900", "ether")

        // Transfer all minted DeFi Tokens - 100
        await DFT.transfer(yieldFarm.address, sendAmount)

        await truffleAssert.reverts(yieldFarm.addAllowedTokens(DFT.address, { from: accounts[1] })) // should revert as non-owners can't add tokens
        await truffleAssert.passes(yieldFarm.addAllowedTokens(DFT.address, { from: accounts[0] }))
        await truffleAssert.passes(yieldFarm.addAllowedTokens(DAI.address, { from: accounts[0] }))
        await truffleAssert.passes(yieldFarm.addAllowedTokens(WETH.address, { from: accounts[0] }))
    })
    it("should allow only owner to set price feed address.", async() => {
        let yieldFarm = await YieldFarm.deployed()
        let DFT = await Token.deployed()
        let DAI = await daiToken.deployed()
        let WETH = await wethToken.deployed()
        let priceFeed = await mockPriceFeed.deployed()

        await truffleAssert.reverts(yieldFarm.setPriceFeedContract(DFT.address, priceFeed.address, { from: accounts[1] })) // should revert as non-owners can't set pricefeed
        await truffleAssert.passes(yieldFarm.setPriceFeedContract(DFT.address, priceFeed.address, { from: accounts[0] }))
        await truffleAssert.passes(yieldFarm.setPriceFeedContract(DAI.address, priceFeed.address, { from: accounts[0] }))
        await truffleAssert.passes(yieldFarm.setPriceFeedContract(WETH.address, priceFeed.address, { from: accounts[0] }))
        assert.equal(await yieldFarm.tokenPriceFeedMapping(DFT.address), priceFeed.address)
    })
    it("should allow user to stake.", async() => {
        let yieldFarm = await YieldFarm.deployed()
        let DFT = await Token.deployed()

        await DFT.approve(yieldFarm.address, 100)
        await yieldFarm.stakeTokens(100, DFT.address)

        assert.equal(await yieldFarm.stakingBalance(DFT.address, accounts[0]), 100)
        assert.equal(await yieldFarm.uniqueTokensStaked(accounts[0]), 1)
        assert.equal(await yieldFarm.stakers(0), accounts[0])
    })
    it("should issue tokens to users with stakes.", async() => {
        let yieldFarm = await YieldFarm.deployed()
        let DFT = await Token.deployed()

        let start_balance = await DFT.balanceOf(accounts[0])

        await yieldFarm.issueTokens()
        let end_balance = await DFT.balanceOf(accounts[0])
        assert.equal(parseInt(end_balance), parseInt(start_balance) + (Web3.utils.toWei("2000", "ether") / 10 ** 16))
    })
})