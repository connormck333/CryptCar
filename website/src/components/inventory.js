import "../styles/main.css";

function Inventory(props) {

    const [inventory, setInventory] = props.inventory;
    const { setSelectedCar } = props;

    function viewMoreInfo(item) {
        setSelectedCar(item);
    }

    return (
        <section>
            <h2 className="title">Our Inventory</h2>
            <h3 className="sub-title">Have a look at our amazing supercar collection. Rent your dream car now!</h3>
            <div className="card-container">
                { inventory.map((item, index) => (
                    <Card
                        item={item}
                        key={index}
                        viewMoreInfo={viewMoreInfo}
                        openRentCarModal={props.openRentCarModal}
                    />
                )) }
            </div>
        </section>
    );
}

function Card(props) {
    
    const { item, viewMoreInfo, openRentCarModal } = props;

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
                    <button onClick={() => viewMoreInfo(item)} className="info-btn">More Info</button>
                    <button onClick={() => openRentCarModal(item)} className="rent-btn">Rent Now</button>
                </div>
            </div>
        </div>
    );
}

export default Inventory;