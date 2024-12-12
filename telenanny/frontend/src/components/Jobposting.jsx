// src/components/JobPosting.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function JobPosting() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        rate: '',
        location: '',
        kidsCount: '',
        notes: '',
        contactEmail: '',
        contactPhone: '',
        employerName: '',
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Calculate expiration date (1 month from now)
            const expiryDate = new Date();
            expiryDate.setMonth(expiryDate.getMonth() + 1);

            // Insert into Supabase
            const { data, error } = await supabase
                .from('postings')
                .insert([
                    {
                        rate: parseInt(formData.rate),
                        location: formData.location,
                        kids_count: parseInt(formData.kidsCount),
                        notes: formData.notes,
                        employer_name: formData.employerName,
                        contact_email: formData.contactEmail,
                        contact_phone: formData.contactPhone,
                        expiry_date: expiryDate.toISOString(),
                        status: 'active'
                    }
                ])
                .select()
                .single();

            if (error) throw error;

            // Store posting ID in local storage for reference
            localStorage.setItem('lastPosting', data.id);

            // Redirect to success page
            navigate(`/posting-success/${data.id}`);
        } catch (error) {
            console.error('Error creating posting:', error);
            alert('Failed to create posting. Please try again.');
        }
    };

    return (
        <div className="job-posting-container">
            <h1>Post Your Job</h1>
            <p>It's free for the first month. After that, it's 99 AED per post (valid for 1 month).</p>

            <form onSubmit={handleSubmit} className="job-posting-form">
                <div className="form-group">
                    <label htmlFor="employerName">Your Name:</label>
                    <input
                        type="text"
                        id="employerName"
                        value={formData.employerName}
                        onChange={handleChange}
                        placeholder="Your full name"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="contactEmail">Contact Email:</label>
                    <input
                        type="email"
                        id="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="contactPhone">Contact Phone:</label>
                    <input
                        type="tel"
                        id="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleChange}
                        placeholder="Your phone number"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="rate">Rate you're offering (AED/month):</label>
                    <input
                        type="number"
                        id="rate"
                        value={formData.rate}
                        onChange={handleChange}
                        placeholder="e.g. 5000"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="location">Your Location:</label>
                    <input
                        type="text"
                        id="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g. Dubai Marina"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="kidsCount">Number of Kids:</label>
                    <input
                        type="number"
                        id="kidsCount"
                        value={formData.kidsCount}
                        onChange={handleChange}
                        placeholder="e.g. 2"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="notes">Additional Notes / Requirements (optional):</label>
                    <textarea
                        id="notes"
                        value={formData.notes}
                        onChange={handleChange}
                    Ï    placeholder="e.g. Looking for someone with CPR training, good with toddlers..."
                    />
                </div>

                <button type="submit" className="btn-primary">Submit Job Post</button>
            </form>
        </div>
    );
}

export default JobPosting;