import { useState } from 'react';
import { useAuth } from './AuthContext.jsx';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const { supabase } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                    data: {
                        userType: 'NANNY'  // Store user type in auth metadata
                    }
                }
            });

            if (error) throw error;

            setMessage({
                text: 'Check your email for the magic link!',
                type: 'success'
            });
            setEmail(''); // Clear email after successful send
        } catch (error) {
            console.error('Login error:', error);
            setMessage({
                text: 'Failed to send login link. Please try again.',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Sign in to TeleNanny</h2>
                <p className="login-subtitle">
                    Enter your email to receive a magic link
                </p>

                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email address</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="login-input"
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
                        className="login-button"
                        disabled={loading || !email}
                    >
                        {loading ? (
                            <span>Sending link...</span>
                        ) : (
                            <span>Send magic link</span>
                        )}
                    </button>

                    <div className="login-info">
                        <p>
                            We'll send you a secure link to sign in instantly.
                            No password needed!
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;