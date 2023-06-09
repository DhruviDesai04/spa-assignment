import React from "react";

import Home from './components/Home/Home';

import { Route, Routes, Navigate } from "react-router-dom";


const Routers = () => {
    return (
        <div>
            <Routes>
                <Route index exact path="/" element={<Home />} />

                {/* Temporary 404 component */}
                <Route path="*" element={<h1>Not Found</h1>} />

                {/* initially redirect to /home */}
                <Route path="/" element={<Navigate replace to="/" />} />
            </Routes>
        </div>
    )
}

export default Routers;