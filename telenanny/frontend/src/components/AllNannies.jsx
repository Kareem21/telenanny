
// AllNannies.jsx
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
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold text-center mb-8">Available Nannies</h1>
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <NannyList nannies={nannies} />
                )}
            </div>
        </div>
    );
}

export default AllNannies;