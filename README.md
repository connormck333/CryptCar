# CryptCar
An ethereum-based decentralized React web app for luxury & exotic super car rentals.

## Preview
![Preview](./assets/preview-gif.gif)

## Prerequisites
To reproduce, you must have the following installed:
- Node
- Hardhat
- MetaMask Chrome extension

## How to reproduce
1. Clone this repo
2. Navigate to the local repo and run ```npm install```
3. Also run ```npm install``` in ***./website***.
4. You must start a hardhat node by running ```npx hardhat node```. This will create wallets for you to connect to your MetaMask account.
5. Copy and paste a wallet and add it to your MetaMask account.
6. To deploy the contracts, run ```npx hardhat run ./migrations/migrate```.
7. Copy and paste the contract addresses into ***./website/src/methods/eth_initializers.js***
8. Run ```npx hardhat compile```. This will generate the contracts' ABIs in ***./artifacts/contracts***.
9. Copy and paste both json files into ***./website/src/contracts***. You can ignore the .dbg.json files. You can replace the existing json files in the website contracts folder.
10. Run ```cd ./website``` and ```npm start``` to start the web app.

## What is CryptCar?
CryptCar is a decentralized React web app that allows supercar owners to rent out their cars using cryptocurrency.

I created 2 smart contracts with Solidity; one for a currency; one for handling the rentals. This allows customers to rent cars using CryptCarCoin which they can buy with Ethereum.

Customers must also register to be able to rent cars. The smart contract enables supercar owners to manage the deposits.

## Reason behind the project
I am fascinated with web3 and crypto currency. I developed the rental and token smart contracts to advance my Solidity experience. I wanted to create an app that would allow interaction with the contracts rather than just unit tests. Therefore, I built a basic React app, not focusing heavily on styling etc, but purely on Solidity contracts integration and functionality.

I plan to continue to improve my web3 and crypto knowledge with more projects.