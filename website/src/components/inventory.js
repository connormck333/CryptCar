import { useState } from "react";
import "../styles/main.css";
import InfoModal from "./modals/info_modal";

function Inventory(props) {

    const [inventory, setInventory] = props.inventory;
    const [selectedCar, setSelectedCar] = props.selectedCar;
    const [infoModalOpen, setInfoModalOpen] = useState(false);
    const { title, subtitle } = props;

    return (
        <section>
            <InfoModal
				visible={[infoModalOpen, setInfoModalOpen]}
				item={selectedCar}
				// openRentCarModal={_setRentCarModalOpen}
			/>
            <h2 className="title">{ title }</h2>
            <h3 className="sub-title">{ subtitle }</h3>
            <div className="card-container">
                { inventory.map((item, index) => (
                    <Card
                        item={item}
                        key={index}
                        setModalOpen={setInfoModalOpen}
                        {...props}
                    />
                )) }
            </div>
        </section>
    );
}

function Card(props) {
    
    const { item, setModalOpen } = props;
    const [selectedCar, setSelectedCar] = props.selectedCar;

    function openInfoModal() {
        setSelectedCar(item);
        setModalOpen(true);
    }

    return (
        <div className="card">
            <img src={item.imageURL} alt={item.brand} />
            <div className="content">
                <div className="row align-center space-between">
                    <h4>{ item.brand } { item.model }</h4>
                    <h5>CC${ item.pricePerDay }/day</h5>
                </div>
                <p>{ item.description }</p>
                <div className="row align-center margin-top-20">
                    <button onClick={() => openInfoModal()} className="info-btn">More Info</button>
                    <button onClick={() => props.button2OnClick(item)} className="rent-btn">{ props.button2Text }</button>
                </div>
            </div>
        </div>
    );
}

export default Inventory;