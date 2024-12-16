import { useState } from 'react';
import { useAuth } from './AuthContext.jsx';

function AuthForm() {
    console.log('=== AuthForm Component Rendered ===');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const { supabase, urls } = useAuth();

    console.log('AuthForm initial states:', { email, loading, message, urls });

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log('=== handleLogin START ===');
        setLoading(true);
        setMessage({ text: '', type: '' });

        // Log the headers we're going to send
        const headers = {
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        };
        console.log('Sending headers:', headers);

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: urls.callback,
                    data: {
                        intendedDestination: '/register-nanny'
                    },
                    headers: headers
                }
            });

            if (error) {
                console.error('Detailed error:', {
                    message: error.message,
                    status: error.status,
                    name: error.name
                });
                throw error;
            }

            setMessage({
                text: 'Magic link sent! Check your email to log in.',
                type: 'success',
            });
            setEmail('');
        } catch (error) {
            console.error('Full error object:', error);
            setMessage({
                text: 'Failed to send login link. Please verify your email and try again.',
                type: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    console.log('AuthForm rendered with current state:', { email, message, loading });

    return (
        <div className="auth-container">
            {console.log('Rendering AuthForm UI')}
            <div className="auth-card">
                <h2>Log in to Dubai Nannies</h2>
                <form onSubmit={handleLogin} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email address</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => {
                                console.log('Email input changed to:', e.target.value);
                                setEmail(e.target.value)
                            }}
                            placeholder="you@example.com"
                            className="auth-input"
                            required
                            disabled={loading}
                        />
                    </div>

                    {message.text && (
                        <div className={`message ${message.type}`}>
                            {console.log('Displaying message:', message)}
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
