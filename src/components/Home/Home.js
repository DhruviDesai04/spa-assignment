import React from "react";

import Navbars from "./Navbars/Navbars";
import './Home.css';

const Home = () => {
    return (
        <section className="home" id="home">
            <Navbars />
            <div className="home-content">
                <div className="main-container">
                    <div className="home-heading d-flex flex-column justify-content-center align-items-center">
                        <h1>Home</h1>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Home;