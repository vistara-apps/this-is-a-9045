import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useClaim } from '../contexts/ClaimContext';
import { Settings as SettingsIcon, User, CreditCard, Shield, Bell, LogOut, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function Settings() {
  const { user, profile, signOut, updateProfile, updateSubscription } = useAuth();
  const { state, dispatch } = useClaim();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    company: profile?.company || '',
    phone: profile?.phone || '',
    notifications: profile?.notifications || {
      email: true,
      push: true,
      sms: false
    }
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [name]: checked
      }
    }));
  };
  
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    try {
      setIsUpdating(true);
      
      await updateProfile({
        name: formData.name,
        company: formData.company,
        phone: formData.phone,
        notifications: formData.notifications
      });
      
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleSubscriptionChange = async (tier) => {
    try {
      setIsUpdating(true);
      
      // In a real app, this would open a payment flow
      // For demo purposes, we'll just update the subscription directly
      await updateSubscription(tier);
      
      toast.success(`Subscription updated to ${tier} plan!`);
    } catch (error) {
      console.error('Subscription update error:', error);
      toast.error('Failed to update subscription');
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };
  
  const renderProfileTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Profile Settings</h2>
      
      <form onSubmit={handleProfileUpdate} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-white font-medium mb-2">Email</label>
          <input
            type="email"
            id="email"
            value={user?.email || ''}
            disabled
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent disabled:opacity-60"
          />
          <p className="text-white/50 text-sm mt-1">Email cannot be changed</p>
        </div>
        
        <div>
          <label htmlFor="name" className="block text-white font-medium mb-2">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Your full name"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent"
          />
        </div>
        
        <div>
          <label htmlFor="company" className="block text-white font-medium mb-2">Company</label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            placeholder="Your company name"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent"
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-white font-medium mb-2">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Your phone number"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent"
          />
        </div>
        
        <button
          type="submit"
          disabled={isUpdating}
          className="bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-white px-6 py-3 rounded-lg transition-colors"
        >
          {isUpdating ? 'Updating...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
  
  const renderSubscriptionTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Subscription</h2>
      
      <div className="bg-white/10 border border-white/20 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white">Current Plan</h3>
            <p className="text-white/70 mt-1">
              {profile?.subscription_tier === 'free' ? 'Free Plan' :
               profile?.subscription_tier === 'pro' ? 'Pro Plan' : 'Business Plan'}
            </p>
          </div>
          
          {profile?.subscription_tier !== 'free' && (
            <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm">
              Active
            </span>
          )}
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* Free Plan */}
        <div className={`glass-card rounded-lg overflow-hidden ${profile?.subscription_tier === 'free' ? 'border-2 border-accent' : ''}`}>
          <div className="p-6">
            <h3 className="text-xl font-semibold text-white">Free Plan</h3>
            <div className="mt-4 mb-6">
              <span className="text-3xl font-bold text-white">$0</span>
              <span className="text-white/70">/month</span>
            </div>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-white">Up to 50 photos/month</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-white">Basic AI categorization</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-white">Standard reports</span>
              </li>
              <li className="flex items-start text-white/50">
                <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>No integrations</span>
              </li>
            </ul>
            
            {profile?.subscription_tier === 'free' ? (
              <button
                disabled
                className="w-full bg-white/10 text-white px-4 py-2 rounded-lg opacity-50 cursor-not-allowed"
              >
                Current Plan
              </button>
            ) : (
              <button
                onClick={() => handleSubscriptionChange('free')}
                disabled={isUpdating}
                className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Downgrade
              </button>
            )}
          </div>
        </div>
        
        {/* Pro Plan */}
        <div className={`glass-card rounded-lg overflow-hidden ${profile?.subscription_tier === 'pro' ? 'border-2 border-accent' : ''}`}>
          <div className="p-6">
            <h3 className="text-xl font-semibold text-white">Pro Plan</h3>
            <div className="mt-4 mb-6">
              <span className="text-3xl font-bold text-white">$29</span>
              <span className="text-white/70">/month</span>
            </div>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-white">Up to 500 photos/month</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-white">Advanced AI analysis</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-white">Custom reports</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-white">Basic integrations</span>
              </li>
            </ul>
            
            {profile?.subscription_tier === 'pro' ? (
              <button
                disabled
                className="w-full bg-white/10 text-white px-4 py-2 rounded-lg opacity-50 cursor-not-allowed"
              >
                Current Plan
              </button>
            ) : (
              <button
                onClick={() => handleSubscriptionChange('pro')}
                disabled={isUpdating}
                className="w-full bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {profile?.subscription_tier === 'business' ? 'Downgrade' : 'Upgrade'}
              </button>
            )}
          </div>
        </div>
        
        {/* Business Plan */}
        <div className={`glass-card rounded-lg overflow-hidden ${profile?.subscription_tier === 'business' ? 'border-2 border-accent' : ''}`}>
          <div className="p-6">
            <h3 className="text-xl font-semibold text-white">Business Plan</h3>
            <div className="mt-4 mb-6">
              <span className="text-3xl font-bold text-white">$99</span>
              <span className="text-white/70">/month</span>
            </div>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-white">Unlimited photos</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-white">Premium AI analysis</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-white">Advanced reports</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-white">Full integrations</span>
              </li>
            </ul>
            
            {profile?.subscription_tier === 'business' ? (
              <button
                disabled
                className="w-full bg-white/10 text-white px-4 py-2 rounded-lg opacity-50 cursor-not-allowed"
              >
                Current Plan
              </button>
            ) : (
              <button
                onClick={() => handleSubscriptionChange('business')}
                disabled={isUpdating}
                className="w-full bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Upgrade
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Notification Settings</h2>
      
      <div className="glass-card rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Notification Preferences</h3>
        
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="email"
              checked={formData.notifications?.email}
              onChange={handleCheckboxChange}
              className="rounded"
            />
            <span className="text-white">Email Notifications</span>
          </label>
          
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="push"
              checked={formData.notifications?.push}
              onChange={handleCheckboxChange}
              className="rounded"
            />
            <span className="text-white">Push Notifications</span>
          </label>
          
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="sms"
              checked={formData.notifications?.sms}
              onChange={handleCheckboxChange}
              className="rounded"
            />
            <span className="text-white">SMS Notifications</span>
          </label>
        </div>
        
        <button
          onClick={handleProfileUpdate}
          disabled={isUpdating}
          className="mt-6 bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-white px-6 py-3 rounded-lg transition-colors"
        >
          {isUpdating ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
  
  const renderSecurityTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Security Settings</h2>
      
      <div className="glass-card rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Password</h3>
        
        <div className="space-y-4">
          <button
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Change Password
          </button>
        </div>
      </div>
      
      <div className="glass-card rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Two-Factor Authentication</h3>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white">Protect your account with 2FA</p>
            <p className="text-white/70 text-sm mt-1">
              Add an extra layer of security to your account
            </p>
          </div>
          
          <button
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Enable 2FA
          </button>
        </div>
      </div>
      
      <div className="glass-card rounded-lg p-6 bg-red-500/10">
        <h3 className="text-xl font-semibold text-white mb-4">Account Actions</h3>
        
        <div className="space-y-4">
          <button
            onClick={handleSignOut}
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
          
          <button
            className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-6 py-3 rounded-lg transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
  
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'subscription':
        return renderSubscriptionTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'security':
        return renderSecurityTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:space-x-6">
        {/* Sidebar */}
        <div className="lg:w-64 mb-6 lg:mb-0">
          <div className="glass-card rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-white font-medium">{profile?.name || user?.email}</p>
                <p className="text-white/70 text-sm">{profile?.subscription_tier || 'Free'} Plan</p>
              </div>
            </div>
            
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors
                  ${activeTab === 'profile' 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </button>
              
              <button
                onClick={() => setActiveTab('subscription')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors
                  ${activeTab === 'subscription' 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <CreditCard className="w-5 h-5" />
                <span>Subscription</span>
              </button>
              
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors
                  ${activeTab === 'notifications' 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </button>
              
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors
                  ${activeTab === 'security' 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <Shield className="w-5 h-5" />
                <span>Security</span>
              </button>
            </nav>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1">
          <div className="glass-card rounded-lg p-6">
            {renderActiveTab()}
          </div>
        </div>
      </div>
    </div>
  );
}

