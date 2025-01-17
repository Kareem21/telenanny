// src/pages/AllNannies.jsx
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './AllNannies.css';

import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

const allLanguages = [
    'English', 'Arabic', 'Russian', 'Filipino', 'Spanish', 'Ukrainian', 'Urdu', 'Italian', 'Other'
];

function AllNannies() {
    const [nannies, setNannies] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter states
    const [filterLang, setFilterLang] = useState('');
    const [filterNationality, setFilterNationality] = useState('');

    useEffect(() => {
        const fetchNannies = async () => {
            let { data, error } = await supabase
                .from('nannies')
                .select('*');
            if (!error && data) {
                setNannies(data);
            }
            setLoading(false);
        };
        fetchNannies();
    }, []);

    // Derived list after filters
    const filteredNannies = nannies.filter(nanny => {
        // Filter by language
        if (filterLang && nanny.languages) {
            if (!nanny.languages.includes(filterLang)) {
                return false;
            }
        }
        // Filter by nationality
        if (filterNationality && nanny.nationality) {
            if (nanny.nationality.toLowerCase() !== filterNationality.toLowerCase()) {
                return false;
            }
        }
        return true;
    });

    return (
        <>
            <div className="allnannies-container">
                <h2>All Nannies</h2>

                {/* Filter UI */}
                <div className="filter-container">
                    <div className="filter-group">
                        <label>Filter by Language:</label>
                        <select
                            value={filterLang}
                            onChange={(e) => setFilterLang(e.target.value)}
                        >
                            <option value="">All Languages</option>
                            {allLanguages.map(lang => (
                                <option key={lang} value={lang}>{lang}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>Filter by Nationality:</label>
                        <input
                            type="text"
                            placeholder="e.g. Russian, Ethiopian"
                            value={filterNationality}
                            onChange={(e) => setFilterNationality(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <p>Loading nannies...</p>
                ) : (
                    <div className="nannies-grid">
                        {filteredNannies.map((nanny) => (
                            <div className="nanny-card" key={nanny.user_id}>
                                <img
                                    src={nanny.profile_image_url || 'https://via.placeholder.com/150'}
                                    alt={nanny.name}
                                />
                                <h3>{nanny.name}</h3>
                                <p><strong>Languages:</strong> {nanny.languages || 'Not specified'}</p>
                                <p><strong>Skills:</strong> {nanny.special_skills || 'Not specified'}</p>
                                <div className="contact-btn-wrapper">
                                    <a href={`https://wa.me/${nanny.phone || ''}`} className="contact-btn">Contact</a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default AllNannies;