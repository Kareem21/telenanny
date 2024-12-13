import { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
}

// Define base URL and callback URL
const BASE_URL = 'https://nanniestest2-lbgwqeokw-kareems-projects-d3c5c2cf.vercel.app';
const AUTH_CALLBACK_URL = `${BASE_URL}/auth/callback`;

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
    }
});

const AuthContext = createContext({
    session: null,
    user: null,
    loading: true,
    supabase: null,
    signOut: async () => {},
    // Add the base URL and callback URL to the context
    urls: {
        base: BASE_URL,
        callback: AUTH_CALLBACK_URL
    }
});

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;

                if (session) {
                    setSession(session);
                    setUser(session.user);
                }
            } catch (error) {
                console.error('Error getting session:', error.message);
            } finally {
                setLoading(false);
            }
        };
        initializeAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (session) {
            console.log('Session:', session);
            console.log('AUTHCONTEXT User ID (auth.uid()):', session.user.id);
        } else {
            console.log('AUTHCONTEXT No active session.');
        }
    }, [session]);

    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            setSession(null);
            setUser(null);
        } catch (error) {
            console.error('Error signing out:', error.message);
        }
    };

    const value = {
        session,
        user,
        loading,
        supabase,
        signOut,
        isAuthenticated: !!session,
        // Include the URLs in the context value
        urls: {
            base: BASE_URL,
            callback: AUTH_CALLBACK_URL
        }
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};