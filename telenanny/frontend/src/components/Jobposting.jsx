import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function JobPosting({ addJob }) {
    const navigate = useNavigate();
    const { supabase } = useAuth();

    const [formData, setFormData] = useState({
        employerName: '',
        contactEmail: '',
        contactPhone: '',
        rate: '',
        location: '',
        kidsCount: '',
        notes: '',
        captchaAnswer: '',
        jobType: '',
        liveInOption: '',
        nationality: '',
        drivingLicense: '',
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

        if (formData.captchaAnswer.trim() !== '9') {
            alert('Captcha incorrect. Please try again.');
            return;
        }

        try {
            const expiryDate = new Date();
            expiryDate.setMonth(expiryDate.getMonth() + 1);

            // Insert into 'jobpostings' table
            const { data, error } = await supabase
                .from('jobpostings')
                .insert([
                    {
                        rate: parseInt(formData.rate, 10),
                        location: formData.location,
                        kids_count: parseInt(formData.kidsCount, 10),
                        notes: formData.notes,
                        employer_name: formData.employerName,
                        contact_email: formData.contactEmail,
                        contact_phone: formData.contactPhone,
                        job_type: formData.jobType,
                        live_in_option: formData.liveInOption,
                        nationality: formData.nationality,
                        driving_license: formData.drivingLicense,
                        expiry_date: expiryDate.toISOString(),
                        status: 'active',
                    },
                ])
                .select()
                .single();

            if (error) throw error;

            if (addJob) {
                addJob(data);
            }

            navigate(`/`);
        } catch (error) {
            console.error('Error creating posting:', error);
            alert('Failed to create posting. Please try again.');
        }
    };

    return (
        <div className="job-posting-container">
            <h1>Post Your Job</h1>
            <p>It's free for the first month. After that, it's 200 AED per post (valid for 1 month).</p>

            <form onSubmit={handleSubmit} className="job-posting-form">
                <div className="form-group">
                    <label htmlFor="jobType">Position Type:</label>
                    <select
                        id="jobType"
                        value={formData.jobType}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select position type</option>
                        <option value="maid">Maid</option>
                        <option value="nanny">Nanny</option>
                        <option value="maid+nanny">Maid + Nanny</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="liveInOption">Live in/out:</label>
                    <select
                        id="liveInOption"
                        value={formData.liveInOption}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select work arrangement</option>
                        <option value="live-in">Live In</option>
                        <option value="live-out">Live Out</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="nationality">Nationality Preference:</label>
                    <input
                        type="text"
                        id="nationality"
                        value={formData.nationality}
                        onChange={handleChange}
                        placeholder="e.g. Filipino, Indian, etc."
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="drivingLicense">Driving License Required:</label>
                    <select
                        id="drivingLicense"
                        value={formData.drivingLicense}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select option</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>

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
                    <label htmlFor="rate">Rate (AED/month):</label>
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
                    <label htmlFor="location">Location:</label>
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
                    <label htmlFor="notes">Additional Information:</label>
                    <textarea
                        id="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Additional requirements, responsibilities, or any other relevant information..."
                        rows="5"
                    />
                </div>

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
