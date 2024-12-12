// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        // Add this redirect configuration
        redirectTo: 'https://dubainannies.vercel.app/register-nanny'
    }
});
// Create context with default values
const AuthContext = createContext({
    session: null,
    user: null,
    loading: true,
    supabase: null,
    signOut: async () => {},
});

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
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



        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);


            }
        );

        // Cleanup subscription
        return () => {
            subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (session) {
            console.log('Session:', session);
            console.log('AUTHCONTEXT User ID (auth.uid()):', session.user.id); // This should match `auth.uid()`
        } else {
            console.error('AUTHCONTEXT No active session.');
        }
    }, [session]);
    // Sign out function
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

    // Context value
    const value = {
        session,
        user,
        loading,
        supabase,
        signOut,
        isAuthenticated: !!session,
    };


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};