import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router";

import Home from '../screens/home';
import Register from '../screens/register';
import EthInitializer from "../methods/eth_initializer";
import Rentals from "../screens/rentals";

export default function Router(props) {

    const [ethLoaded, setEthLoaded] = useState(false);
    
    return (
        <BrowserRouter>
            {
                ethLoaded ? (
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="rentals" element={<Rentals />} />
                    </Routes>
                ) : (
                    <EthInitializer setEthLoaded={setEthLoaded} />
                )
            }
        </BrowserRouter>
    );
}