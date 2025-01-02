import { useEffect, useState } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import { ethers } from 'ethers';
import { parseEther, formatEther } from '@ethersproject/units';
import CryptCarCoin from './contracts/CryptCarCoin.json';
import CryptCar from './contracts/CryptCar.json';
import './App.css';
import Header from './components/header';
import InfoModal from './components/info_modal';
import Inventory from './components/inventory';
import Landing from './components/landing';
import UploadRentalModal from './components/upload_rental_modal';
import BuyCoinsModal from './components/buy_coins_modal';
import RentCarModal from './components/rent_car_modal';

function App() {

	const CryptCarCoinAddress = "0xfCAf95056Ec32289aD68cfc02a8C3C2cDc18f7e9";
	const CryptCarAddress = "0x7efDb5E8e6a0028086C5e617fa9AC19853edB5Cf";

	const [account, setAccount] = useState();
	const [balance, setBalance] = useState(0);
	const [coinContract, setCoinContract] = useState(undefined);
	const [carContract, setCarContract] = useState(undefined);
	const [inventory, setInventory] = useState([]);
	const [infoModalOpen, setInfoModalOpen] = useState(false);
	const [uploadRentalModalOpen, setUploadRentalModalOpen] = useState(false);
	const [buyCoinsModalOpen, setBuyCoinsModalOpen] = useState(false);
	const [rentCarModalOpen, setRentCarModalOpen] = useState(false);
	const [selectedCar, setSelectedCar] = useState(undefined);

	useEffect(() => {
		(() => {
			initializeEthereumContract();
		})();
	}, []);

	async function initializeEthereumContract() {
		const _account = await requestAccount();
		const { token, contract } = await initializeContracts();
		loadRentalCars(contract);
		loadAccountBalance(token, _account);
	}

	async function requestAccount() {
		const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
		setAccount(account[0]);
		return account[0];
	}

	async function initializeContracts() {
		const provider = new ethers.BrowserProvider(window.ethereum);
		const signer = await provider.getSigner();
		const token = new ethers.Contract(CryptCarCoinAddress, CryptCarCoin.abi, signer);
		const contract = new ethers.Contract(CryptCarAddress, CryptCar.abi, signer);
		setCoinContract(token);
		setCarContract(contract);
		return {
			token,
			contract
		}
	}

	async function loadRentalCars(contract) {
		const response = await contract.getRentalCars();
		const cars = [];
		for (let car of response) {
			cars.push({
				brand: car[0],
				model: car[1],
				imageURL: car[2],
				description: car[3],
				pricePerDay: parseInt(car[4]),
				depositAmount: parseInt(car[5]),
				termsAndConditions: car[6],
				location: car[7],
				owner: car[8],
				id: car[9]
			});
		}

		setInventory(cars);
	}

	async function loadAccountBalance(token, _account) {
		try {
			const bal = await token.getBalanceOfAddress(_account);
			setBalance(parseInt(bal));
		} catch (err) {
			console.log(err)
		}
	}

	async function updateAccountBalance() {
		try {
			const bal = await coinContract.getBalanceOfAddress(account);
			setBalance(parseInt(bal));
		} catch (err) {
			console.log(err)
		}
	}

	function _setSelectedCar(item) {
		setSelectedCar(item);
		setInfoModalOpen(true);
	}

	function _setRentCarModalOpen(car) {
		console.log(car)
		setSelectedCar(car);
		setRentCarModalOpen(true);
	}

	return (
		<div className="App">
			<InfoModal
				visible={[infoModalOpen, setInfoModalOpen]}
				item={selectedCar}
				openRentCarModal={_setRentCarModalOpen}
			/>
			<UploadRentalModal
				visible={[uploadRentalModalOpen, setUploadRentalModalOpen]}
				carContract={carContract}
			/>
			<BuyCoinsModal
				visible={[buyCoinsModalOpen, setBuyCoinsModalOpen]}
				coinContract={coinContract}
				updateAccountBalance={updateAccountBalance}
			/>
			<RentCarModal
				visible={[rentCarModalOpen, setRentCarModalOpen]}
				carContract={carContract}
				car={selectedCar}
			/>
			<Header
				uploadRentalModal={[uploadRentalModalOpen, setUploadRentalModalOpen]}
				buyCoinsModal={[buyCoinsModalOpen, setBuyCoinsModalOpen]}
				balance={balance}
			/>
			<Landing />
			<Inventory
				inventory={[inventory, setInventory]}
				setSelectedCar={_setSelectedCar}
				openRentCarModal={_setRentCarModalOpen}
			/>
		</div>
	);
}

export default App;
