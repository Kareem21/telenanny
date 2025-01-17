// src/App.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import AllNannies from "./components/AllNannies";
import JobPosting from "./components/JobPosting";
import NannyForm from "./components/NannyForm";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AllPostings from "./components/AllPostings";
import "./App.css"; // Global styles

function App() {
    return (
        <Router>
            <Navbar></Navbar>
            <Routes>

                <Route path="/" element={<HomePage/>}/>
                <Route path="/allnannies" element={<AllNannies/>}/>
                <Route path="/jobform" element={<JobPosting/>}/>
                <Route path="/nannyform" element={<NannyForm/>}/>
                <Route path="/allpostings" element={<AllPostings />} />

            </Routes>
            <a
                href="https://wa.me/+971585639166"
                className="floating-whatsapp"
                target="_blank"
                rel="noopener noreferrer"
            >
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/5/5e/WhatsApp_icon.png"
                    alt="WhatsApp"
                />
            </a>
            <Footer></Footer>
        </Router>
    );
}

export default App;
