import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";

import "../styles/main.css";

import Header from '../components/header';
import { loadAccountBalance } from '../methods/coin';
import Inventory from '../components/inventory';
import { getRentalCarsByOwnerId } from '../methods/cryptcar';
import DepositModal from '../components/modals/deposit_modal';

export default function Rentals(props) {

    const globalData = useSelector(state => state.global.data);

    const account = globalData.eth.account;
	const coinContract = globalData.eth.token;
	const carContract = globalData.eth.contract;

    const [balance, setBalance] = useState(0);
    const [inventory, setInventory] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);
    const [depositModalOpen, setDepositModalOpen] = useState(false);

    useEffect(() => {
        (() => {
            loadBalance();
            loadRentals();
        })();
    }, []);

    async function loadBalance() {
        setBalance(await loadAccountBalance(coinContract, account));
    }

    async function loadRentals() {
        const cars = await getRentalCarsByOwnerId(carContract, account);
        setInventory(cars);
    }

    function openDepositModal(item) {
        setSelectedCar(item);
        setDepositModalOpen(true);
    }

    return (
        <div className="dark-bg">
            <DepositModal
                visible={[depositModalOpen, setDepositModalOpen]}
            />
            <Header
                balance={balance}
                dropdownDisabled={true}
                registered={globalData.eth.registered}
            />

            <div style={{height: '5vh'}} />

            <Inventory
                inventory={[inventory, setInventory]}
                selectedCar={[selectedCar, setSelectedCar]}
                title="Your rentals"
                subtitle="Manage your collection here."
                button1Text="More info"
                button2Text="Manage"
                button2OnClick={openDepositModal}
            />
        </div>
    );
}