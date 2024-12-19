import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function NannyForm({ onSubmitSuccess }) {
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

    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [profilePicName, setProfilePicName] = useState('');
    const [cvName, setCvName] = useState('');
    const [captchaToken, setCaptchaToken] = useState(null);
    const [customLanguage, setCustomLanguage] = useState('');
    const [isOtherSelected, setIsOtherSelected] = useState(false);

    const LANGUAGES = ['English', 'Arabic', 'Russian', 'Filipino', 'Spanish' , 'Ukrainian', 'Urdu', 'Italian', 'Other'];
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

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://www.google.com/recaptcha/api.js';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        return () => {
            const scripts = document.getElementsByTagName('script');
            for (let script of scripts) {
                if (script.src.includes('recaptcha')) {
                    script.remove();
                }
            }
        };
    }, []);

    window.handleCaptchaSubmit = (token) => {
        setCaptchaToken(token);
    };

    const handleFileChange = (e, fileType) => {
        const file = e.target.files[0];
        if (file) {
            if (!formData.name) {
                setErrorMessage('Please provide a name before uploading a file.');
                return;
            }

            const nameForFile = formData.name.replace(/\s+/g, '');
            const fileExtension = file.name.split('.').pop();

            if (fileType === 'profilePic') {
                if (!file.type.match('image.*')) {
                    setErrorMessage('Please upload an image file');
                    return;
                }
                if (file.size > 5 * 1024 * 1024) {
                    setErrorMessage('Image must be less than 5MB');
                    return;
                }

                const renamedFile = new File([file], `${nameForFile}_profile.${fileExtension}`, { type: file.type });
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

                const renamedFile = new File([file], `${nameForFile}_cv.${fileExtension}`, { type: file.type });
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
        if (lang === 'Other') {
            // Toggle the 'Other' option, but do not add 'Other' to the languages list
            setIsOtherSelected(prev => !prev);
        } else {
            // Normal toggling for predefined languages
            setFormData(prev => ({
                ...prev,
                languages: prev.languages.includes(lang)
                    ? prev.languages.filter(l => l !== lang)
                    : [...prev.languages, lang]
            }));
        }
    };

    const handleCustomLanguage = (e) => {
        if (e.key === 'Enter' && customLanguage.trim()) {
            e.preventDefault();
            // Only allow adding custom languages if 'Other' is selected
            if (isOtherSelected && !formData.languages.includes(customLanguage.trim())) {
                setFormData(prev => ({
                    ...prev,
                    languages: [...prev.languages, customLanguage.trim()]
                }));
            }
            setCustomLanguage('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!captchaToken) {
            setErrorMessage('Please complete the CAPTCHA verification');
            return;
        }
        try {
            const phoneCheckResponse = await fetch(`https://server-1prf.onrender.com/api/nannies/check-phone/${formData.phone}`);
            const phoneData = await phoneCheckResponse.json();

            if (phoneData.exists) {
                setErrorMessage('This phone number is already registered. Please use a different number.');
                return;
            }
        } catch (error) {
            console.error('Error checking phone number:', error);
            setErrorMessage('Error validating phone number. Please try again.');
            return;
        }
        try {
            const formDataToSend = new FormData();

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

            formDataToSend.append('captchaToken', captchaToken);

            const response = await fetch('https://server-1prf.onrender.com/api/nannies', {
                method: 'POST',
                body: formDataToSend,
            });

            if (response.status === 409) {
                setErrorMessage('A profile with this phone number already exists. Please use a different phone number.');
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create profile');
            }

            onSubmitSuccess();
            alert('Profile created successfully!');
            navigate('/');

            setFormData({
                name: '',
                location: '',
                nationality: '',
                experience: '',
                languages: [],
                email: '',
                phone: '',
                visa_status: '',
                availability: '',
                age: '',
                profilePic: null,
                cv: null,
                accommodation_preference: 'live-out',
                can_travel: false,
                specialSkills: [],
                introduction: ''
            });
            setProfilePicName('');
            setCvName('');
            setIsOtherSelected(false);

        } catch (error) {
            console.error('Error creating profile:', error);
            setErrorMessage(error.message || 'Error creating profile');
        }
    };

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
                        onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 12);
                            setFormData({...formData, phone: value});
                        }}
                        required
                        placeholder="Enter phone number"
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
                    <div className="selection-grid">
                        {LANGUAGES.map(lang => (
                            <button
                                key={lang}
                                type="button"
                                className={`selection-item ${((lang !== 'Other' && formData.languages.includes(lang)) || (lang === 'Other' && isOtherSelected)) ? 'selected' : ''}`}
                                onClick={() => toggleLanguage(lang)}
                            >
                                {lang}
                            </button>
                        ))}
                    </div>
                    {isOtherSelected && (
                        <>
                            {formData.languages.some(lang => !LANGUAGES.includes(lang)) && (
                                <div className="custom-languages mt-2">
                                    <p className="text-sm text-gray-600">Additional languages:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {formData.languages
                                            .filter(lang => !LANGUAGES.includes(lang))
                                            .map(lang => (
                                                <span
                                                    key={lang}
                                                    className="selection-item selected"
                                                    onClick={() => setFormData(prev => ({
                                                        ...prev,
                                                        languages: prev.languages.filter(l => l !== lang)
                                                    }))}
                                                >
                                                    {lang} ×
                                                </span>
                                            ))}
                                    </div>
                                </div>
                            )}
                            <div className="mt-2">
                                <input
                                    type="text"
                                    value={customLanguage}
                                    onChange={(e) => setCustomLanguage(e.target.value)}
                                    onKeyPress={handleCustomLanguage}
                                    placeholder="Type a custom language and press Enter"
                                    className="custom-language-input"
                                />
                            </div>
                        </>
                    )}
                </div>

                <div className="form-group">
                    <label>Special Skills</label>
                    <div className="selection-grid">
                        {SKILLS.map(skill => (
                            <button
                                key={skill}
                                type="button"
                                className={`selection-item ${formData.specialSkills.includes(skill) ? 'selected' : ''}`}
                                onClick={() => toggleSkill(skill)}
                            >
                                {skill}
                            </button>
                        ))}
                    </div>
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


            </div>


            <div className="form-section">
                <div className="form-group">
                    <div className="captcha-container overflow-x-auto w-full flex justify-center">
                        <div
                            className="g-recaptcha scale-90 sm:scale-100"
                            data-sitekey="6LdnsJ4qAAAAAInBa61KrDz1gD8QFtyBeo2yFKUl"
                            data-callback="handleCaptchaSubmit"
                        ></div>
                    </div>
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
