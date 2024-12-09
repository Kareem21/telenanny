// NannyForm.jsx
import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';
import { useNavigate } from 'react-router-dom';


function NannyForm({ onSubmitSuccess }) {
    const { user, session } = useAuth();

    useEffect(() => {
        if (!user) {
            console.error('User not authenticated');
        }
        console.log('User ID from AuthContext:', user?.id);
        console.log('Session Token:', session?.access_token);


    }, [user]);

    const [formData, setFormData] = useState({
        name: '',
        location: '',
        nationality: '',
        experience: '',
        languages: [],
        rate: '',
        email: '',
        phone: '',
        visa_status: '',
        availability: '',
        age: '',
        profilePic: null,
        cv: null,
        accommodation_preference: 'live-out',
        can_travel: false,
        education: '',
        specialSkills: [],
        introduction: ''
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [profilePicName, setProfilePicName] = useState('');
    const [cvName, setCvName] = useState('');

    const LANGUAGES = ['English', 'Arabic', 'Russian', 'Filipino', 'Hindi', 'Urdu', 'French'];
    const SKILLS = [
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
        'Child Development',
    ];
    const NATIONALITIES = [
        'Filipino',
        'Indian',
        'Sri Lankan',
        'Ethiopian',
        'Kenyan',
        'Ugandan',
        'Indonesian',
        'Other'
    ];
    const LOCATIONS = [
        'Dubai Marina',
        'JBR',
        'Palm Jumeirah',
        'Downtown Dubai',
        'Business Bay',
        'JVC',
        'Arabian Ranches',
        'Dubai Hills',
        'Mirdif',
        'Al Barsha',
        'Other'
    ];

    const handleFileChange = (e, fileType) => {
        const file = e.target.files[0];
        if (file) {
            // Create filename based on nanny's name
            const nameForFile = formData.name.replace(/\s+/g, ''); // Remove spaces from name
            const fileExtension = file.name.split('.').pop(); // Get original file extension

            if (fileType === 'profilePic') {
                if (!file.type.match('image.*')) {
                    setErrorMessage('Please upload an image file');
                    return;
                }
                if (file.size > 5 * 1024 * 1024) {
                    setErrorMessage('Image must be less than 5MB');
                    return;
                }

                // Create a new File object with the custom name
                const renamedFile = new File([file],
                    `${nameForFile}_profile.${fileExtension}`,
                    { type: file.type }
                );

                setFormData({ ...formData, profilePic: renamedFile });
                setProfilePicName(renamedFile.name);
            } else if (fileType === 'cv') {
                if (!file.type.match('application/pdf|application/msword|application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
                    setErrorMessage('Please upload a PDF or Word document');
                    return;
                }
                if (file.size > 5 * 1024 * 1024) {
                    setErrorMessage('File must be less than 5MB');
                    return;
                }

                // Create a new File object with the custom name
                const renamedFile = new File([file],
                    `${nameForFile}_cv.${fileExtension}`,
                    { type: file.type }
                );

                setFormData({ ...formData, cv: renamedFile });
                setCvName(renamedFile.name);
            }
            setErrorMessage('');
        }
    };

    const toggleSkill = (skill) => {
        setFormData(prev => ({
            ...prev,
            specialSkills: prev.specialSkills.includes(skill)
                ? prev.specialSkills.filter(s => s !== skill)
                : [...prev.specialSkills, skill]
        }));
    };

    const toggleLanguage = (lang) => {
        setFormData(prev => ({
            ...prev,
            languages: prev.languages.includes(lang)
                ? prev.languages.filter(l => l !== lang)
                : [...prev.languages, lang]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user?.id) {
            setErrorMessage('You must be logged in to create a profile');
            return;
        }

        try {
            const formDataToSend = new FormData();

            // Add user_id from auth
            formDataToSend.append('user_id', user.id);

            // Convert numeric fields
            const numericFields = ['age', 'experience', 'rate'];
            Object.keys(formData).forEach(key => {
                if (key === 'profilePic' || key === 'cv') return;

                if (numericFields.includes(key)) {
                    formDataToSend.append(key, Number(formData[key]));
                }
                else if (['specialSkills', 'languages'].includes(key)) {
                    formDataToSend.append(key, JSON.stringify(formData[key]));
                }
                else if (key === 'can_travel') {
                    formDataToSend.append(key, formData[key].toString());
                }
                else {
                    formDataToSend.append(key, formData[key]);
                }
            });

            if (formData.profilePic) {
                formDataToSend.append('profilePic', formData.profilePic);
            }
            if (formData.cv) {
                formDataToSend.append('cv', formData.cv);
            }

            const response = await fetch('http://localhost:5001/api/nannies', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`,
                },
                body: formDataToSend,
            });



            console.log("Session after end : ",session)
            console.log('User ID:', user.id);


            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create profile');
            }

            onSubmitSuccess();
            alert('Profile created successfully!');

            // Reset form
            setFormData({
                name: '',
                location: '',
                nationality: '',
                experience: '',
                languages: [],
                rate: '',
                email: '',
                phone: '',
                visa_status: '',
                availability: '',
                age: '',
                profilePic: null,
                cv: null,
                accommodation_preference: 'live-out',
                can_travel: false,
                education: '',
                specialSkills: [],
                introduction: ''
            });
            setProfilePicName('');
            setCvName('');
            console.log('User ID end : ', user.id);

        } catch (error) {
            console.error('Error creating profile:', error);
            setErrorMessage(error.message || 'Error creating profile');
        }
    };

    if (!user) {
        return <div className="error-message">Please log in to create a nanny profile.</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="nanny-form">
            <h2>Register as a Nanny</h2>

            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <div className="form-section">
                <h3>Personal Information</h3>
                <div className="form-group">
                    <label>Full Name</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Age</label>
                    <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({...formData, age: e.target.value})}
                        required
                        min="18"
                        max="65"
                    />
                </div>

                <div className="form-group">
                    <label>Nationality</label>
                    <select
                        value={formData.nationality}
                        onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                        required
                    >
                        <option value="">Select Nationality</option>
                        {NATIONALITIES.map(nat => (
                            <option key={nat} value={nat}>{nat}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Location</label>
                    <select
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        required
                    >
                        <option value="">Select Location</option>
                        {LOCATIONS.map(loc => (
                            <option key={loc} value={loc}>{loc}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Profile Picture</label>
                    <div className="file-upload">
                        <input
                            type="file"
                            onChange={(e) => handleFileChange(e, 'profilePic')}
                            accept="image/*"
                            id="profile-pic"
                        />
                        <label htmlFor="profile-pic">{profilePicName || 'Choose file'}</label>
                    </div>
                </div>
            </div>

            <div className="form-section">
                <h3>Contact Information</h3>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Phone</label>
                    <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        required
                    />
                </div>
            </div>

            <div className="form-section">
                <h3>Professional Information</h3>
                <div className="form-group">
                    <label>Experience (years)</label>
                    <input
                        type="number"
                        value={formData.experience}
                        onChange={(e) => setFormData({...formData, experience: e.target.value})}
                        required
                        min="0"
                    />
                </div>

                <div className="form-group">
                    <label>Languages</label>
                    <div className="chip-group">
                        {LANGUAGES.map(lang => (
                            <button
                                key={lang}
                                type="button"
                                className={`chip ${formData.languages.includes(lang) ? 'selected' : ''}`}
                                onClick={() => toggleLanguage(lang)}
                            >
                                {lang}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Special Skills</label>
                    <div className="chip-group">
                        {SKILLS.map(skill => (
                            <button
                                key={skill}
                                type="button"
                                className={`chip ${formData.specialSkills.includes(skill) ? 'selected' : ''}`}
                                onClick={() => toggleSkill(skill)}
                            >
                                {skill}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Monthly Rate (AED)</label>
                    <input
                        type="number"
                        value={formData.rate}
                        onChange={(e) => setFormData({...formData, rate: e.target.value})}
                        required
                        min="0"
                    />
                </div>

                <div className="form-group">
                    <label>Education Level</label>
                    <select
                        value={formData.education}
                        onChange={(e) => setFormData({...formData, education: e.target.value})}
                        required
                    >
                        <option value="">Select Education Level</option>
                        <option value="high_school">High School</option>
                        <option value="vocational">Vocational</option>
                        <option value="bachelor">Bachelor's Degree</option>
                        <option value="master">Master's Degree</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>CV Upload</label>
                    <div className="file-upload">
                        <input
                            type="file"
                            onChange={(e) => handleFileChange(e, 'cv')}
                            accept=".pdf,.doc,.docx"
                            id="cv-upload"
                        />
                        <label htmlFor="cv-upload">{cvName || 'Choose file'}</label>
                    </div>
                </div>
            </div>

            <div className="form-section">
                <h3>Work Preferences</h3>
                <div className="form-group">
                    <label>Visa Status</label>
                    <select
                        value={formData.visa_status}
                        onChange={(e) => setFormData({...formData, visa_status: e.target.value})}
                        required
                    >
                        <option value="">Select Visa Status</option>
                        <option value="visit">Visit Visa</option>
                        <option value="employment">Employment Visa</option>
                        <option value="cancelled">Cancelled Visa</option>
                        <option value="none">No Visa</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Accommodation Preference</label>
                    <div className="radio-group">
                        <label>
                            <input
                                type="radio"
                                value="live-in"
                                checked={formData.accommodation_preference === 'live-in'}
                                onChange={(e) => setFormData({...formData, accommodation_preference: e.target.value})}
                            />
                            Live-in
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="live-out"
                                checked={formData.accommodation_preference === 'live-out'}
                                onChange={(e) => setFormData({...formData, accommodation_preference: e.target.value})}
                            />
                            Live-out
                        </label>
                    </div>
                </div>

                <div className="form-group">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={formData.can_travel}
                            onChange={(e) => setFormData({...formData, can_travel: e.target.checked})}
                        />
                        Willing to travel with family
                    </label>
                </div>
            </div>

            <div className="form-section">
                <h3>Additional Information</h3>
                <div className="form-group">
                    <label>Brief Introduction</label>
                    <textarea
                        value={formData.introduction}
                        onChange={(e) => setFormData({...formData, introduction: e.target.value})}
                        placeholder="Write a brief introduction about yourself, your experience, and why you would be a great nanny..."
                        rows="4"
                    />
                </div>
            </div>


            <div className="form-submit">
                <button type="submit" className="submit-button">
                    Create Profile
                </button>
            </div>
        </form>
    );
}

export default NannyForm;