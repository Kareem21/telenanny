import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NannyList from './components/NannyList';
import NannyForm from './components/NannyForm';
import NannyDashboard from './components/NannyDashboard';
import NannySeekerForm from './components/NannySeekerForm';
import HomePage from './components/HomePage';
import JobPosting from './components/Jobposting';
import './App.css';

const API_URL = 'https://server-1prf.onrender.com';

function App() {
    const [userType, setUserType] = useState(null);
    const [nannies, setNannies] = useState([]);
    const [filteredNannies, setFilteredNannies] = useState([]);
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        fetchNannies();
    }, []);

    const fetchNannies = async () => {
        try {
            const response = await fetch(`${API_URL}/api/nannies`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setNannies(data);
            setFilteredNannies(data);
        } catch (error) {
            console.error('Error fetching nannies:', error);
        }
    };

    const handleSearch = (searchParams) => {
        let filtered = [...nannies];

        if (searchParams.query) {
            filtered = filtered.filter(nanny =>
                nanny.name.toLowerCase().includes(searchParams.query.toLowerCase()) ||
                nanny.location.toLowerCase().includes(searchParams.query.toLowerCase())
            );
        }

        if (searchParams.languages?.length) {
            filtered = filtered.filter(nanny =>
                searchParams.languages.some(lang =>
                    nanny.languages.includes(lang)
                )
            );
        }

        if (searchParams.minRate) {
            filtered = filtered.filter(nanny =>
                nanny.rate >= parseInt(searchParams.minRate)
            );
        }

        if (searchParams.maxRate) {
            filtered = filtered.filter(nanny =>
                nanny.rate <= parseInt(searchParams.maxRate)
            );
        }

        setFilteredNannies(filtered);
    };

    const addJob = (newJob) => {
        setJobs((prevJobs) => [...prevJobs, newJob]);
    };

    return (
        <Router>
            <div className="app">
                <Navbar userType={userType} onUserTypeChange={setUserType} />
                <main className="main-content">
                    <Routes>
                        <Route
                            path="/"
                            element={<HomePage onUserTypeSelect={setUserType} jobs={jobs} />}
                        />
                        <Route
                            path="/register-nanny"
                            element={<NannyForm onSubmitSuccess={fetchNannies} />}
                        />
                        <Route
                            path="/account"
                            element={<NannyDashboard />}
                        />
                        <Route
                            path="/find-nanny"
                            element={
                                <div className="employer-view">
                                    <NannySeekerForm onSearch={handleSearch} />
                                    <NannyList nannies={filteredNannies} />
                                </div>
                            }
                        />
                        <Route
                            path="/post-job"
                            element={<JobPosting addJob={addJob} />}
                        />
                        <Route
                            path="*"
                            element={
                                <div className="not-found">
                                    <h2>404 - Page Not Found</h2>
                                    <p>The page you're looking for doesn't exist.</p>
                                </div>
                            }
                        />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;