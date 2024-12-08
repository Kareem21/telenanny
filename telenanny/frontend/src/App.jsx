// App.jsx
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import NannyList from './components/NannyList'
import NannyForm from './components/NannyForm'
import NannySeekerForm from './components/NannySeekerForm'
import HomePage from './components/HomePage'
import './App.css'

function App() {
    const [userType, setUserType] = useState(null) // null, 'NANNY', or 'EMPLOYER'
    const [nannies, setNannies] = useState([])
    const [filteredNannies, setFilteredNannies] = useState([])

    useEffect(() => {
        fetchNannies()
    }, [])

    const fetchNannies = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/nannies')
            const data = await response.json()
            setNannies(data)
            setFilteredNannies(data)
        } catch (error) {
            console.error('Error fetching nannies:', error)
        }
    }

    const handleSearch = (searchParams) => {
        let filtered = [...nannies]

        // Apply filters based on search parameters
        if (searchParams.query) {
            filtered = filtered.filter(nanny =>
                nanny.name.toLowerCase().includes(searchParams.query.toLowerCase()) ||
                nanny.location.toLowerCase().includes(searchParams.query.toLowerCase())
            )
        }

        if (searchParams.languages && searchParams.languages.length > 0) {
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

    const renderContent = () => {
        if (!userType) {
            return <HomePage onUserTypeSelect={setUserType} />
        }

        if (userType === 'NANNY') {
            return <NannyForm onSubmitSuccess={fetchNannies} />
        }

        if (userType === 'EMPLOYER') {
            return (
                <div className="employer-view">
                    <NannySeekerForm onSearch={handleSearch} />
                    <NannyList nannies={filteredNannies} />
                </div>
            )
        }
    }

    return (
        <div className="app">
            <Navbar
                userType={userType}
                onUserTypeChange={setUserType}
            />
            <main className="main-content">
                {renderContent()}
            </main>
        </div>
    )
}

export default App