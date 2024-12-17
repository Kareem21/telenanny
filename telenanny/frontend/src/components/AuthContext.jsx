import { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;



if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    throw new Error('Missing Supabase environment variables');
}

// Define base URL based on environment
const BASE_URL = import.meta.env.MODE === 'development'
    ? 'http://localhost:5173'
    : 'https://nanniestest2.vercel.app';

const AUTH_CALLBACK_URL = import.meta.env.MODE === 'development'
    ? 'http://localhost:5173/auth/callback'
    : 'https://nanniestest2.vercel.app/auth/callback';



const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        redirectTo: AUTH_CALLBACK_URL,
        debug: true,
        storageKey: 'supabase.auth.token',
    }
});

const AuthContext = createContext({
    session: null,
    user: null,
    loading: true,
    supabase: null,
    signOut: async () => {},
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
        console.log('=== useEffect: Initial session fetch ===');
        const initializeAuth = async () => {
            console.log('initializeAuth called');
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                console.log('getSession result - session:', session, 'error:', error);
                if (error) throw error;

                if (session) {
                    console.log('Session found, setting state');
                    setSession(session);
                    setUser(session.user);
                } else {
                    console.log('No active session found');
                }
            } catch (error) {
                console.error('Error getting session:', error.message);
            } finally {
                console.log('Initial session check done, loading false');
                setLoading(false);
            }
        };
        initializeAuth();

        console.log('Setting up onAuthStateChange subscription...');
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('Auth event:', event, 'Session:', session);
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);
            }
        );

        return () => {
            console.log('Cleaning up onAuthStateChange subscription');
            subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        console.log('=== useEffect: Session changed ===');
        if (session) {
            console.log('Session updated:', session);
            console.log('AUTHCONTEXT User ID:', session.user.id);
            console.log('Current BASE_URL:', BASE_URL);
            console.log('Current AUTH_CALLBACK_URL:', AUTH_CALLBACK_URL);
        } else {
            console.log('AUTHCONTEXT No active session.');
        }
    }, [session]);

    const signOut = async () => {
        console.log('=== signOut called ===');
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('Error signing out:', error.message);
                throw error;
            }

            console.log('Sign out successful, clearing session and user');
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
        urls: {
            base: BASE_URL,
            callback: AUTH_CALLBACK_URL
        }
    };

    console.log('AuthContext value constructed:', value);

    return (
        <AuthContext.Provider value={value}>
            {console.log('AuthContext.Provider rendering children')}
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    console.log('useAuth hook called');
    const context = useContext(AuthContext);
    if (context === undefined) {
        console.error('useAuth must be used within an AuthProvider');
        throw new Error('useAuth must be used within an AuthProvider');
    }
    console.log('useAuth returning context:', context);
    return context;
};
