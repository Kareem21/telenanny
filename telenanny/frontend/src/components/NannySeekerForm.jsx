// frontend/src/components/NannySeekerForm.jsx

import { useState } from 'react'

const LANGUAGES = ['English', 'Arabic', 'Russian', 'Filipino', 'Hindi', 'Urdu', 'French', 'Chinese']
const NATIONALITIES = ['Filipino', 'Indian', 'Ethiopian', 'Ugandan', 'Indonesian', 'Kenyan', 'Sri Lankan']
const DUBAI_AREAS = [
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
]

function NannySeekerForm({ onSearch }) {
    const [formData, setFormData] = useState({
        minBudget: '',
        maxBudget: '',
        preferredLanguages: [],
        preferredNationalities: [],
        location: '',
        preferredAgeRange: '',
        requirementsDescription: '',
        accommodationType: 'live-out', // or 'live-in'
        workingHours: {
            start: '',
            end: ''
        },
        workingDays: [],
        childrenInfo: {
            numberOfChildren: '',
            childrenAges: ''
        },
        requiredSkills: [],
        minimumExperience: '',
        visaStatusRequired: false
    })

    const toggleArrayItem = (field, item) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].includes(item)
                ? prev[field].filter(i => i !== item)
                : [...prev[field], item]
        }))
    }

    const toggleWorkingDay = (day) => {
        setFormData(prev => ({
            ...prev,
            workingDays: prev.workingDays.includes(day)
                ? prev.workingDays.filter(d => d !== day)
                : [...prev.workingDays, day]
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onSearch(formData)
    }

    return (
        <form onSubmit={handleSubmit} className="nanny-seeker-form">
            <h2 className="form-title">Find Your Ideal Nanny</h2>

            <div className="form-section">
                <h3>Budget Range (AED/month)</h3>
                <div className="budget-inputs">
                    <div className="form-group">
                        <label>Minimum</label>
                        <input
                            type="number"
                            value={formData.minBudget}
                            onChange={(e) => setFormData({...formData, minBudget: e.target.value})}
                            placeholder="Min Budget"
                        />
                    </div>
                    <div className="form-group">
                        <label>Maximum</label>
                        <input
                            type="number"
                            value={formData.maxBudget}
                            onChange={(e) => setFormData({...formData, maxBudget: e.target.value})}
                            placeholder="Max Budget"
                        />
                    </div>
                </div>
            </div>

            <div className="form-section">
                <h3>Languages Required</h3>
                <div className="chip-group">
                    {LANGUAGES.map(language => (
                        <button
                            key={language}
                            type="button"
                            className={`chip ${formData.preferredLanguages.includes(language) ? 'selected' : ''}`}
                            onClick={() => toggleArrayItem('preferredLanguages', language)}
                        >
                            {language}
                        </button>
                    ))}
                </div>
            </div>

            <div className="form-section">
                <h3>Preferred Nationalities</h3>
                <div className="chip-group">
                    {NATIONALITIES.map(nationality => (
                        <button
                            key={nationality}
                            type="button"
                            className={`chip ${formData.preferredNationalities.includes(nationality) ? 'selected' : ''}`}
                            onClick={() => toggleArrayItem('preferredNationalities', nationality)}
                        >
                            {nationality}
                        </button>
                    ))}
                </div>
            </div>

            <div className="form-section">
                <h3>Location</h3>
                <select
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="form-select"
                >
                    <option value="">Select Area</option>
                    {DUBAI_AREAS.map(area => (
                        <option key={area} value={area}>{area}</option>
                    ))}
                </select>
            </div>

            <div className="form-section">
                <h3>Working Hours & Days</h3>
                <div className="time-inputs">
                    <div className="form-group">
                        <label>Start Time</label>
                        <input
                            type="time"
                            value={formData.workingHours.start}
                            onChange={(e) => setFormData({
                                ...formData,
                                workingHours: {...formData.workingHours, start: e.target.value}
                            })}
                        />
                    </div>
                    <div className="form-group">
                        <label>End Time</label>
                        <input
                            type="time"
                            value={formData.workingHours.end}
                            onChange={(e) => setFormData({
                                ...formData,
                                workingHours: {...formData.workingHours, end: e.target.value}
                            })}
                        />
                    </div>
                </div>
                <div className="days-selection">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                        <button
                            key={day}
                            type="button"
                            className={`day-chip ${formData.workingDays.includes(day) ? 'selected' : ''}`}
                            onClick={() => toggleWorkingDay(day)}
                        >
                            {day.slice(0, 3)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="form-section">
                <h3>Accommodation Type</h3>
                <div className="radio-group">
                    <label>
                        <input
                            type="radio"
                            value="live-in"
                            checked={formData.accommodationType === 'live-in'}
                            onChange={(e) => setFormData({...formData, accommodationType: e.target.value})}
                        />
                        Live-in
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="live-out"
                            checked={formData.accommodationType === 'live-out'}
                            onChange={(e) => setFormData({...formData, accommodationType: e.target.value})}
                        />
                        Live-out
                    </label>
                </div>
            </div>

            <div className="form-section">
                <h3>Children Information</h3>
                <div className="form-group">
                    <label>Number of Children</label>
                    <input
                        type="number"
                        value={formData.childrenInfo.numberOfChildren}
                        onChange={(e) => setFormData({
                            ...formData,
                            childrenInfo: {...formData.childrenInfo, numberOfChildren: e.target.value}
                        })}
                        min="1"
                    />
                </div>
                <div className="form-group">
                    <label>Children's Ages (comma separated)</label>
                    <input
                        type="text"
                        value={formData.childrenInfo.childrenAges}
                        onChange={(e) => setFormData({
                            ...formData,
                            childrenInfo: {...formData.childrenInfo, childrenAges: e.target.value}
                        })}
                        placeholder="e.g., 2, 5, 7"
                    />
                </div>
            </div>

            <div className="form-section">
                <h3>Additional Requirements</h3>
                <div className="form-group">
                    <label>Minimum Experience (years)</label>
                    <input
                        type="number"
                        value={formData.minimumExperience}
                        onChange={(e) => setFormData({...formData, minimumExperience: e.target.value})}
                        min="0"
                    />
                </div>
                <div className="checkbox-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={formData.visaStatusRequired}
                            onChange={(e) => setFormData({...formData, visaStatusRequired: e.target.checked})}
                        />
                        Must have valid visa
                    </label>
                </div>
                <div className="form-group">
                    <label>Additional Requirements or Notes</label>
                    <textarea
                        value={formData.requirementsDescription}
                        onChange={(e) => setFormData({...formData, requirementsDescription: e.target.value})}
                        placeholder="Any additional requirements or preferences..."
                        rows="4"
                    />
                </div>
            </div>

            <button type="submit" className="submit-button">
                Search Nannies
            </button>
        </form>
    )
}

export default NannySeekerForm