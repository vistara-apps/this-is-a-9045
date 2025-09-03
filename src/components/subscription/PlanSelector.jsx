import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

export function PlanSelector({ onPlanSelected }) {
  const { profile, isFreeTier, isProTier, isBusinessTier } = useAuth();
  const { showSuccess, showError } = useToast();
  
  const handlePlanSelect = (plan) => {
    // Check if user is trying to select their current plan
    if ((plan === 'free' && isFreeTier()) ||
        (plan === 'pro' && isProTier()) ||
        (plan === 'business' && isBusinessTier())) {
      showError('You are already on this plan');
      return;
    }
    
    // Call the callback with the selected plan
    onPlanSelected(plan);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Select a Plan</h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* Free Plan */}
        <div className={`glass-card rounded-lg overflow-hidden ${isFreeTier() ? 'border-2 border-accent' : ''}`}>
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
            
            {isFreeTier() ? (
              <button
                disabled
                className="w-full bg-white/10 text-white px-4 py-2 rounded-lg opacity-50 cursor-not-allowed"
              >
                Current Plan
              </button>
            ) : (
              <button
                onClick={() => handlePlanSelect('free')}
                className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Downgrade
              </button>
            )}
          </div>
        </div>
        
        {/* Pro Plan */}
        <div className={`glass-card rounded-lg overflow-hidden ${isProTier() ? 'border-2 border-accent' : ''}`}>
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
            
            {isProTier() ? (
              <button
                disabled
                className="w-full bg-white/10 text-white px-4 py-2 rounded-lg opacity-50 cursor-not-allowed"
              >
                Current Plan
              </button>
            ) : (
              <button
                onClick={() => handlePlanSelect('pro')}
                className="w-full bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {isBusinessTier() ? 'Downgrade' : 'Upgrade'}
              </button>
            )}
          </div>
        </div>
        
        {/* Business Plan */}
        <div className={`glass-card rounded-lg overflow-hidden ${isBusinessTier() ? 'border-2 border-accent' : ''}`}>
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
            
            {isBusinessTier() ? (
              <button
                disabled
                className="w-full bg-white/10 text-white px-4 py-2 rounded-lg opacity-50 cursor-not-allowed"
              >
                Current Plan
              </button>
            ) : (
              <button
                onClick={() => handlePlanSelect('business')}
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
}

