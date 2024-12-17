import { Home, User, Globe } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

function Navbar({ userType, onUserTypeChange }) {  // Removed user prop since we'll get it from context
    const [language, setLanguage] = useState('EN');
    const [nannyName, setNannyName] = useState('');
    const navigate = useNavigate();
    const { supabase, user } = useAuth();  // Get user from auth context

    useEffect(() => {
        const fetchNannyName = async () => {

            if (user?.id) {
                try {
                    // Using the auth user ID to fetch from nannies table
                    const { data, error } = await supabase
                        .from('nannies')
                        .select('name')
                        .eq('id', user.id)
                        .single();

                    console.log('Supabase query result:', { data, error });

                    if (error) {
                        console.error('Error fetching nanny data:', error);
                        return;
                    }

                    if (data?.name) {
                        console.log('Found nanny name:', data.name);
                        setNannyName(data.name);
                    } else {
                        console.log('No name found in data:', data);
                    }
                } catch (error) {
                    console.error('Exception in fetchNannyName:', error);
                }
            } else {
                console.log('No user ID available in context');
            }
        };

        fetchNannyName();
    }, [user, supabase]);

    // Add debugging log for render
    console.log('Navbar render state:', {
        userFromContext: user?.id,
        nannyName,
        isUserLoggedIn: !!user,
        shouldShowName: !!(user && nannyName)
    });

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
                    {user && nannyName && (
                        <div className="user-profile ml-4 flex items-center">
                            <User size={20} className="text-gray-600" />
                            <span className="ml-2 text-gray-700">{nannyName}</span>
                        </div>
                    )}
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
                                className="nav-button opacity-50 cursor-not-allowed"
                                disabled={true}
                            >
                                I'm looking for a nanny <span className="text-sm">(Coming Soon)</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar