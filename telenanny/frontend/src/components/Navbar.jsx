import { Home, User } from 'lucide-react'
import { useState } from 'react'
// In your Navbar.jsx
function Navbar({ userType, onUserTypeChange }) {
    return (
        <nav className="navbar">
            <div className="nav-content">
                <a href="/" className="logo-link">
                    <h1>TeleNanny</h1>
                </a>

                <div className="navbar-buttons">
                    <button onClick={() => onUserTypeChange('NANNY')}>
                        I'm a nanny
                    </button>
                    <button onClick={() => onUserTypeChange('EMPLOYER')}>
                        I'm looking for a nanny
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar