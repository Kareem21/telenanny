import { useState } from 'react';
import { useAuth } from './AuthContext.jsx';

function AuthForm() {
    const [email, setEmail] = useState('');
    const [isNewUser, setIsNewUser] = useState(false); // Checkbox for new users
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const { supabase, urls } = useAuth();

    // Handle signup for new users
    const handleSignup = async (email) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                options: {
                    emailRedirectTo: urls.callback, // Use the callback URL from context
                    data: {
                        userType: 'NANNY',
                        intendedDestination: '/register-nanny'
                    }
                },
            });

            if (error) {
                throw error;
            }

            setMessage({
                text: 'Signup successful! Check your email to confirm your account.',
                type: 'success',
            });
            setEmail('');
        } catch (error) {
            console.error('Signup error:', error);
            setMessage({
                text: 'Failed to sign up. Please try again.',
                type: 'error',
            });
        }
    };

    // Handle login for existing users
    const handleLogin = async (email) => {
        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: urls.callback, // Use the callback URL from context
                    data: {
                        userType: 'NANNY',
                        intendedDestination: '/register-nanny'
                    }
                },
            });

            if (error) {
                throw error;
            }

            setMessage({
                text: 'Magic link sent! Check your email to log in.',
                type: 'success',
            });
            setEmail('');
        } catch (error) {
            console.error('Login error:', error);
            setMessage({
                text: 'Failed to send login link. Please try again.',
                type: 'error',
            });
        }
    };

    // General handler to switch between signup and login
    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        if (isNewUser) {
            await handleSignup(email);
        } else {
            await handleLogin(email);
        }

        setLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>{isNewUser ? 'Sign up' : 'Log in'} to Dubai Nannies</h2>
                <form onSubmit={handleAuth} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email address</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="auth-input"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={isNewUser}
                                onChange={() => setIsNewUser(!isNewUser)}
                            />
                            I am a new user
                        </label>
                    </div>

                    {message.text && (
                        <div className={`message ${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading || !email}
                    >
                        {loading ? (
                            <span>{isNewUser ? 'Signing up...' : 'Sending link...'}</span>
                        ) : (
                            <span>{isNewUser ? 'Sign up' : 'Log in'}</span>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AuthForm;
