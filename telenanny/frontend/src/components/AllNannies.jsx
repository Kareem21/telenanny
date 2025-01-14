import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NannyList from './NannyList';
import Navbar from './Navbar';
import Footer from './Footer';

function AllNannies() {
    const [nannies, setNannies] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNannies = async () => {
            try {
                const response = await fetch('http://localhost:5002/api/nannies');
                const data = await response.json();
                setNannies(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching nannies:', error);
                setLoading(false);
            }
        };

        fetchNannies();
    }, []);

    return (
        <div className="all-nannies-page">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">All Nannies</h1>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <NannyList nannies={nannies} />
                )}
            </div>
            <Footer />
        </div>
    );
}

export default AllNannies;
