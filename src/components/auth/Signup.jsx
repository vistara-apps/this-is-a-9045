import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Camera, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      setError('');
      setIsSubmitting(true);
      
      await signUp(email, password);
      toast.success('Account created successfully! Please check your email for verification.');
      navigate('/login');
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to create account');
      toast.error('Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="glass-card rounded-lg max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Camera className="w-12 h-12 text-accent" />
          </div>
          <h1 className="text-3xl font-bold text-white">ClaimSnap AI</h1>
          <p className="text-white/70 mt-2">Create your account</p>
        </div>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-white text-sm">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-white font-medium mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="password" className="block text-white font-medium mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-white font-medium mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-white font-medium mb-2">Subscription Plan</p>
            
            <div className="bg-white/10 border border-white/20 rounded-lg p-4 flex items-start">
              <div className="bg-accent/20 rounded-full p-1 mr-3 mt-0.5">
                <CheckCircle className="w-4 h-4 text-accent" />
              </div>
              <div>
                <h3 className="text-white font-medium">Free Plan</h3>
                <p className="text-white/70 text-sm">Up to 50 photos per month</p>
              </div>
            </div>
            
            <p className="text-white/50 text-xs">
              You can upgrade to Pro or Business plans after signing up
            </p>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-white py-3 rounded-lg transition-colors flex items-center justify-center"
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-white/70">
            Already have an account?{' '}
            <Link to="/login" className="text-accent hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

