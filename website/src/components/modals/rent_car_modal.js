import { useState } from "react";
import "../../styles/rental_upload.css";
import Loader from "../loader";
import Modal from "./modal";

function RentCarModal(props) {

    const { car, carContract } = props;
    const [visible, setVisible] = props.visible;
    const [days, setDays] = useState();
    const [cost, setCost] = useState("0");
    const [loading, setLoading] = useState(false);

    function _setDays(val) {
        setDays(val);
        setCost((parseInt(val) * car.pricePerDay).toString());
    }

    function submit() {
        
        if (loading) return;

        setLoading(true);

        const today = new Date(Date.now());
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);

        const endDate = new Date(today.getTime());
        endDate.setDate(endDate.getDate() + parseInt(days));

        console.log(Number(car.id), today.getTime() / 1000, endDate.getTime() / 1000);
        // return;

        carContract.rentCar(Number(car.id), Math.floor(today.getTime() / 1000), Math.floor(endDate.getTime() / 1000), {gasLimit: 3000000})
            .then(() => {
                alert("Car rental successful!");
                setVisible(false);
            })
            .catch((e) => {
                console.log(e);
                alert("Could not rent car. Please try again later.");
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <Modal
            visible={[visible, setVisible]}
        >
            <form>
                <h4>Rent a car</h4>
                <h5>Review the following info before renting</h5>
                <label>Amount of days:</label>
                <input
                    type="number"
                    value={days}
                    onChange={({ target }) => _setDays(target.value)}
                    placeholder="2 days"
                ></input>
                <p className="info">Cost: CC${ cost }</p>
                <p className="info">Deposit: CC${ car ? car.depositAmount : "" }</p>
                <button type="button" onClick={() => submit()} className="rent-btn margin-top-20">{ loading ? <Loader /> : "Rent Now" }</button>
            </form>
        </Modal>
    );
}

export default RentCarModal;