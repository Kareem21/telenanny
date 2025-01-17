// HomePage.jsx
import React, { useEffect, useState } from 'react';
import './HomePage.css';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://ejbiorpholetwkprfrfj.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqYmlvcnBob2xldHdrcHJmcmZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2NzMxMTUsImV4cCI6MjA0OTI0OTExNX0.5-YNb6hjUmkvI1VXpcsItaUbQopiYlq7wdgjNsjEXEo'
);

function HomePage() {
    const [featuredNannies, setFeaturedNannies] = useState([]);
    const [featuredJobs, setFeaturedJobs] = useState([]);
    const [loadingNannies, setLoadingNannies] = useState(true);
    const [loadingJobs, setLoadingJobs] = useState(true);

    useEffect(() => {
        // Fetch job postings
        const fetchJobs = async () => {
            try {
                const { data, error } = await supabase
                    .from('jobpostings')
                    .select('*')
                    .limit(8);
                if (error) {
                    console.error('Error fetching job postings:', error);
                } else {
                    setFeaturedJobs(data || []);
                }
            } catch (error) {
                console.error('Unexpected error fetching job postings:', error);
            } finally {
                setLoadingJobs(false);
            }
        };

        // Fetch featured nannies
        const fetchNannies = async () => {
            try {
                const nannyIds = [
                    '74bcea78-fddb-4ccf-8c82-17310a8e7f81',
                    '488fd053-6c91-4335-8ce9-e23b86b05378',
                    '5e9abb4f-836c-4192-bb86-a4db780283de',
                    '3ccdd1cc-2108-499e-ac5f-91827ca2a5e6',
                    '6b5eb052-36cd-451c-9ba1-f96f01c54d8b',
                    'fe2b3a25-ab55-41d1-bc4d-fcbe84edf683',
                    'c51fd2bc-7fef-4e4d-9f54-2082b65e51ba',
                    '9ee1b742-18d2-49d4-9b69-d9ffeb0f5842'
                ];
                const { data, error } = await supabase
                    .from('nannies')
                    .select('*')
                    .in('user_id', nannyIds);
                if (error) {
                    console.error('Error fetching nannies:', error);
                } else {
                    setFeaturedNannies(data || []);
                }
            } catch (error) {
                console.error('Unexpected error fetching nannies:', error);
            } finally {
                setLoadingNannies(false);
            }
        };

        fetchJobs();
        fetchNannies();
    }, []);

    const goldJobs = featuredJobs.slice(0, 3);
    const regularJobs = featuredJobs.slice(3);

    return (
        <main className="home-container">
            {/* HERO SECTION */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Welcome to Dubai Nannies</h1>
                    <p>Trusted by over 3000 families in the UAE.</p>
                    <div className="hero-buttons">
                        <a href="/jobform" className="hero-btn">I'm looking for a nanny</a>
                        <a href="/nannyform" className="hero-btn alt">I'm a nanny</a>
                    </div>
                </div>
            </section>

            {/* JOB POSTINGS SECTION */}
            <section id="job-postings" className="job-postings-section">
                <h2>Job Postings</h2>
                {loadingJobs ? (
                    <p>Loading jobs...</p>
                ) : (
                    <div className="jobs-container">
                        {/* Golden (Premium) Jobs */}
                        <div className="golden-jobs">
                            <h3 className="premium-label">Premium Listings</h3>
                            <div className="golden-jobs-grid">
                                {goldJobs.map((job) => (
                                    <div className="rss-item featured" key={job.id}>
                                        <h3>{job.employer_name}</h3>
                                        <p><strong>Rate:</strong> {job.rate}</p>
                                        <p><strong>Kids:</strong> {job.kids_count}</p>
                                        <p><strong>Job Type:</strong> {job.job_type}</p>
                                        <p><strong>Notes:</strong> {job.notes}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Regular Jobs */}
                        <div className="regular-jobs">
                            <div className="divider">
                                <span></span>
                            </div>
                            <div className="regular-jobs-grid">
                                {regularJobs.map((job) => (
                                    <div className="rss-item" key={job.id}>
                                        <h3>{job.employer_name}</h3>
                                        <p><strong>Rate:</strong> {job.rate}</p>
                                        <p><strong>Kids:</strong> {job.kids_count}</p>
                                        <p><strong>Job Type:</strong> {job.job_type}</p>
                                        <p><strong>Notes:</strong> {job.notes}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                <a href="/allpostings" className="show-all-link">View All Job Postings</a>
            </section>

            {/* WHY FAMILIES CHOOSE US */}
            <section className="why-families-choose-us">
                <h2>Why Families Choose Us</h2>
                <div className="features-grid">
                    <div className="feature-item">
                        <h3>💬 Communication</h3>
                        <p>Quick and thorough responses for families and nannies alike.</p>
                    </div>
                    <div className="feature-item">
                        <h3>🔒 Screening</h3>
                        <p> Dubai nannies only allows quality candidates, that align with the people in our telegram group.</p>
                    </div>
                    <div className="feature-item">
                        <h3>💰 Affordable</h3>
                        <p>Only 200 AED for premium job listings that last 1 month and guarantee you find a good nanny for your family.</p>
                    </div>
                    <div className="feature-item">
                        <h3>❤️ Love & Care</h3>
                        <p>We genuinely care about families, children, and nannies.</p>
                    </div>
                </div>
            </section>

            <section id="nanny-cards" className="nanny-cards-section">
                <h2>Featured Nannies</h2>
                {loadingNannies ? (
                    <p>Loading nannies...</p>
                ) : (
                    <div className="nanny-grid">
                        {featuredNannies.length > 0 ? (
                            featuredNannies.map((nanny) => (
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
                            ))
                        ) : (
                            <p>No nannies available at the moment.</p>
                        )}
                    </div>
                )}
                <a href="/allnannies" className="show-all-link">Show All 100+ Nannies</a>
            </section>

            {/* REVIEWS SECTION */}
            <section className="reviews-section">
                <h2>What Our Customers Say</h2>
                <p className="reviews-subtitle">Dive into the glowing endorsements from our customers, who've enjoyed our services.</p>

                <div className="reviews-grid">
                    <div className="review-card">
                        <div className="stars">★★★★★</div>
                        <p className="review-text">We were very pleased with our nanny from Dubai Nannies. Their entire process including communication, selection and final placement was excellent. Not only is the service professionally managed, but the functionality is also seamless. Throughout the process, we were very happy with their professionalism and responsiveness. Would highly recommend.</p>
                        <p className="reviewer-name">Fiesty</p>
                    </div>

                    <div className="review-card">
                        <div className="stars">★★★★★</div>
                        <p className="review-text">The team has significantly contributed to our family's happiness by finding us the perfect nanny. Their process added a unique personal touch to our search. Kudos to the team for their professionalism.</p>
                        <p className="reviewer-name">Beneli Sari</p>
                        <p className="reviewer-title">Marketing Manager</p>
                        <p className="reviewer-company">Mysk</p>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default HomePage;