import React, { useState } from 'react';
import './Jobposting.css';

import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
    'https://ejbiorpholetwkprfrfj.supabase.co',  // <-- Replace with your real URL
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqYmlvcnBob2xldHdrcHJmcmZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2NzMxMTUsImV4cCI6MjA0OTI0OTExNX0.5-YNb6hjUmkvI1VXpcsItaUbQopiYlq7wdgjNsjEXEo' // <-- Replace with your real anon key
);
function JobPosting() {
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
        isPremium: false,
    });

    // A simple numeric CAPTCHA example
    const [captchaQuestion] = useState({
        question: '3 + 5 = ?',
        correctAnswer: '8'
    });

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        if (type === 'checkbox') {
            setFormData({ ...formData, [name]: checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Check captcha
        if (formData.captchaAnswer.trim() !== captchaQuestion.correctAnswer) {
            alert('Captcha incorrect. Please try again.');
            return;
        }

        // Insert into Supabase
        const { data, error } = await supabase
            .from('jobpostings')
            .insert([
                {
                    employer_name: formData.employerName,
                    contact_email: formData.contactEmail,
                    contact_phone: formData.contactPhone,
                    rate: formData.rate,
                    location: formData.location,
                    kids_count: formData.kidsCount,
                    notes: formData.notes,
                    job_type: formData.jobType,
                    live_in_option: formData.liveInOption,
                    nationality: formData.nationality,
                    driving_license: formData.drivingLicense,
                    status: 'active', // example
                },
            ]);

        if (error) {
            console.log(error);
            alert('Error submitting job posting.');
        } else {
            alert('Job posted successfully!');
            // Reset
            setFormData({
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
                isPremium: false,
            });
        }
    };

    return (
        <>
            <div className="jobposting-container">
                <h2>Post a Job</h2>
                <form onSubmit={handleSubmit} className="jobposting-form">
                    <label>
                        Employer Name:
                        <input
                            type="text"
                            name="employerName"
                            required
                            value={formData.employerName}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Contact Email:
                        <input
                            type="email"
                            name="contactEmail"
                            required
                            value={formData.contactEmail}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Contact Phone:
                        <input
                            type="text"
                            name="contactPhone"
                            required
                            value={formData.contactPhone}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Rate (AED /month):
                        <input
                            type="number"
                            name="rate"
                            required
                            value={formData.rate}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Location:
                        <input
                            type="text"
                            name="location"
                            required
                            value={formData.location}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Number of Kids:
                        <input
                            type="number"
                            name="kidsCount"
                            required
                            value={formData.kidsCount}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Job Type:
                        <input
                            type="text"
                            name="jobType"
                            required
                            value={formData.jobType}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Live-In Option:
                        <input
                            type="text"
                            name="liveInOption"
                            placeholder="Yes / No / Possibly"
                            required
                            value={formData.liveInOption}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Nationality:
                        <input
                            type="text"
                            name="nationality"
                            required
                            value={formData.nationality}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Driving License:
                        <input
                            type="text"
                            name="drivingLicense"
                            placeholder="Yes / No"
                            required
                            value={formData.drivingLicense}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Additional Notes:
                        <textarea
                            name="notes"
                            rows="3"
                            value={formData.notes}
                            onChange={handleChange}
                        />
                    </label>



                    <label>
                        Captcha: {captchaQuestion.question}
                        <input
                            type="text"
                            name="captchaAnswer"
                            required
                            value={formData.captchaAnswer}
                            onChange={handleChange}
                        />
                    </label>

                    <button type="submit">Submit Job</button>
                </form>
            </div>
        </>
    );
}

export default JobPosting;
