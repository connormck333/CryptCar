import { useEffect, useState } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import { useSelector } from "react-redux";
import '../App.css';
import Header from '../components/header';
import Inventory from '../components/inventory';
import Landing from '../components/landing';
import UploadRentalModal from '../components/modals/upload_rental_modal';
import BuyCoinsModal from '../components/modals/buy_coins_modal';
import RentCarModal from '../components/modals/rent_car_modal';
import { loadAccountBalance } from '../methods/coin';
import { getRentalCars } from '../methods/cryptcar';

function Home() {

	const globalData = useSelector(state => state.global.data);
	const account = globalData.eth.account;
	const coinContract = globalData.eth.token;
	const carContract = globalData.eth.contract;
	
	const [balance, setBalance] = useState(0);
	const [inventory, setInventory] = useState([]);
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
		const cars = await getRentalCars(carContract);
		setInventory(cars);
	}

	async function getBalance() {
		const bal = await loadAccountBalance(coinContract, account);
		setBalance(bal);
	}

	function _setRentCarModalOpen(car) {
		setSelectedCar(car);
		setRentCarModalOpen(true);
	}

	return (
		<div className="home">
			<UploadRentalModal
				visible={[uploadRentalModalOpen, setUploadRentalModalOpen]}
				carContract={carContract}
				reloadInventory={loadRentalCars}
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
				selectedCar={[selectedCar, setSelectedCar]}
				title="Our Inventory"
				subtitle="Have a look at our amazing supercar collection. Rent your dream car now!"
				button2Text="Rent now"
				button2OnClick={_setRentCarModalOpen}
			/>
		</div>
	);
}

export default Home;
