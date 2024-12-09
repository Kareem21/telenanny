import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

function NannyDashboard() {
    const { user, session } = useAuth(); // Get the authenticated user and session token
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        rate: '',
        status: 'not_hired',
        location: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.id) {
                console.error('User not authenticated');
                setErrorMessage('User not authenticated');
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    `http://localhost:5001/api/nannies/profile?user_id=${user.id}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${session?.access_token}`,
                        },
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setProfile(data);
                } else {
                    const errorData = await response.json();
                    setErrorMessage(errorData.error || 'Failed to fetch profile');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                setErrorMessage('An error occurred while fetching profile.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [user, session]);

    const handleUpdate = async () => {
        if (!user?.id) {
            setErrorMessage('User not authenticated');
            return;
        }

        try {
            const response = await fetch('http://localhost:5001/api/nannies/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`,
                },
                body: JSON.stringify({ ...profile, user_id: user.id }),
            });

            if (response.ok) {
                alert('Profile updated successfully!');
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.error || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setErrorMessage('An error occurred while updating profile.');
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="dashboard-container">
            <main className="dashboard-main">
                <div className="dashboard-header">
                    <h1>My Dashboard</h1>
                </div>

                {errorMessage && <div className="error-message">{errorMessage}</div>}

                <div className="dashboard-content">
                    <div className="status-section">
                        <h3>Availability Status</h3>
                        <select
                            value={profile.status}
                            onChange={(e) => setProfile({ ...profile, status: e.target.value })}
                            className="status-select"
                        >
                            <option value="not_hired">Available</option>
                            <option value="hired">Currently Hired</option>
                        </select>
                    </div>

                    <div className="profile-section">
                        <h3>Basic Information</h3>
                        <div className="profile-fields">
                            <div className="field-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={profile.name}
                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                />
                            </div>

                            <div className="field-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                />
                            </div>

                            <div className="field-group">
                                <label>Phone</label>
                                <input
                                    type="tel"
                                    value={profile.phone}
                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                />
                            </div>

                            <div className="field-group">
                                <label>Monthly Rate (AED)</label>
                                <input
                                    type="number"
                                    value={profile.rate}
                                    onChange={(e) => setProfile({ ...profile, rate: e.target.value })}
                                />
                            </div>

                            <div className="field-group">
                                <label>Location</label>
                                <input
                                    type="text"
                                    value={profile.location}
                                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="save-button-container">
                        <button className="save-button" onClick={handleUpdate}>
                            Save Changes
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default NannyDashboard;
