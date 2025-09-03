import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, users } from '../services/supabaseService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state
  useEffect(() => {
    async function initializeAuth() {
      try {
        setLoading(true);
        
        // Check if user is already logged in
        const currentUser = await auth.getCurrentUser();
        
        if (currentUser) {
          setUser(currentUser);
          
          // Get user profile
          try {
            const userProfile = await users.getProfile(currentUser.id);
            setProfile(userProfile);
          } catch (profileError) {
            console.error('Error fetching user profile:', profileError);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          
          // Get user profile
          try {
            const userProfile = await users.getProfile(session.user.id);
            setProfile(userProfile);
          } catch (profileError) {
            console.error('Error fetching user profile:', profileError);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
        }
      }
    );

    initializeAuth();

    // Clean up listener
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Sign up
  const signUp = async (email, password) => {
    try {
      setLoading(true);
      const { user: newUser } = await auth.signUp(email, password);
      return newUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign in
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const { user: signedInUser } = await auth.signIn(email, password);
      return signedInUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      await auth.signOut();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      setLoading(true);
      await auth.resetPassword(email);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const updatePassword = async (password) => {
    try {
      setLoading(true);
      await auth.updatePassword(password);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const updateProfile = async (updates) => {
    try {
      setLoading(true);
      if (!user) throw new Error('User not authenticated');
      
      const updatedProfile = await users.updateProfile(user.id, updates);
      setProfile({ ...profile, ...updates });
      return updatedProfile;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update subscription
  const updateSubscription = async (tier) => {
    try {
      setLoading(true);
      if (!user) throw new Error('User not authenticated');
      
      await users.updateSubscription(user.id, tier);
      setProfile({ ...profile, subscription_tier: tier });
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => setError(null);

  // Check if user is on free tier
  const isFreeTier = () => {
    return profile?.subscription_tier === 'free';
  };

  // Check if user is on pro tier
  const isProTier = () => {
    return profile?.subscription_tier === 'pro';
  };

  // Check if user is on business tier
  const isBusinessTier = () => {
    return profile?.subscription_tier === 'business';
  };

  // Get photo limit based on subscription tier
  const getPhotoLimit = () => {
    switch (profile?.subscription_tier) {
      case 'free':
        return 50;
      case 'pro':
        return 500;
      case 'business':
        return Infinity;
      default:
        return 50;
    }
  };

  const value = {
    user,
    profile,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    updateSubscription,
    clearError,
    isFreeTier,
    isProTier,
    isBusinessTier,
    getPhotoLimit
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

