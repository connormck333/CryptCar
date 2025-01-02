import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/fontawesome-free-solid'
import "../styles/modal.css";

function Modal(props) {

    const [visible, setVisible] = props.visible;

    if (!visible) {
        return;
    }

    return (
        <div className="modal-bg">
            <div className="modal-container">
                <div className="close" onClick={() => setVisible(false)}>
                    <FontAwesomeIcon color="#000" icon={faTimes} />
                </div>
                <div className="modal">
                    { props.children }
                </div>
            </div>
        </div>
    );
}

export default Modal;