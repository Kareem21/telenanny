// Navbar.jsx
import { Home, User, Globe } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

function Navbar({ userType, onUserTypeChange, user }) {
    const [language, setLanguage] = useState('EN');
    const navigate = useNavigate();
    const { supabase } = useAuth();

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'EN' ? 'RU' : 'EN');
    };

    const handleNannyClick = () => {
        onUserTypeChange('NANNY');
        navigate('/register-nanny');
    };

    const handleEmployerClick = () => {
        onUserTypeChange('EMPLOYER');
        navigate('/find-nanny');
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="nav-content">
                <div className="nav-left">
                    <Link to="/" className="logo-link">
                        <h1>Dubai Nannies</h1>
                    </Link>
                </div>

                <button
                    onClick={toggleLanguage}
                    className="language-toggle"
                >
                    <Globe size={20} />
                    {language}
                </button>

                <div className="nav-right">
                    {user ? (
                        <div className="user-menu">
                            <Link to="/account" className="account-link">
                                <User size={20} className="user-icon" />
                                <span>{user.email}</span>
                            </Link>
                            <button
                                onClick={handleSignOut}
                                className="signout-button"
                            >
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <div className="navbar-buttons">
                            <button
                                onClick={handleNannyClick}
                                className="nav-button"
                            >
                                I'm a nanny
                            </button>
                            <button
                                onClick={handleEmployerClick}
                                className="nav-button"
                            >
                                I'm looking for a nanny
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar