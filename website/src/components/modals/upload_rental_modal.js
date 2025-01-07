import { useState } from "react";
import "../../styles/rental_upload.css";
import Modal from "./modal";
import Loader from "../loader";

function UploadRentalModal(props) {

    const { carContract } = props;
    const [visible, setVisible] = props.visible;
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [imageURL, setImageURL] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [deposit, setDeposit] = useState("");
    const [city, setCity] = useState("");
    const [terms, setTerms] = useState("");
    const [formInvalid, setFormInvalid] = useState(false);
    const [loading, setLoading] = useState(false);

    function lengthCheck(string) {
        if (string.length < 3) {
            console.log(string);
            return false;
        } else if (string.length > 40) {
            console.log(string);
            return false;
        }

        return true;
    }

    function longLengthCheck(string) {
        if (string.length < 3) {
            console.log(string);
            console.log(string.length)
            return false;
        } else if (string.length > 1000) {
            console.log(string)
            console.log(string.length)
            return false;
        }

        return true;
    }

    function numCheck(num) {
        if (typeof num !== "number") {
            console.log(typeof num);
            return false;
        }

        return true;
    }

    function validateInputs() {
        let invalid = false;
        if (!lengthCheck(brand)) {
            invalid = true;
        } else if (!lengthCheck(model)) {
            invalid = true;
        } else if (!longLengthCheck(imageURL)) {
            invalid = true;
        } else if (!numCheck(parseFloat(price))) {
            invalid = true;
        } else if (!numCheck(parseFloat(deposit))) {
            invalid = true;
        } else if (!lengthCheck(city)) {
            invalid = true;
        }

        if (!longLengthCheck(description)) {
            invalid = true;
        } else if (!longLengthCheck(terms)) {
            invalid = true;
        }

        if (invalid) {
            setFormInvalid(true);
            return false;
        }

        return true;
    }

    function submit() {
        setFormInvalid(false);
        const valid = validateInputs();
        if (!valid) {
            return;
        }

        setLoading(true);
        const _price = parseInt(price);
        const _deposit = parseInt(deposit);
        carContract.registerCarForRental(
            brand,
            model,
            imageURL,
            description,
            _price,
            _deposit,
            terms,
            city
        ).then(() => {
            alert("Your car is now available for rental!");
        }).catch(() => {
            alert("There was an error. Please try again later.");
        }).finally(() => {
            setVisible(false);
            setLoading(false);
            resetForm();
        });
    }

    function resetForm() {
        setBrand("");
        setModel("");
        setImageURL("");
        setDescription("");
        setPrice("");
        setDeposit("");
        setCity("");
        setTerms("");
    }

    return (
        <Modal
            visible={[visible, setVisible]}
        >
            <form>
                <h4>Upload Car for Rental</h4>
                <h5>Submit the following details</h5>
                <label>Brand</label>
                <input
                    placeholder="e.g. Ferrari"
                    value={brand}
                    onChange={({target}) => setBrand(target.value)}
                ></input>
                <label>Model</label>
                <input
                    placeholder="e.g. LaFerrari"
                    value={model}
                    onChange={({target}) => setModel(target.value)}
                ></input>
                <label>Image URL</label>
                <input
                    placeholder="Must be a URL"
                    value={imageURL}
                    onChange={({target}) => setImageURL(target.value)}
                ></input>
                <label>Description</label>
                <textarea
                    placeholder="Include important stats such as horsepower, torque, year, etc"
                    value={description}
                    onChange={({target}) => setDescription(target.value)}
                ></textarea>
                <label>Price per day (CC$)</label>
                <input
                    type="number"
                    value={price}
                    onChange={({target}) => setPrice(target.value)}
                ></input>
                <label>Deposit (CC$)</label>
                <input
                    type="number"
                    value={deposit}
                    onChange={({target}) => setDeposit(target.value)}
                ></input>
                <label>City/Town</label>
                <input
                    placeholder="e.g. London"
                    value={city}
                    onChange={({target}) => setCity(target.value)}
                ></input>
                <label>Terms & Conditions</label>
                <textarea
                    value={terms}
                    onChange={({target}) => setTerms(target.value)}
                ></textarea>
                {
                    formInvalid &&
                    <label className="error-label">Invalid form</label>
                }
                <button type="button" onClick={() => submit()} className="rent-btn margin-top-20">
                    { loading ? <Loader /> : "Submit" }
                </button>
            </form>
        </Modal>
    );
}

export default UploadRentalModal