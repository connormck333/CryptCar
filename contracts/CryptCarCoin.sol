// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CryptCarCoin {

    address owner;
    uint256 maxSupply;
    uint256 currentSupply;
    mapping(address => uint256) balances;
    uint256 tokenPrice = 5; // Price in wei
    address CryptCarAddress;
    bool addressSet = false;

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner of this contract.");
        _;
    }

    modifier onlyCryptCar() {
        require(msg.sender == CryptCarAddress, "You do not have permission.");
        _;
    }

    constructor(uint256 _max) {
        maxSupply = _max;
        currentSupply = 0;
        owner = msg.sender;
    }

    function setCryptCarAddress(address cryptAddress) public onlyOwner {
        require(addressSet == false, "Address has already been set.");
        CryptCarAddress = cryptAddress;
        addressSet = true;
    }

    function mint(uint256 amount) public onlyOwner {
        require(currentSupply + amount <= maxSupply, "Amount exceeds max supply restriction.");
        balances[owner] += amount;
        currentSupply += amount;
    }

    function buy() public payable {
        uint256 amount = msg.value / tokenPrice;
        require(amount > 0, "Amount cannot be equal to or less than 0.");
        require(amount <= maxSupply, "Not enough tokens available");

        balances[msg.sender] += amount;
        currentSupply += amount;
    }

    function sell(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient token amount");
        uint256 ethAmount = amount * tokenPrice;
        
        balances[msg.sender] -= amount;
        currentSupply -= amount;
        payable(msg.sender).transfer(ethAmount);
    }

    function transfer(uint256 amount, address receiver) public {
        require(balances[msg.sender] >= amount, "Insufficient token amount");

        balances[msg.sender] -= amount;
        balances[receiver] += amount;
    }

    function getBalanceOfAddress(address user) public view returns (uint256) {
        return balances[user];
    }

    function transferTokensForRental(address renter, address carOwner, uint256 amount, uint256 deposit) external onlyCryptCar {
        balances[renter] -= (amount + deposit);
        balances[carOwner] += amount;
    }

    function returnRenterDeposit(address renter, uint256 amount) external onlyCryptCar {
        balances[renter] += amount;
    }

    function keepRenterDeposit(address _owner, uint256 amount) external onlyCryptCar {
        balances[_owner] += amount;
    }
}