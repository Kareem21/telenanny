// src/App.jsx
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import NannyList from './components/NannyList'
import NannyForm from './components/NannyForm'
import NannyDashboard from './components/NannyDashboard'
import NannySeekerForm from './components/NannySeekerForm'
import HomePage from './components/HomePage'
import LoginForm from './components/LoginForm'
import { useAuth } from './components/AuthContext'
import './App.css'
import JobPosting from './components/Jobposting' //

// Protected Route Component
function ProtectedRoute({ children }) {
    const { session } = useAuth();
    if (!session) {
        return <Navigate to="/" />;
    }
    return children;
}

function App() {
    const [userType, setUserType] = useState(null)
    const [nannies, setNannies] = useState([])
    const [filteredNannies, setFilteredNannies] = useState([])
    const { session, loading } = useAuth()

    useEffect(() => {
        fetchNannies()
    }, [])

    const fetchNannies = async () => {
        try {
            const response = await fetch('https://server-1prf.onrender.com/api/nannies')
            const data = await response.json()
            setNannies(data)
            setFilteredNannies(data)
        } catch (error) {
            console.error('Error fetching nannies:', error)
        }
    }

    const handleSearch = (searchParams) => {
        let filtered = [...nannies]

        if (searchParams.query) {
            filtered = filtered.filter(nanny =>
                nanny.name.toLowerCase().includes(searchParams.query.toLowerCase()) ||
                nanny.location.toLowerCase().includes(searchParams.query.toLowerCase())
            )
        }

        if (searchParams.languages?.length) {
            filtered = filtered.filter(nanny =>
                searchParams.languages.some(lang =>
                    nanny.languages.includes(lang)
                )
            )
        }
        if (searchParams.minRate) {
            filtered = filtered.filter(nanny =>
                nanny.rate >= parseInt(searchParams.minRate)
            )
        }
        if (searchParams.maxRate) {
            filtered = filtered.filter(nanny =>
                nanny.rate <= parseInt(searchParams.maxRate)
            )
        }

        setFilteredNannies(filtered)
    }

    if (loading) {
        return <div className="loading">Loading...</div>
    }

    return (
        <Router>
            <div className="app">
                <Navbar
                    userType={userType}
                    onUserTypeChange={setUserType}
                />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<HomePage onUserTypeSelect={setUserType} />} />
                        <Route
                            path="/register-nanny"
                            element={
                                session ? <NannyForm onSubmitSuccess={fetchNannies} user={session.user} /> : <LoginForm />
                            }
                        />
                        <Route
                            path="/account"
                            element={
                                <ProtectedRoute>
                                    <NannyDashboard />
                                </ProtectedRoute>
                            }
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
                            path="/login"
                            element={<LoginForm />}
                        />

                        {/* New route for job posting */}
                        <Route
                            path="/post-job"
                            element={<JobPosting />}
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
    )
}

export default App
