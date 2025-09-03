// Integration service for connecting with claims management software

// Available integration types
export const INTEGRATION_TYPES = {
  CLAIMS_MANAGEMENT: 'claims_management',
  DOCUMENT_MANAGEMENT: 'document_management',
  POLICY_MANAGEMENT: 'policy_management',
  CUSTOMER_MANAGEMENT: 'customer_management'
};

// Available integration providers
export const INTEGRATION_PROVIDERS = {
  // Claims Management Systems
  GUIDEWIRE_CLAIM_CENTER: {
    id: 'guidewire_claim_center',
    name: 'Guidewire ClaimCenter',
    type: INTEGRATION_TYPES.CLAIMS_MANAGEMENT,
    logo: 'guidewire.png',
    description: 'Connect with Guidewire ClaimCenter to sync claims data and photos.',
    website: 'https://www.guidewire.com/products/claimcenter',
    apiDocs: 'https://developer.guidewire.com/api-docs',
    configFields: ['apiKey', 'instanceUrl', 'username', 'password']
  },
  DUCK_CREEK_CLAIMS: {
    id: 'duck_creek_claims',
    name: 'Duck Creek Claims',
    type: INTEGRATION_TYPES.CLAIMS_MANAGEMENT,
    logo: 'duck_creek.png',
    description: 'Integrate with Duck Creek Claims for seamless claims processing.',
    website: 'https://www.duckcreek.com/product/claims',
    apiDocs: 'https://developer.duckcreek.com',
    configFields: ['apiKey', 'instanceUrl', 'clientId', 'clientSecret']
  },
  SNAPSHEET: {
    id: 'snapsheet',
    name: 'Snapsheet',
    type: INTEGRATION_TYPES.CLAIMS_MANAGEMENT,
    logo: 'snapsheet.png',
    description: 'Connect with Snapsheet for virtual claims processing.',
    website: 'https://www.snapsheet.ai',
    apiDocs: 'https://developer.snapsheet.ai',
    configFields: ['apiKey', 'accountId']
  },
  
  // Document Management Systems
  DOCUSIGN: {
    id: 'docusign',
    name: 'DocuSign',
    type: INTEGRATION_TYPES.DOCUMENT_MANAGEMENT,
    logo: 'docusign.png',
    description: 'Send reports for electronic signature via DocuSign.',
    website: 'https://www.docusign.com',
    apiDocs: 'https://developers.docusign.com',
    configFields: ['apiKey', 'accountId', 'integrationKey']
  },
  BOX: {
    id: 'box',
    name: 'Box',
    type: INTEGRATION_TYPES.DOCUMENT_MANAGEMENT,
    logo: 'box.png',
    description: 'Store and share reports and photos in Box.',
    website: 'https://www.box.com',
    apiDocs: 'https://developer.box.com',
    configFields: ['clientId', 'clientSecret', 'enterpriseId']
  },
  
  // Policy Management Systems
  INSURITY: {
    id: 'insurity',
    name: 'Insurity',
    type: INTEGRATION_TYPES.POLICY_MANAGEMENT,
    logo: 'insurity.png',
    description: 'Connect with Insurity for policy information.',
    website: 'https://www.insurity.com',
    apiDocs: 'https://developer.insurity.com',
    configFields: ['apiKey', 'instanceUrl', 'username', 'password']
  }
};

// Mock storage for integration configurations
const integrationStorage = {
  getIntegrations: () => {
    const stored = localStorage.getItem('claimsnap_integrations');
    return stored ? JSON.parse(stored) : [];
  },
  
  saveIntegration: (integration) => {
    const integrations = integrationStorage.getIntegrations();
    const existingIndex = integrations.findIndex(i => i.providerId === integration.providerId);
    
    if (existingIndex >= 0) {
      integrations[existingIndex] = integration;
    } else {
      integrations.push(integration);
    }
    
    localStorage.setItem('claimsnap_integrations', JSON.stringify(integrations));
    return integration;
  },
  
  deleteIntegration: (providerId) => {
    const integrations = integrationStorage.getIntegrations();
    const updatedIntegrations = integrations.filter(i => i.providerId !== providerId);
    localStorage.setItem('claimsnap_integrations', JSON.stringify(updatedIntegrations));
  }
};

// Integration service
const integrationService = {
  // Get all available integration providers
  getAvailableProviders: () => {
    return Object.values(INTEGRATION_PROVIDERS);
  },
  
  // Get providers by type
  getProvidersByType: (type) => {
    return Object.values(INTEGRATION_PROVIDERS).filter(provider => provider.type === type);
  },
  
  // Get a specific provider
  getProvider: (providerId) => {
    return INTEGRATION_PROVIDERS[providerId];
  },
  
  // Get all configured integrations
  getConfiguredIntegrations: () => {
    return integrationStorage.getIntegrations();
  },
  
  // Configure a new integration
  configureIntegration: async (providerId, config) => {
    const provider = INTEGRATION_PROVIDERS[providerId];
    
    if (!provider) {
      throw new Error(`Provider ${providerId} not found`);
    }
    
    // Validate required fields
    for (const field of provider.configFields) {
      if (!config[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    
    // In a real app, this would validate the credentials with the provider's API
    // For demo purposes, we'll just simulate a delay and success
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Save the integration
    const integration = {
      providerId,
      providerName: provider.name,
      providerType: provider.type,
      config,
      status: 'active',
      connectedAt: new Date().toISOString()
    };
    
    return integrationStorage.saveIntegration(integration);
  },
  
  // Test an integration connection
  testIntegration: async (providerId, config) => {
    const provider = INTEGRATION_PROVIDERS[providerId];
    
    if (!provider) {
      throw new Error(`Provider ${providerId} not found`);
    }
    
    // In a real app, this would test the connection with the provider's API
    // For demo purposes, we'll just simulate a delay and success
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      success: true,
      message: 'Connection successful'
    };
  },
  
  // Delete an integration
  deleteIntegration: (providerId) => {
    integrationStorage.deleteIntegration(providerId);
  },
  
  // Export data to an integration
  exportToIntegration: async (providerId, data) => {
    const integrations = integrationStorage.getIntegrations();
    const integration = integrations.find(i => i.providerId === providerId);
    
    if (!integration) {
      throw new Error(`Integration ${providerId} not configured`);
    }
    
    // In a real app, this would call the provider's API to export the data
    // For demo purposes, we'll just simulate a delay and success
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      success: true,
      message: `Data exported to ${integration.providerName}`,
      exportId: `export-${Date.now()}`
    };
  }
};

export default integrationService;

