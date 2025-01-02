const CryptCarCoin = artifacts.require("CryptCarCoin");

module.exports = function (deployer) {
    const maxSupply = 1000000000; // Example value for maxSupply

    deployer.deploy(CryptCarCoin, maxSupply);
};