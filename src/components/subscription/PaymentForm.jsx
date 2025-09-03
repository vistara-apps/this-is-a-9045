import React, { useState } from 'react';
import { CreditCard, Calendar, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

export function PaymentForm({ plan, onSuccess, onCancel }) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { updateSubscription } = useAuth();
  const { showSuccess, showError } = useToast();
  
  const formatCardNumber = (value) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Add space after every 4 digits
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    
    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.slice(0, 19);
  };
  
  const formatExpiryDate = (value) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Add slash after first 2 digits
    if (digits.length > 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    }
    
    return digits;
  };
  
  const handleCardNumberChange = (e) => {
    setCardNumber(formatCardNumber(e.target.value));
  };
  
  const handleExpiryDateChange = (e) => {
    setExpiryDate(formatExpiryDate(e.target.value));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      showError('Please enter a valid card number');
      return;
    }
    
    if (!cardName) {
      showError('Please enter the cardholder name');
      return;
    }
    
    if (expiryDate.length !== 5) {
      showError('Please enter a valid expiry date (MM/YY)');
      return;
    }
    
    if (cvv.length < 3) {
      showError('Please enter a valid CVV');
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // In a real app, this would call a payment processing API
      // For demo purposes, we'll just simulate a delay and update the subscription
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update subscription
      await updateSubscription(plan);
      
      showSuccess(`Successfully upgraded to ${plan} plan!`);
      onSuccess();
    } catch (error) {
      console.error('Payment error:', error);
      showError('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const getPlanDetails = () => {
    switch (plan) {
      case 'pro':
        return {
          name: 'Pro Plan',
          price: '$29',
          features: ['Up to 500 photos/month', 'Advanced AI analysis', 'Custom reports', 'Basic integrations']
        };
      case 'business':
        return {
          name: 'Business Plan',
          price: '$99',
          features: ['Unlimited photos', 'Premium AI analysis', 'Advanced reports', 'Full integrations']
        };
      default:
        return {
          name: 'Free Plan',
          price: '$0',
          features: ['Up to 50 photos/month', 'Basic AI categorization', 'Standard reports']
        };
    }
  };
  
  const planDetails = getPlanDetails();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Payment Details</h2>
      
      <div className="glass-card rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-white mb-4">Order Summary</h3>
        
        <div className="flex justify-between mb-2">
          <span className="text-white">{planDetails.name}</span>
          <span className="text-white font-medium">{planDetails.price}/month</span>
        </div>
        
        <div className="border-t border-white/20 my-4"></div>
        
        <div className="flex justify-between">
          <span className="text-white">Total</span>
          <span className="text-white font-bold">{planDetails.price}/month</span>
        </div>
        
        <div className="mt-4 text-white/70 text-sm">
          <p>You will be charged {planDetails.price} monthly until you cancel.</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="cardNumber" className="block text-white font-medium mb-2">Card Number</label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
            <input
              id="cardNumber"
              type="text"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent"
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="cardName" className="block text-white font-medium mb-2">Cardholder Name</label>
          <input
            id="cardName"
            type="text"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder="John Doe"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="expiryDate" className="block text-white font-medium mb-2">Expiry Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                id="expiryDate"
                type="text"
                value={expiryDate}
                onChange={handleExpiryDateChange}
                placeholder="MM/YY"
                maxLength={5}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="cvv" className="block text-white font-medium mb-2">CVV</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                id="cvv"
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="123"
                maxLength={4}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent"
                required
              />
            </div>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isProcessing}
            className="flex-1 bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-white py-3 rounded-lg transition-colors"
          >
            {isProcessing ? 'Processing...' : `Pay ${planDetails.price}`}
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="flex-1 bg-white/10 hover:bg-white/20 disabled:bg-white/5 text-white py-3 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
      
      <div className="text-center text-white/50 text-sm">
        <p>Your payment information is secure and encrypted.</p>
        <p>We do not store your full card details.</p>
      </div>
    </div>
  );
}

