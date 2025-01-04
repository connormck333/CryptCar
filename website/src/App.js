import { useEffect, useState } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import { useSelector, useDispatch } from "react-redux";
import './App.css';
import Header from './components/header';
import InfoModal from './components/info_modal';
import Inventory from './components/inventory';
import Landing from './components/landing';
import UploadRentalModal from './components/upload_rental_modal';
import BuyCoinsModal from './components/buy_coins_modal';
import RentCarModal from './components/rent_car_modal';
import { loadAccountBalance } from './methods/coin';

function App() {

	const globalData = useSelector(state => state.global.data);
	const account = globalData.eth.account;
	const coinContract = globalData.eth.token;
	const carContract = globalData.eth.contract;
	
	const [balance, setBalance] = useState(0);
	const [inventory, setInventory] = useState([]);
	const [infoModalOpen, setInfoModalOpen] = useState(false);
	const [uploadRentalModalOpen, setUploadRentalModalOpen] = useState(false);
	const [buyCoinsModalOpen, setBuyCoinsModalOpen] = useState(false);
	const [rentCarModalOpen, setRentCarModalOpen] = useState(false);
	const [selectedCar, setSelectedCar] = useState(undefined);

	useEffect(() => {
		(() => {
			loadRentalCars();
			getBalance();
		})();
	}, []);

	async function loadRentalCars() {
		const response = await carContract.getRentalCars();
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

	async function getBalance() {
		const bal = await loadAccountBalance(coinContract, account);
		setBalance(bal);
	}

	function _setSelectedCar(item) {
		setSelectedCar(item);
		setInfoModalOpen(true);
	}

	function _setRentCarModalOpen(car) {
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
				updateAccountBalance={getBalance}
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
				registered={globalData.eth.registered}
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
