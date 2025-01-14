import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NannyList from './NannyList';

function AllNannies() {
    const [nannies, setNannies] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNannies = async () => {
            try {
                const response = await fetch('https://server-1prf.onrender.com/api/nannies');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
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
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">All Nannies</h1>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <NannyList nannies={nannies} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default AllNannies;
