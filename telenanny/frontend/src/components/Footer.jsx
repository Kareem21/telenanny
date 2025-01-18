// src/components/Footer.jsx
import React from 'react';
import './Footer.css';

function Footer() {
    return (
        <footer className="custom-footer">
            <div className="footer-inner">
                {/* Left Column: Logo & Social */}
                <div className="footer-brand">
                    <div className="brand-logo">
                        {/* Fake puzzle icon or your real brand image */}
                        <img
                            alt="Logo"
                        />
                        <h3>Dubai Nannies </h3>
                        <p>Nanny Job board</p>
                    </div>
                    <div className="social-icons">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <img
                                alt="Facebook"
                            />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <img
                                alt="Instagram"
                            />
                        </a>
                        <a href="https://yelp.com" target="_blank" rel="noopener noreferrer">
                            <img
                                alt="Yelp"
                            />
                        </a>
                    </div>
                </div>

                {/* Middle Column: Website */}
                <div className="footer-col">
                    <h4>Website</h4>
                    <ul>
                        <li><a href="/allnannies">Nannies</a></li>
                        <li><a href="/AllPostings">Job postings</a></li>
                        <li><a href="/contact">Contact</a></li>
                    </ul>
                </div>


            </div>

            <div className="footer-bottom">
                &copy; {new Date().getFullYear()} Dubai Nannies . All Rights Reserved.
            </div>
        </footer>
    );
}

export default Footer;
