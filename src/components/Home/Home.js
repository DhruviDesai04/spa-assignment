import React from "react";
import Navbars from "./Navbars/index";
import Items from "./Items/index";
import './Home.css';

const Home = () => {
    return (
        <section className="home" id="home">
            <div className="home-content">
                <div className="main-container">
                    <Navbars />
                    <Items />
                </div>
            </div>
        </section>
    )
}

export default Home;