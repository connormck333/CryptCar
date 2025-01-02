const CryptCar = artifacts.require("CryptCar");
const CryptCarCoin = artifacts.require("CryptCarCoin");

module.exports = async function (deployer) {
    // Deploy CryptCarCoin contract first
    await deployer.deploy(CryptCarCoin, 1000000); // Example value for maxSupply

    // Get the deployed CryptCarCoin instance
    const cryptCarCoinInstance = await CryptCarCoin.deployed();

    // Deploy CryptCar contract and pass the address of CryptCarCoin contract as constructor parameter
    await deployer.deploy(CryptCar, cryptCarCoinInstance.address);
};
