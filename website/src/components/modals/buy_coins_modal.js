import { useState } from "react";
import { ethers } from "ethers";
import "../../styles/rental_upload.css";
import Modal from "./modal";
import Loader from "../loader";

function BuyCoinsModal(props) {

    const [visible, setVisible] = props.visible;
    const [amount, setAmount] = useState();
    const [loading, setLoading] = useState(false);
    const contract = props.coinContract;

    async function submit() {

        if (loading) {
            return;
        }

        try {
            setLoading(true);

            await contract.buy({
                value: ethers.parseUnits((parseInt(amount) * 5).toString(), "wei")
            });

            await props.updateAccountBalance();

            setVisible(false);
        } catch (err) {
            alert("There was an error. Please try again later.");
        }

        setLoading(false);
    }

    return (
        <Modal
            visible={[visible, setVisible]}
        >
            <form>
                <h4>Buy CryptCarCoins</h4>
                <h5>Amount (CC$):</h5>
                <input
                    type="number"
                    value={amount}
                    onChange={({ target }) => setAmount(target.value)}
                    placeholder="CC$ 10"
                ></input>
                <button type="button" onClick={() => submit()} className="rent-btn margin-top-20">{ loading ? <Loader /> : "Submit" }</button>
            </form>
        </Modal>
    );
}

export default BuyCoinsModal;