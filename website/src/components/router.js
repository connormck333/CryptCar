import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router";

import App from '../App';
import Register from '../screens/register';
import EthInitializer from "../methods/eth_initializer";

export default function Router(props) {

    const [ethLoaded, setEthLoaded] = useState(false);
    
    return (
        <BrowserRouter>
            {
                ethLoaded ? (
                    <Routes>
                        <Route path="/" element={<App />} />
                        <Route path="/register" element={<Register />} />
                    </Routes>
                ) : (
                    <EthInitializer setEthLoaded={setEthLoaded} />
                )
            }
        </BrowserRouter>
    );
}