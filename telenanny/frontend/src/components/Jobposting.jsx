import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// No need to import useAuth if not required. Remove if you don't need session/user info.
 import { useAuth } from './AuthContext';

function JobPosting({ addJob }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        rate: '',
        location: '',
        kidsCount: '',
        notes: '',
        contactEmail: '',
        contactPhone: '',
        employerName: '',
        captchaAnswer: '', // for the captcha
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Simple captcha check
        if (formData.captchaAnswer.trim() !== '9') {
            alert('Captcha incorrect. Please try again.');
            return;
        }

        try {
            // Calculate expiration date (1 month from now)
            const expiryDate = new Date();
            expiryDate.setMonth(expiryDate.getMonth() + 1);

            // Insert the new job posting into Supabase
            const { data, error } = await supabase
                .from('postings')
                .insert([
                    {
                        rate: parseInt(formData.rate, 10),
                        location: formData.location,
                        kids_count: parseInt(formData.kidsCount, 10),
                        notes: formData.notes,
                        employer_name: formData.employerName,
                        contact_email: formData.contactEmail,
                        contact_phone: formData.contactPhone,
                        expiry_date: expiryDate.toISOString(),
                        status: 'active',
                    },
                ])
                .select()
                .single();

            if (error) throw error;

            // Add the newly created job to the homepage feed, if addJob is provided
            if (addJob) {
                addJob(data);
            }

            // Redirect to a success page (ensure that route exists)
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
                        placeholder="e.g. Looking for someone with CPR training, good with toddlers..."
                    />
                </div>

                {/* Simple Captcha */}
                <div className="form-group">
                    <label htmlFor="captchaAnswer">What is 4 + 5?</label>
                    <input
                        type="text"
                        id="captchaAnswer"
                        value={formData.captchaAnswer}
                        onChange={handleChange}
                        placeholder="Enter the sum here"
                        required
                    />
                </div>

                <button type="submit" className="btn-primary">Submit Job Post</button>
            </form>
        </div>
    );
}

export default JobPosting;
