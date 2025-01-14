import { Home, User, Globe, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

function Navbar({ userType, onUserTypeChange }) {
    const [language, setLanguage] = useState('EN');
    const [nannyName, setNannyName] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { supabase, user } = useAuth();

    useEffect(() => {
        const fetchNannyName = async () => {
            if (user?.id) {
                try {
                    const { data, error } = await supabase
                        .from('nannies')
                        .select('name')
                        .eq('id', user.id)
                        .single();

                    if (error) {
                        console.error('Error fetching nanny data:', error);
                        return;
                    }

                    if (data?.name) {
                        setNannyName(data.name);
                    }
                } catch (error) {
                    console.error('Exception in fetchNannyName:', error);
                }
            }
        };

        fetchNannyName();
    }, [user, supabase]);

    const toggleLanguage = () => {
        setLanguage(prev => (prev === 'EN' ? 'RU' : 'EN'));
    };

    const handleNannyClick = () => {
        onUserTypeChange('NANNY');
        navigate('/register-nanny');
        setIsMenuOpen(false);
    };

    const handleEmployerClick = () => {
        onUserTypeChange('EMPLOYER');
        navigate('/post-job');
        setIsMenuOpen(false);
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/');
        setIsMenuOpen(false);
    };

    return (
        <nav className="bg-white shadow-md w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <h1 className="text-xl font-bold text-gray-800">Dubai Nannies</h1>
                            <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">Beta</span>
                        </Link>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        <button onClick={toggleLanguage} className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:text-gray-900 focus:bg-gray-100">
                            <Globe size={20} className="inline-block mr-1" />
                            {language}
                        </button>
                        {user ? (
                            <div className="ml-3 relative">
                                <div className="flex items-center">
                                    <User size={20} className="text-gray-600 mr-1" />
                                    <span className="text-gray-700 mr-2">{nannyName || user.email}</span>
                                    <button onClick={handleSignOut} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="ml-3 flex items-center">
                                <button onClick={handleNannyClick} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2">
                                    I'm a nanny
                                </button>
                                <button onClick={handleEmployerClick} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                                    I'm looking for a nanny
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out">
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className="sm:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        <button onClick={toggleLanguage} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50 transition duration-150 ease-in-out">
                            <Globe size={20} className="inline-block mr-1" />
                            {language}
                        </button>
                        {user ? (
                            <>
                                <div className="px-3 py-2 text-sm font-medium text-gray-700">
                                    <User size={20} className="inline-block mr-1" />
                                    {nannyName || user.email}
                                </div>
                                <button onClick={handleSignOut} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:text-white focus:bg-red-600 transition duration-150 ease-in-out">
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={handleNannyClick} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:text-white focus:bg-blue-600 transition duration-150 ease-in-out">
                                    I'm a nanny
                                </button>
                                <button onClick={handleEmployerClick} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:text-white focus:bg-green-600 transition duration-150 ease-in-out">
                                    I'm looking for a nanny
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar
