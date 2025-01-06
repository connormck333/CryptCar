const chai = require("chai");
const { ethers } = require("hardhat");
const eventemitter2 = require('chai-eventemitter2');
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const { expect } = chai;
chai.use(eventemitter2());

describe("CryptCar", function () {

    let owner, token, contract, wallets;
    let renter, carOwner;

    before(async function () {
        wallets = await ethers.getSigners();
        owner = wallets[0];
        renter = wallets[1];
        carOwner = wallets[2];
        const CryptCarCoin = await ethers.getContractFactory("CryptCarCoin");
        token = await CryptCarCoin.deploy(1000);
        await token.waitForDeployment();

        const CryptCar = await ethers.getContractFactory("CryptCar");
        contract = await CryptCar.deploy(token.target);
        await contract.waitForDeployment();
    });

    it("Setting CryptCar contract as CryptCarAddress in CryptCarCoin should pass as owner", async () => {
        const tx = await token.setCryptCarAddress(contract.target);

        expect(tx).to.be.ok;
    });

    it("Setting CryptCar contract as CryptCarAddress in CryptCarCoin should not pass as not the owner", async () => {
        try {
            await token.connect(wallets[1]).setCryptCarAddress(contract.target);
            expect.fail();
        } catch (err) {
            expect(err.message).to.contain("revert");
        }
    });

    it("Minting tokens under max supply as owner should pass", async () => {
        const tx = await token.mint(100);

        expect(tx).to.be.ok;
    });

    it("Minting tokens over max supply as owner should not pass", async () => {
        try {
            await token.mint(10000);
            expect.fail();
        } catch (err) {
            expect(err.message).to.contain("revert");
        }
    });

    it("Minting tokens not as the owner should not pass", async () => {
        try {
            await token.connect(wallets[1]).mint(100);
            expect.fail();
        } catch (err) {
            expect(err.message).to.contain("revert");
        }
    });

    it("Buying tokens should be accepted", async () => {
        await token.connect(renter).buy({
            value: ethers.parseUnits("10", "wei")
        });
        const balance = await token.getBalanceOfAddress(renter.address);

        expect(Number(balance)).to.be.equal(2);
    });

    it("Selling tokens should be accepted", async () => {
        const tx = await token.connect(renter).sell(1);
        expect(tx).to.be.ok;
    });

    it("Transferring tokens should be accepted", async () => {
        await token.connect(renter).transfer(1, carOwner.address);
        const balance = await token.getBalanceOfAddress(carOwner.address);

        expect(Number(balance)).to.be.equal(1);
    });

    it("Calling function with 'onlyCryptCar' modifier should not be accepted from wallet", async () => {
        try {
            await token.transferTokensForRental(renter.address, carOwner.address, 2, 1);
            expect.fail();
        } catch (err) {
            expect(err.message).to.contain("You do not have permission");
        }
    });

    it("Registering a car for rental should be accepted", async () => {
        await contract.connect(carOwner).registerCarForRental("Ferrari", "SF90 Stradale", "", "2021 Ferrari, 1000BHP, Hybrid", 10, 3, "Any damage at all and the deposit will be kept.", "Antrim");
        const rentalCars = await contract.getRentalCars();

        expect(rentalCars.length).to.be.equal(1);
    });

    it("Renting a car without having registered should not be accepted", async () => {
        try {
            await contract.rentCar(1, 1716212159, 1716381343);
            expect.fail();
        } catch (err) {
            expect(err.message).to.contain("revert");
        }
    });

    it("Renting a car without insufficient tokens should not be accepted", async () => {
        await contract.connect(renter).registerForRenting("Test", "Renter");

        try {
            await contract.connect(renter).rentCar(1, Math.floor(Date.now() / 1000), Math.floor((Date.now() / 1000) + 86400));
            expect.fail();
        } catch (err) {
            expect(err.message).to.contain("Insufficient CryptCarCoin Balance");
        }
    });

    it("Renting a car after registering and with sufficient tokens should be accepted", async () => {
        await token.connect(renter).buy({
            value: ethers.parseUnits("500", "wei")
        });

        const balance = await token.getBalanceOfAddress(renter.address);

        const tx = await contract.connect(renter).rentCar(1, Math.floor(Date.now() / 1000), Math.floor((Date.now() / 1000) + 86400));
        expect(tx).to.be.ok;

        const newBalance = await token.getBalanceOfAddress(renter.address);
        expect(Number(newBalance)).to.be.lessThan(Number(balance));
    });

    it("Registering twice should not pass", async () => {
        try {
            await contract.connect(renter).registerForRenting("Test", "Renter");
            expect.fail();
        } catch (err) {
            expect(err.message).to.contain("revert");
        }
    });

    describe("Deposit management", () => {

        before(async () => {
            let tx = await contract.connect(carOwner).registerCarForRental("Lamborghini", "Centenario", "", "2021 Lamborghini, 1000BHP, Hybrid", 10, 3, "Any damage at all and the deposit will be kept.", "Antrim");
            await tx.wait();
            tx = await contract.connect(renter).rentCar(2, 10000, 100000);
            await tx.wait();
        });

        it("Attempting to manage deposit before end of rental should not pass", async () => {
            try {
                await contract.connect(carOwner).returnDeposit(1);
                expect.fail();
            } catch (err) {
                expect(err.message).to.contain("Cannot return deposit until end of rental");
            }
    
            try {
                await contract.connect(carOwner).keepDeposit(1, "Scratches on the wheel");
                expect.fail();
            } catch (err) {
                expect(err.message).to.contain("Cannot keep deposit until end of rental");
            }
        });
    
        it("Attempting to return deposit twice should not pass", async () => {
            try {
                let tx = await contract.connect(carOwner).returnDeposit(2);
                await tx.wait();
                tx = await contract.connect(carOwner).returnDeposit(2);
                await tx.wait();
                expect.fail()
            } catch (err) {
                expect(err.message).to.contain("Car is not currently being rented");
            }
        })

    });

    it("Renting same car twice at same time should not pass", async () => {
        try {
            await contract.connect(renter).rentCar(1, Math.floor(Date.now() / 1000), Math.floor((Date.now() / 1000) + 86400));
            expect.fail();
        } catch (err) {
            expect(err.message).to.contain("revert");
        }
    });
});