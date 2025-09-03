import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import integrationService, { INTEGRATION_TYPES } from '../../services/integrationService';
import { Plus, Trash2, RefreshCw, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { LoadingSpinner } from '../common/LoadingSpinner';

export function IntegrationConfig() {
  const { profile } = useAuth();
  const { showSuccess, showError } = useToast();
  
  const [integrations, setIntegrations] = useState([]);
  const [availableProviders, setAvailableProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [configValues, setConfigValues] = useState({});
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Load integrations and providers
  useEffect(() => {
    loadIntegrations();
    setAvailableProviders(integrationService.getAvailableProviders());
  }, []);
  
  const loadIntegrations = () => {
    const configured = integrationService.getConfiguredIntegrations();
    setIntegrations(configured);
  };
  
  const handleProviderSelect = (providerId) => {
    const provider = integrationService.getProvider(providerId);
    setSelectedProvider(provider);
    
    // Initialize config values
    const initialConfig = {};
    provider.configFields.forEach(field => {
      initialConfig[field] = '';
    });
    
    setConfigValues(initialConfig);
    setTestResult(null);
  };
  
  const handleConfigChange = (field, value) => {
    setConfigValues(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear test result when config changes
    setTestResult(null);
  };
  
  const handleTestConnection = async () => {
    if (!selectedProvider) return;
    
    try {
      setIsTesting(true);
      
      const result = await integrationService.testIntegration(
        selectedProvider.id,
        configValues
      );
      
      setTestResult({
        success: result.success,
        message: result.message
      });
      
      if (result.success) {
        showSuccess('Connection test successful!');
      } else {
        showError(`Connection test failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Test connection error:', error);
      setTestResult({
        success: false,
        message: error.message
      });
      showError(`Connection test failed: ${error.message}`);
    } finally {
      setIsTesting(false);
    }
  };
  
  const handleSaveIntegration = async () => {
    if (!selectedProvider) return;
    
    try {
      setIsConfiguring(true);
      
      await integrationService.configureIntegration(
        selectedProvider.id,
        configValues
      );
      
      showSuccess(`${selectedProvider.name} integration configured successfully!`);
      loadIntegrations();
      setShowAddForm(false);
      setSelectedProvider(null);
      setConfigValues({});
    } catch (error) {
      console.error('Save integration error:', error);
      showError(`Failed to configure integration: ${error.message}`);
    } finally {
      setIsConfiguring(false);
    }
  };
  
  const handleDeleteIntegration = async (providerId) => {
    try {
      integrationService.deleteIntegration(providerId);
      showSuccess('Integration removed successfully');
      loadIntegrations();
    } catch (error) {
      console.error('Delete integration error:', error);
      showError(`Failed to remove integration: ${error.message}`);
    }
  };
  
  // Group integrations by type
  const groupedIntegrations = integrations.reduce((acc, integration) => {
    const type = integration.providerType;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(integration);
    return acc;
  }, {});
  
  // Check if user is on free tier
  const isFreeTier = profile?.subscription_tier === 'free';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Integrations</h2>
        
        {!isFreeTier && !showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Integration</span>
          </button>
        )}
      </div>
      
      {/* Free tier message */}
      {isFreeTier && (
        <div className="glass-card p-6 rounded-lg bg-gradient-to-r from-purple-800/50 to-indigo-800/50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h3 className="text-xl font-semibold text-white">Unlock Integrations</h3>
              <p className="text-white/70 mt-1">
                Upgrade to Pro or Business plan to connect ClaimSnap AI with your claims management software.
              </p>
            </div>
            <button className="bg-white text-purple-800 px-6 py-3 rounded-lg font-medium hover:bg-white/90 transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>
      )}
      
      {/* Add integration form */}
      {showAddForm && !isFreeTier && (
        <div className="glass-card p-6 rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-white">Add New Integration</h3>
            <button
              onClick={() => {
                setShowAddForm(false);
                setSelectedProvider(null);
                setConfigValues({});
                setTestResult(null);
              }}
              className="text-white/70 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {!selectedProvider ? (
            <div className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">Integration Type</label>
                <select
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
                  onChange={(e) => {
                    const type = e.target.value;
                    setAvailableProviders(
                      type === 'all'
                        ? integrationService.getAvailableProviders()
                        : integrationService.getProvidersByType(type)
                    );
                  }}
                >
                  <option value="all">All Types</option>
                  <option value={INTEGRATION_TYPES.CLAIMS_MANAGEMENT}>Claims Management</option>
                  <option value={INTEGRATION_TYPES.DOCUMENT_MANAGEMENT}>Document Management</option>
                  <option value={INTEGRATION_TYPES.POLICY_MANAGEMENT}>Policy Management</option>
                  <option value={INTEGRATION_TYPES.CUSTOMER_MANAGEMENT}>Customer Management</option>
                </select>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableProviders.map(provider => (
                  <div
                    key={provider.id}
                    className="glass-card p-4 rounded-lg cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={() => handleProviderSelect(provider.id)}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">{provider.name.charAt(0)}</span>
                      </div>
                      <h4 className="text-white font-medium">{provider.name}</h4>
                    </div>
                    <p className="text-white/70 text-sm mb-3">{provider.description}</p>
                    <a
                      href={provider.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent text-sm hover:underline flex items-center space-x-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>Learn more</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <button
                  onClick={() => setSelectedProvider(null)}
                  className="text-white/70 hover:text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h4 className="text-xl font-medium text-white">{selectedProvider.name}</h4>
              </div>
              
              {selectedProvider.configFields.map(field => (
                <div key={field}>
                  <label className="block text-white font-medium mb-2">
                    {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                  </label>
                  <input
                    type={field.includes('password') || field.includes('secret') ? 'password' : 'text'}
                    value={configValues[field] || ''}
                    onChange={(e) => handleConfigChange(field, e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent"
                    placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                  />
                </div>
              ))}
              
              {testResult && (
                <div className={`p-4 rounded-lg flex items-start ${
                  testResult.success ? 'bg-green-500/20 border border-green-500/50' : 'bg-red-500/20 border border-red-500/50'
                }`}>
                  {testResult.success ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                  )}
                  <p className="text-white text-sm">{testResult.message}</p>
                </div>
              )}
              
              <div className="flex space-x-4">
                <button
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  className="bg-white/10 hover:bg-white/20 disabled:bg-white/5 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  {isTesting ? (
                    <LoadingSpinner size="sm" color="white" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
                </button>
                
                <button
                  onClick={handleSaveIntegration}
                  disabled={isConfiguring || !testResult?.success}
                  className="bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-white px-4 py-2 rounded-lg transition-colors flex-1"
                >
                  {isConfiguring ? 'Saving...' : 'Save Integration'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Existing integrations */}
      {!isFreeTier && Object.keys(groupedIntegrations).length > 0 && (
        <div className="space-y-6">
          {Object.entries(groupedIntegrations).map(([type, typeIntegrations]) => (
            <div key={type} className="glass-card p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">
                {type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' ')}
              </h3>
              
              <div className="space-y-4">
                {typeIntegrations.map(integration => (
                  <div key={integration.providerId} className="bg-white/5 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">{integration.providerName.charAt(0)}</span>
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{integration.providerName}</h4>
                          <p className="text-white/50 text-xs">
                            Connected {new Date(integration.connectedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">
                          Active
                        </span>
                        <button
                          onClick={() => handleDeleteIntegration(integration.providerId)}
                          className="text-white/50 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* No integrations message */}
      {!isFreeTier && integrations.length === 0 && !showAddForm && (
        <div className="glass-card p-12 rounded-lg text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-white/70" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Integrations Configured</h3>
          <p className="text-white/70 mb-6">
            Connect ClaimSnap AI with your claims management software to streamline your workflow.
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Add Your First Integration
          </button>
        </div>
      )}
    </div>
  );
}

