// src/pages/AllPostings.jsx
import React, { useEffect, useState } from 'react';
import './AllPostings.css';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

function AllPostings() {
    const [jobPostings, setJobPostings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobPostings = async () => {
            try {
                const { data, error } = await supabase
                    .from('jobpostings')
                    .select('*');
                if (!error && data) {
                    setJobPostings(data);
                }
            } catch (error) {
                console.error('Error fetching job postings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobPostings();
    }, []);

    return (
        <div className="allpostings-container">
            <h2>All Job Postings</h2>

            {loading ? (
                <p>Loading job postings...</p>
            ) : (
                <div className="jobs-grid">
                    {jobPostings.map((job) => (
                        <div className={`job-card ${job.is_premium ? 'premium' : ''}`} key={job.id}>
                            <div className="job-header">
                                <h3>{job.employer_name}</h3>
                                {job.is_premium && <span className="premium-badge">Premium</span>}
                            </div>
                            <div className="job-details">
                                <p><strong>Rate:</strong> {job.rate}</p>
                                <p><strong>Kids:</strong> {job.kids_count}</p>
                                <p><strong>Job Type:</strong> {job.job_type}</p>
                                <p><strong>Location:</strong> {job.location || 'Not specified'}</p>
                                <p className="job-notes"><strong>Notes:</strong> {job.notes}</p>
                            </div>
                            <div className="contact-btn-wrapper">
                                <a href={`mailto:${job.contact_email}`} className="contact-btn">Apply Now</a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AllPostings;