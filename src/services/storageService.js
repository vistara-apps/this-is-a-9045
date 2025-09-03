import { supabase } from './supabaseService';
import { v4 as uuidv4 } from 'uuid';

// Check if Pinata API keys are available
const pinataApiKey = import.meta.env.VITE_PINATA_API_KEY;
const pinataSecretApiKey = import.meta.env.VITE_PINATA_SECRET_API_KEY;

const isPinataConfigured = pinataApiKey && pinataSecretApiKey;

// Supabase storage functions
export const supabaseStorage = {
  // Upload a file to Supabase storage
  async uploadFile(file, bucket = 'photos') {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${bucket}/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);
    
    if (error) throw error;
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
    
    return {
      path: filePath,
      url: urlData.publicUrl,
      name: file.name,
      size: file.size,
      type: file.type
    };
  },
  
  // Delete a file from Supabase storage
  async deleteFile(filePath, bucket = 'photos') {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);
    
    if (error) throw error;
  }
};

// Pinata IPFS storage functions
export const pinataStorage = {
  // Upload a file to IPFS via Pinata
  async uploadToIPFS(file, metadata = {}) {
    if (!isPinataConfigured) {
      throw new Error('Pinata API keys not configured');
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    // Add metadata
    const pinataMetadata = {
      name: metadata.name || file.name,
      keyvalues: {
        ...metadata,
        uploadedAt: new Date().toISOString()
      }
    };
    
    formData.append('pinataMetadata', JSON.stringify(pinataMetadata));
    
    // Set pinata options
    const pinataOptions = {
      cidVersion: 1
    };
    
    formData.append('pinataOptions', JSON.stringify(pinataOptions));
    
    try {
      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'pinata_api_key': pinataApiKey,
          'pinata_secret_api_key': pinataSecretApiKey
        },
        body: formData
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload to IPFS');
      }
      
      const result = await response.json();
      
      return {
        ipfsHash: result.IpfsHash,
        url: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
        name: file.name,
        size: file.size,
        type: file.type,
        metadata: pinataMetadata
      };
    } catch (error) {
      console.error('Pinata upload error:', error);
      throw error;
    }
  },
  
  // Unpin a file from Pinata
  async unpinFromIPFS(ipfsHash) {
    if (!isPinataConfigured) {
      throw new Error('Pinata API keys not configured');
    }
    
    try {
      const response = await fetch(`https://api.pinata.cloud/pinning/unpin/${ipfsHash}`, {
        method: 'DELETE',
        headers: {
          'pinata_api_key': pinataApiKey,
          'pinata_secret_api_key': pinataSecretApiKey
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to unpin from IPFS');
      }
      
      return true;
    } catch (error) {
      console.error('Pinata unpin error:', error);
      throw error;
    }
  }
};

// Fallback to local storage for demo mode
export const localStorageFallback = {
  // Store file data in browser's localStorage (for demo purposes only)
  async storeFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const fileId = uuidv4();
          const fileData = {
            id: fileId,
            name: file.name,
            size: file.size,
            type: file.type,
            data: event.target.result,
            url: URL.createObjectURL(file),
            uploadedAt: new Date().toISOString()
          };
          
          // Store file metadata in localStorage
          const storedFiles = JSON.parse(localStorage.getItem('claimsnap_files') || '[]');
          storedFiles.push({
            id: fileId,
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString()
          });
          
          localStorage.setItem('claimsnap_files', JSON.stringify(storedFiles));
          
          resolve(fileData);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
      
      reader.readAsDataURL(file);
    });
  },
  
  // Get all stored files
  getStoredFiles() {
    return JSON.parse(localStorage.getItem('claimsnap_files') || '[]');
  },
  
  // Delete a stored file
  deleteStoredFile(fileId) {
    const storedFiles = JSON.parse(localStorage.getItem('claimsnap_files') || '[]');
    const updatedFiles = storedFiles.filter(file => file.id !== fileId);
    localStorage.setItem('claimsnap_files', JSON.stringify(updatedFiles));
  }
};

// Main storage service that decides which storage method to use
export const storageService = {
  // Upload a file
  async uploadFile(file, metadata = {}) {
    try {
      // Try Pinata first if configured
      if (isPinataConfigured) {
        return await pinataStorage.uploadToIPFS(file, metadata);
      }
      
      // Fall back to Supabase storage
      try {
        return await supabaseStorage.uploadFile(file);
      } catch (supabaseError) {
        console.error('Supabase storage error:', supabaseError);
        
        // Fall back to local storage for demo
        return await localStorageFallback.storeFile(file);
      }
    } catch (error) {
      console.error('Storage service error:', error);
      
      // Final fallback to local storage
      return await localStorageFallback.storeFile(file);
    }
  },
  
  // Delete a file
  async deleteFile(fileData) {
    try {
      if (fileData.ipfsHash) {
        // Delete from Pinata
        await pinataStorage.unpinFromIPFS(fileData.ipfsHash);
      } else if (fileData.path) {
        // Delete from Supabase
        await supabaseStorage.deleteFile(fileData.path);
      } else if (fileData.id) {
        // Delete from local storage
        localStorageFallback.deleteStoredFile(fileData.id);
      }
      
      return true;
    } catch (error) {
      console.error('Delete file error:', error);
      throw error;
    }
  }
};

export default storageService;

