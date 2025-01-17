// src/pages/NannyForm.jsx
import React, { useState } from 'react';
import './NannyForm.css';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://ejbiorpholetwkprfrfj.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqYmlvcnBob2xldHdrcHJmcmZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2NzMxMTUsImV4cCI6MjA0OTI0OTExNX0.5-YNb6hjUmkvI1VXpcsItaUbQopiYlq7wdgjNsjEXEo'
);

const allLanguages = [
    'English', 'Arabic', 'Russian', 'Filipino', 'Spanish', 'Ukrainian', 'Urdu', 'Italian', 'Other'
];

const allSkills = [
    'Newborn Care',
    'Special Needs Care',
    'Cooking',
    'Cleaning',
    'Homework Help',
    'First Aid Certified',
    'Swimming',
    'Arts & Crafts',
    'Music',
    'Sports',
    'Educational Activities',
    'Child Development'
];

const isValidPhoneNumber = (phone) => {
    const phoneRegex = /^\+971\d{9}$/;
    return phoneRegex.test(phone);
};

function NannyForm() {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        nationality: '',
        location: '',
        email: '',
        phone: '',
        experience: '',
        languages: [],
        special_skills: [],
        visa_status: '',
        profile_image_url: '',
        cv_url: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleLanguagesChange = (language) => {
        setFormData(prevData => {
            const currentLanguages = prevData.languages || [];
            if (currentLanguages.includes(language)) {
                return {
                    ...prevData,
                    languages: currentLanguages.filter(l => l !== language)
                };
            } else {
                return {
                    ...prevData,
                    languages: [...currentLanguages, language]
                };
            }
        });
    };

    const handleSkillsChange = (skill) => {
        setFormData(prevData => {
            const currentSkills = prevData.special_skills || [];
            if (currentSkills.includes(skill)) {
                return {
                    ...prevData,
                    special_skills: currentSkills.filter(s => s !== skill)
                };
            } else {
                return {
                    ...prevData,
                    special_skills: [...currentSkills, skill]
                };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate age
        const age = parseInt(formData.age);
        if (age < 18 || age > 65) {
            alert('Age must be between 18 and 65 years.');
            return;
        }

        // Validate experience
        const experience = parseInt(formData.experience);
        if (experience < 0) {
            alert('Experience cannot be negative.');
            return;
        }

        // Validate phone format
        if (!isValidPhoneNumber(formData.phone)) {
            alert('Phone number must start with +971 followed by 9 digits');
            return;
        }

        try {
            // Check if phone number exists
            const { data: existingPhone, error: phoneError } = await supabase
                .from('nannies')
                .select('phone')
                .eq('phone', formData.phone)
                .maybeSingle();

            if (phoneError) throw phoneError;

            if (existingPhone) {
                alert('An account with this phone number already exists.');
                return;
            }

            // Check if email exists
            const { data: existingEmail, error: emailError } = await supabase
                .from('nannies')
                .select('email')
                .eq('email', formData.email)
                .maybeSingle();

            if (emailError) throw emailError;

            if (existingEmail) {
                alert('An account with this email already exists.');
                return;
            }

            // All validations passed, proceed with insertion
            const { error: insertError } = await supabase
                .from('nannies')
                .insert([{
                    name: formData.name,
                    age: age,
                    nationality: formData.nationality,
                    location: formData.location,
                    email: formData.email,
                    phone: formData.phone,
                    experience: experience,
                    languages: formData.languages,
                    special_skills: formData.special_skills,
                    visa_status: formData.visa_status
                }]);

            if (insertError) throw insertError;

            alert('Profile submitted successfully!');
            setFormData({
                name: '',
                age: '',
                nationality: '',
                location: '',
                email: '',
                phone: '',
                experience: '',
                languages: [],
                special_skills: [],
                visa_status: '',
                profile_image_url: '',
                cv_url: ''
            });
        } catch (error) {
            console.error('Error:', error);
            alert(`Error submitting form: ${error.message}`);
        }
    };

    return (
        <div className="nannyform-container">
            <h2>Register as a Nanny</h2>
            <form onSubmit={handleSubmit} className="nannyform-form">
                <div className="form-section">
                    <h3>Personal Information</h3>

                    <div className="form-field">
                        <label>Full Name*</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label>Age* (18-65)</label>
                        <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleInputChange}
                            min="18"
                            max="65"
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label>Nationality*</label>
                        <select
                            name="nationality"
                            value={formData.nationality}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Nationality</option>
                            <option value="Filipino">Filipino</option>
                            <option value="Indian">Indian</option>
                            <option value="Sri Lankan">Sri Lankan</option>
                            <option value="Ethiopian">Ethiopian</option>
                            <option value="Kenyan">Kenyan</option>
                            <option value="Russian">Russian</option>
                            <option value="Ukrainian">Ukrainian</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="form-field">
                        <label>Location*</label>
                        <select
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Location</option>
                            <option value="Dubai">Dubai</option>
                            <option value="Abu Dhabi">Abu Dhabi</option>
                            <option value="Sharjah">Sharjah</option>
                            <option value="Ajman">Ajman</option>
                            <option value="RAK">RAK</option>
                        </select>
                    </div>
                </div>

                <div className="form-section">
                    <h3>Contact Information</h3>

                    <div className="form-field">
                        <label>Email*</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label>Phone* (must start with +971)</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+971XXXXXXXXX"
                            required
                        />
                    </div>
                </div>

                <div className="form-section">
                    <h3>Professional Information</h3>

                    <div className="form-field">
                        <label>Years of Experience*</label>
                        <input
                            type="number"
                            name="experience"
                            value={formData.experience}
                            onChange={handleInputChange}
                            min="0"
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label>Languages*</label>
                        <div className="checkbox-group">
                            {allLanguages.map(language => (
                                <label key={language} className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={formData.languages.includes(language)}
                                        onChange={() => handleLanguagesChange(language)}
                                    />
                                    {language}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="form-field">
                        <label>Special Skills*</label>
                        <div className="checkbox-group">
                            {allSkills.map(skill => (
                                <label key={skill} className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={formData.special_skills.includes(skill)}
                                        onChange={() => handleSkillsChange(skill)}
                                    />
                                    {skill}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="form-field">
                        <label>Visa Status*</label>
                        <select
                            name="visa_status"
                            value={formData.visa_status}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Visa Status</option>
                            <option value="visit">Visit Visa</option>
                            <option value="employment">Employment Visa</option>
                            <option value="cancelled">Cancelled Visa</option>
                            <option value="none">No Visa</option>
                        </select>
                    </div>
                </div>

                <button type="submit" className="submit-button">Submit Application</button>
            </form>
        </div>
    );
}

export default NannyForm;