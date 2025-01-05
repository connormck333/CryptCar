import "../../styles/main.css";
import Modal from "./modal";

function InfoModal(props) {

    const [visible, setVisible] = props.visible;
    const { item } = props;

    return (
        <Modal
            visible={[visible, setVisible]}
        >
            { visible ?
                <div>
                    <img src={item.imageURL} alt={item.brand} />
                    <div className="content">
                        <div className="row align-center space-between">
                            <h4>{ item.brand } { item.model }</h4>
                            <h5>CC${ item.pricePerDay } /day</h5>
                        </div>
                        <p>{ item.description }</p>
                        <ul>
                            <li>Deposit: { item.depositAmount }</li>
                            <li>Location: { item.location }</li>
                        </ul>
                        <h5 style={{paddingBottom: 5, paddingTop: 5}}>Terms & Conditions</h5>
                        <p>{ item.termsAndConditions }</p>
                        <div className="margin-top-20">
                            <button className="rent-btn">Rent Now</button>
                        </div>
                    </div>
                </div>
                :
                <div />
            }
        </Modal>
    );
}

export default InfoModal