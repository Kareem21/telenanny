// src/components/JobPosting.jsx
import { useState } from 'react';

function JobPosting() {
    const [rate, setRate] = useState('');
    const [location, setLocation] = useState('');
    const [kidsCount, setKidsCount] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you could send the job post data to your backend
        console.log({ rate, location, kidsCount, notes });
        alert('Job posted successfully (Dummy submission)!');
    };

    return (
        <div className="job-posting-container">
            <h1>Post Your Job</h1>
            <p>It’s free for the first month. After that, it’s 99 AED per post (valid for 1 month).</p>
            <form onSubmit={handleSubmit} className="job-posting-form">
                <div className="form-group">
                    <label htmlFor="rate">Rate you're offering (AED/hour):</label>
                    <input
                        type="number"
                        id="rate"
                        value={rate}
                        onChange={(e) => setRate(e.target.value)}
                        placeholder="e.g. 50"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="location">Your Location:</label>
                    <input
                        type="text"
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Dubai Marina"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="kidsCount">Number of Kids:</label>
                    <input
                        type="number"
                        id="kidsCount"
                        value={kidsCount}
                        onChange={(e) => setKidsCount(e.target.value)}
                        placeholder="e.g. 2"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="notes">Additional Notes / Requirements (optional):</label>
                    <textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. Looking for someone with CPR training, good with toddlers..."
                    />
                </div>

                <button type="submit" className="btn-primary">Submit Job Post</button>
            </form>
        </div>
    );
}

export default JobPosting;
