import { useState } from "react";
import { FormControlLabel, FormGroup, Checkbox } from '@mui/material';

import { keepDeposit, returnDeposit } from "../../methods/cryptcar";
import "../../styles/main.css";
import Modal from './modal';

export default function DepositModal(props) {

    const { item, carContract } = props;
    const [visible, setVisible] = props.visible;
    const [selection, setSelection] = useState("return");
    const [reason, setReason] = useState("");

    function submit() {
        if (selection === "return") {
            returnDeposit(carContract, Number(item.id), () => returnDepositCallback());
        } else {
            if (reason.length < 5) {
                return alert("Please provide a valid reason for keeping deposit.");
            }
            keepDeposit(carContract, Number(item.id), reason, () => keepDepositCallback());
        }

        setReason("");
        setSelection("return");
    }

    function returnDepositCallback() {
        alert("Deposit has been returned to renter.");
        setVisible(false);
    }

    function keepDepositCallback() {
        alert("Deposit has been added to your balance");
        setVisible(false);
    }
 
    return (
        <Modal
            visible={[visible, setVisible]}
        >
            <form>
                <h4>Renter</h4>
                <p>Currently rented by: Connor McKenzie</p>

                <h4 className="margin-top-20">Manage deposit</h4>
                <h5 className="padding-0">Select to return or keep deposit.</h5>
                <div>
                    <FormGroup>
                        <FormControlLabel
                            label="Return deposit"
                            checked={selection === "return"}
                            control={
                                <Checkbox
                                    size="small"
                                    onChange={() => setSelection("return")}
                                />
                            }
                        />
                        <FormControlLabel
                            label="Keep deposit"
                            checked={selection === "keep"}
                            control={
                                <Checkbox
                                    size="small"
                                    onChange={() => setSelection("keep")}
                                />
                            }
                        />
                        </FormGroup>
                </div>
                {
                    selection === "keep" &&
                    <textarea
                        placeholder="Reason for keeping deposit..."
                        value={reason}
                        onChange={({target}) => setReason(target.value)}
                    />
                }
                <button type="button" onClick={submit} className="rent-btn margin-top-20 bold">Confirm</button>
            </form>
        </Modal>
    );
}