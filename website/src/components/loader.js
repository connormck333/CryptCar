import { useEffect } from "react";
import "../styles/loader.css";

function Loader(props) {

    useEffect(() => {
        (() => {
            if (props.color) {
                const e = document.getElementById("loader");
                e.style = {...e.style, color: props.color + "!"};
            }
        })();
    }, []);

    return (
        <div id="loader" class="loader"></div>
    );
}

export default Loader;