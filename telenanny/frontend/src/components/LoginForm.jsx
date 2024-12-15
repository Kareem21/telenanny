import { useState } from 'react';
import { useAuth } from './AuthContext.jsx';

function AuthForm() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const { supabase, urls } = useAuth();

    // Handle login with magic link
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: urls.callback,
                    data: {
                        intendedDestination: '/register-nanny'
                    }
                }
            }, );


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
                text: 'Failed to send login link. Please try again. (deploymentD check)',
                type: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Log in to Dubai Nannies</h2>
                <form onSubmit={handleLogin} className="auth-form">
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
                            <span>Sending link...</span>
                        ) : (
                            <span>Send magic link</span>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AuthForm;
