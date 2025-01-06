async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const CryptCarCoin = await ethers.getContractFactory("CryptCarCoin");
    const cryptCarCoinInstance = await CryptCarCoin.deploy(1000000);
    console.log("CryptCarCoin deployed to:", cryptCarCoinInstance.target);

    const CryptCar = await ethers.getContractFactory("CryptCar");
    const cryptCarInstance = await CryptCar.deploy(cryptCarCoinInstance.target);
    console.log("CryptCar deployed to:", cryptCarInstance.target);

    await cryptCarCoinInstance.setCryptCarAddress(cryptCarInstance.target);
    console.log("CryptCar address set in CryptCarCoin contract");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });