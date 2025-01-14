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
import AllNannies from './components/AllNannies';
import './App.css';

const API_URL = 'https://server-1prf.onrender.com';

function App() {
    const [userType, setUserType] = useState(null);
    const [nannies, setNannies] = useState([]);
    const [filteredNannies, setFilteredNannies] = useState([]);
    const [jobs, setJobs] = useState([]);

    // Fetch nannies + job postings once (on mount)
    useEffect(() => {
        fetchNannies();
        fetchJobPostings();
    }, []);

    // 1) Fetch Nannies
    const fetchNannies = async () => {
        try {
            console.log('[CLIENT] Calling fetchNannies()...');
            const response = await fetch(`${API_URL}/api/nannies`);
            console.log('[CLIENT] Nannies Response object:', response);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('[CLIENT] Fetched nannies data:', data);

            setNannies(data);
            setFilteredNannies(data);
        } catch (error) {
            console.error('[CLIENT] Error fetching nannies:', error);
        }
    };

    // 2) Fetch Job Postings
    const fetchJobPostings = async () => {
        try {
            console.log('[CLIENT] Calling fetchJobPostings()...');
            const response = await fetch(`${API_URL}/api/jobpostings`);
            console.log('[CLIENT] JobPostings Response object:', response);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('[CLIENT] Fetched job postings data:', data);

            setJobs(data);
        } catch (error) {
            console.error('[CLIENT] Error fetching job postings:', error);
        }
    };

    // Simple search/filter for nannies
    const handleSearch = (searchParams) => {
        let filtered = [...nannies];

        // Example filter logic; adapt as needed
        if (searchParams.query) {
            filtered = filtered.filter((nanny) =>
                nanny.name.toLowerCase().includes(searchParams.query.toLowerCase()) ||
                nanny.location.toLowerCase().includes(searchParams.query.toLowerCase())
            );
        }

        setFilteredNannies(filtered);
    };

    // Called from <JobPosting> after a successful new job insertion
    const addJob = (newJob) => {
        console.log('[CLIENT] addJob called with:', newJob);
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
                                    <HomePage 
                                        onUserTypeSelect={setUserType} 
                                        jobs={jobs} 
                                        nannies={filteredNannies.slice(0, 5)}
                                    />
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
                            path="/allnannies"
                            element= <AllNannies  />
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
