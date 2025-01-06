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

    // 1) Fetch Nannies (already exists)
    useEffect(() => {
        fetchNannies();
        // ALSO fetch job postings
        fetchJobPostings();
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

    // 2) Fetch Job Postings from your Node server route
    const fetchJobPostings = async () => {
        try {
            const response = await fetch(`${API_URL}/api/jobpostings`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setJobs(data); // store in state
        } catch (error) {
            console.error('Error fetching job postings:', error);
        }
    };

    // Nanny filtering logic...
    const handleSearch = (searchParams) => {
        let filtered = [...nannies];
        // filter logic for nannies...
        setFilteredNannies(filtered);
    };

    // Called from JobPosting.jsx after a successful new post
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
                            element={
                                <>
                                    {/* Pass 'jobs' to HomePage so it can display them */}
                                    <HomePage onUserTypeSelect={setUserType} jobs={jobs} />

                                    <h2 className="text-2xl font-bold text-center my-8">
                                        Active Nannies
                                    </h2>
                                    <NannyList nannies={filteredNannies} />
                                </>
                            }
                        />
                        <Route
                            path="/register-nanny"
                            element={<NannyForm onSubmitSuccess={fetchNannies} />}
                        />
                        <Route path="/account" element={<NannyDashboard />} />
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
