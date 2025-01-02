// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "./CryptCarCoin.sol";

contract CryptCar {

    struct RentalCar {
        string brand;
        string model;
        string imageURL;
        string description;
        uint256 pricePerDay; // CryptCarCoins
        uint256 depositAmount;
        string termsAndConditions;
        string location;
        address owner;
        uint256 id;
    }

    struct Renter {
        string forename;
        string surname;
        address user;
        uint256 id;
    }

    struct CarRented {
        Renter renter;
        RentalCar car;
        uint256 rentalID;
        uint256 startDate;
        uint256 endDate;
        uint256 timestamp;
    }

    event DepositReturned(
        uint256 amount,
        uint256 carID,
        address owner,
        address renter
    );

    event DepositKept(
        uint256 amount,
        uint256 carID,
        address owner,
        address renter,
        string reason
    );

    CryptCarCoin private token;
    RentalCar[] private rentalCars;
    mapping(address => Renter) private renters; 
    mapping(uint256 => CarRented) private currentlyRentedCars;

    uint256 private carCounter = 0;
    uint256 private renterCounter = 0;
    uint256 private rentalCounter = 0;

    constructor(CryptCarCoin _token) {
        token = _token;
    }

    function registerCarForRental(
        string memory _brand,
        string memory _model,
        string memory _imageURL,
        string memory _description,
        uint256 _pricePerDay,
        uint256 _depositAmount,
        string memory _termsAndConditions,
        string memory _location
    ) public {
        carCounter++;
        RentalCar memory newCar = RentalCar(
            _brand,
            _model,
            _imageURL,
            _description,
            _pricePerDay,
            _depositAmount,
            _termsAndConditions,
            _location,
            msg.sender,
            carCounter
        );
        rentalCars.push(newCar);
    }

    function getRentalCars() public view returns (RentalCar[] memory) {
        return rentalCars;
    }

    function getRentalCar(uint256 carID) internal view returns (RentalCar memory) {
        for (uint i = 0; i < rentalCars.length; i++) {
            if (rentalCars[i].id == carID) {
                return rentalCars[i];
            }
        }

        revert("Car does not exist with that id");
    }

    function registerForRenting(
        string memory forename,
        string memory surname
    ) public {
        if (getRenter(msg.sender).id != 0) {
            revert("This address has already registered.");
        }

        renterCounter++;
        Renter memory newRenter = Renter(forename, surname, msg.sender, renterCounter);
        renters[msg.sender] = newRenter;
    }

    function getRenter(address user) public view returns (Renter memory) {
        return renters[user];
    }

    function rentCar(uint256 carID, uint256 startDate, uint256 endDate) public {
        RentalCar memory car = getRentalCar(carID);
        Renter memory renter = getRenter(msg.sender);

        if (renter.id == 0) {
            revert("This address has not registered for renting.");
        }

        CarRented memory existingRental = currentlyRentedCars[car.id];
        require(existingRental.rentalID == 0, "Car is currently rented");

        uint256 daysBetween = (endDate - startDate) / 60 / 60 / 24;
        uint256 cost = car.pricePerDay * daysBetween;

        uint256 renterBalance = token.getBalanceOfAddress(msg.sender);
        require(renterBalance >= cost + car.depositAmount, "Insufficient CryptCarCoin Balance");
        
        rentalCounter++;
        CarRented memory rental = CarRented(renter, car, rentalCounter, startDate, endDate, block.timestamp);
        currentlyRentedCars[car.id] = rental;

        token.transferTokensForRental(msg.sender, car.owner, cost, car.depositAmount);
    }

    function returnDeposit(uint256 carID) public {
        RentalCar memory car = getRentalCar(carID);
        require(msg.sender == car.owner, "You are not the owner of this vehicle");
        
        CarRented memory rental = currentlyRentedCars[car.id];
        require(rental.rentalID != 0, "Car is not currently being rented");
        require(block.timestamp >= rental.endDate, "Cannot return deposit until end of rental");
        
        Renter memory renter = getRenter(rental.renter.user);
        require(renter.id != 0, "Renter does not exist.");

        token.returnRenterDeposit(renter.user, car.depositAmount);

        emit DepositReturned(car.depositAmount, car.id, car.owner, renter.user);
    }

    function keepDeposit(uint256 carID, string memory reason) public {
        RentalCar memory car = getRentalCar(carID);
        require(msg.sender == car.owner, "You are not the owner of this vehicle");
        
        CarRented memory rental = currentlyRentedCars[car.id];
        require(rental.rentalID != 0, "Car is not currently being rented");
        require(block.timestamp >= rental.endDate, "Cannot keep deposit until end of rental");
        
        Renter memory renter = getRenter(rental.renter.user);
        require(renter.id != 0, "Renter does not exist.");

        token.keepRenterDeposit(car.owner, car.depositAmount);
        
        emit DepositKept(car.depositAmount, car.id, car.owner, renter.user, reason);
    }
}