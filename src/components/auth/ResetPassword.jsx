import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Camera, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function ResetPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email');
      return;
    }
    
    try {
      setError('');
      setIsSubmitting(true);
      
      await resetPassword(email);
      setSuccess(true);
      toast.success('Password reset email sent!');
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err.message || 'Failed to send reset email');
      toast.error('Failed to send reset email. Please try again.');
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
          <p className="text-white/70 mt-2">Reset your password</p>
        </div>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-white text-sm">{error}</p>
          </div>
        )}
        
        {success ? (
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-6 flex items-start">
            <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-white text-sm">
                Password reset email sent! Check your inbox for instructions to reset your password.
              </p>
              <p className="text-white/70 text-xs mt-2">
                If you don't see the email, check your spam folder.
              </p>
            </div>
          </div>
        ) : (
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
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-white py-3 rounded-lg transition-colors flex items-center justify-center"
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}
        
        <div className="mt-8 text-center">
          <p className="text-white/70">
            Remember your password?{' '}
            <Link to="/login" className="text-accent hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

