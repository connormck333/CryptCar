import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";

import '../styles/register.css';
import '../styles/main.css';
import '../App.css';

import Header from '../components/header';
import { loadAccountBalance } from '../methods/coin';
import Loader from '../components/loader';
import { setData } from '../components/global_state';

export default function Register(props) {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const globalData = useSelector(state => state.global.data);

	const account = globalData.eth.account;
	const coinContract = globalData.eth.token;
	const carContract = globalData.eth.contract;

    const [balance, setBalance] = useState(0);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (() => {
            if (globalData.eth.registered) {
                navigate("/");
                return;
            }
            loadBalance();
        })();
    }, []);

    async function loadBalance() {
        setBalance(await loadAccountBalance(coinContract, account));
    }

    function registerUser() {
        // Validate
        if (!validateName(firstName)) {
            alert("Please enter a valid first name");
            return;
        } else if (!validateName(lastName)) {
            alert("Please enter a valid last name");
            return;
        }

        setLoading(true);

        carContract.registerForRenting(firstName, lastName)
            .then(() => {
                dispatch(setData({...globalData, eth: {...globalData.eth, registered: true}}));
                setLoading(false);
                navigate("/");
            })
            .catch(() => {
                alert("Failed to register. Please try again later");
                setLoading(false);
            });
        
    }

    function validateName(name) {
        return name.length >= 2 && name.length <= 30;
    }

    return (
        <>
            <Header
                balance={balance}
                dropdownDisabled={true}
                registered={false}
            />
            <section className='register-container img-bg'>
                <div className='register overlay-light'>
                    <div className='register-form'>
                        <form>
                            <div className='titles'>
                                <h1>Register</h1>
                                <h3>Sign up now to start renting your dream cars!</h3>
                            </div>
                            <label>First Name</label>
                            <input
                                value={firstName}
                                onChange={({ target }) => setFirstName(target.value)}
                            ></input>
                            <label>Last Name</label>
                            <input
                                value={lastName}
                                onChange={({ target }) => setLastName(target.value)}
                            ></input>
                            
                            <button type='button' onClick={() => registerUser()}>
                                { loading ?
                                    <Loader />
                                    :
                                    "Register"
                                }
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}