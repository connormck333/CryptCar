import { ethers } from 'ethers';
import { useSelector, useDispatch } from "react-redux";

import CryptCarCoin from '../contracts/CryptCarCoin.json';
import CryptCar from '../contracts/CryptCar.json';
import Loader from '../components/loader';
import { useEffect } from 'react';
import { setData } from './global_state';

export default function EthInitializer(props) {

    const CryptCarCoinAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
    const CryptCarAddress = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";

    const globalData = useSelector(state => state.global.data);
    const dispatch = useDispatch();

    useEffect(() => {
        (() => {
            initializeEthereumContract();
        })();
    }, []);

    async function initializeEthereumContract() {
        if (globalData && globalData.eth) {
            return;
        }

        props.setEthLoaded(false);

        const account = await requestAccount();
        const { token, contract } = await initializeContracts();
        const registered = await isUserRegistered(contract, account);

        dispatch(setData({ ...globalData, eth: { account, token, contract, registered } }));

        props.setEthLoaded(true);
    }

    async function requestAccount() {
        const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
        return account[0];
    }

    async function initializeContracts() {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const token = new ethers.Contract(CryptCarCoinAddress, CryptCarCoin.abi, signer);
        const contract = new ethers.Contract(CryptCarAddress, CryptCar.abi, signer);
        
        return {
            token,
            contract
        }
    }

    async function isUserRegistered(contract, account) {
        try {
            const user = await contract.getRenter(account);
            return user[2].toLowerCase() === account.toLowerCase();
        } catch (e) {
            return false;
        }
    }

    return (
        <Loader color='#000000' />
    )
}