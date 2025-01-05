import "../../styles/main.css";
import Modal from './modal';

export default function DepositModal(props) {

    const [visible, setVisible] = props.visible;
    const { item } = props;
 
    return (
        <Modal
            visible={[visible, setVisible]}
        >
            <form>
                <h4>Renter</h4>
                <p>Currently rented by: Connor McKenzie</p>

                <h4 className="margin-top-20">Manage deposit</h4>
                <h5>Select to return or keep deposit.</h5>
                <div className="row align-center">
                    <button onClick={() => {}} className="info-btn">Keep</button>
                    <button onClick={() => {}} className="rent-btn margin-left-20 bold">Return</button>
                </div>
            </form>
        </Modal>
    );
}