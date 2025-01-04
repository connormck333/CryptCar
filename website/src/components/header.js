import "../styles/header.css";
import logo from "../assets/logo_no_bg.png";

function Header(props) {

    return (
        <div className="header">
            <a href="/">
                <div className="logo">
                    <img alt="CryptCar Logo" src={logo} />
                    <h2>CryptCar</h2>
                </div>
            </a>
            <nav>
                <ul className="nav-links">
                    <li><a href="/">Inventory</a></li>
                    <li><a href="#">My Rentals</a></li>
                    { !props.registered &&
                        <li><a href="/register">Register</a></li>
                    }
                    <li className="balance-container">
                        <button className="balance">CC${ props.balance }</button>
                    </li>
                    {props.dropdownDisabled != true &&
                        <Dropdown {...props} />
                    }
                </ul>
                <div className="menu-icon" onClick={() => {}}>
                    <div className="menu-line"></div>
                    <div className="menu-line"></div>
                    <div className="menu-line"></div>
                </div>
            </nav>
        </div>
    );
}

function Dropdown(props) {

    const [uploadRentalModalOpen, setUploadRentalModalOpen] = props.uploadRentalModal;
    const [buyCoinsModalOpen, setBuyCoinsModalOpen] = props.buyCoinsModal;

    return (
        <div className="dropdown">
            <button onClick={() => setUploadRentalModalOpen(true)}>Rent My Car</button>
            <button onClick={() => setBuyCoinsModalOpen(true)}>Buy CryptCarCoins</button>
        </div>
    );
}

export default Header;