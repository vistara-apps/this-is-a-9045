import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials missing. Using demo mode.');
}

export const supabase = createClient(
  supabaseUrl || 'https://example.supabase.co',
  supabaseKey || 'demo-key'
);

// Authentication functions
export const auth = {
  // Sign up a new user
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    
    // Create user profile if signup successful
    if (data?.user) {
      await createUserProfile(data.user.id, {
        email: data.user.email,
        subscription_tier: 'free', // Default to free tier
        created_at: new Date().toISOString(),
      });
    }
    
    return data;
  },
  
  // Sign in an existing user
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },
  
  // Sign out the current user
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
  
  // Get the current user
  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data?.user;
  },
  
  // Get the current session
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data?.session;
  },
  
  // Reset password
  async resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },
  
  // Update password
  async updatePassword(password) {
    const { error } = await supabase.auth.updateUser({
      password,
    });
    if (error) throw error;
  }
};

// User profile functions
export const users = {
  // Get user profile
  async getProfile(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Update user profile
  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  },
  
  // Update subscription tier
  async updateSubscription(userId, tier) {
    const { data, error } = await supabase
      .from('users')
      .update({ subscription_tier: tier })
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  }
};

// Create a user profile in the users table
async function createUserProfile(userId, userData) {
  const { error } = await supabase
    .from('users')
    .insert([{ user_id: userId, ...userData }]);
  
  if (error) throw error;
}

// Claims functions
export const claims = {
  // Create a new claim
  async createClaim(userId, claimData) {
    const claimId = uuidv4();
    const { data, error } = await supabase
      .from('claims')
      .insert([{
        claim_id: claimId,
        user_id: userId,
        claim_number: claimData.claimNumber || `CLM-${Date.now().toString().slice(-6)}`,
        status: claimData.status || 'open',
        created_at: new Date().toISOString(),
      }]);
    
    if (error) throw error;
    return { ...data, claim_id: claimId };
  },
  
  // Get all claims for a user
  async getUserClaims(userId) {
    const { data, error } = await supabase
      .from('claims')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  // Get a specific claim
  async getClaim(claimId) {
    const { data, error } = await supabase
      .from('claims')
      .select('*')
      .eq('claim_id', claimId)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Update a claim
  async updateClaim(claimId, updates) {
    const { data, error } = await supabase
      .from('claims')
      .update(updates)
      .eq('claim_id', claimId);
    
    if (error) throw error;
    return data;
  },
  
  // Delete a claim
  async deleteClaim(claimId) {
    // First delete all photos associated with the claim
    await photos.deleteClaimPhotos(claimId);
    
    // Then delete the claim
    const { error } = await supabase
      .from('claims')
      .delete()
      .eq('claim_id', claimId);
    
    if (error) throw error;
  }
};

// Photos functions
export const photos = {
  // Add a photo to a claim
  async addPhoto(claimId, photoData) {
    const photoId = uuidv4();
    const { data, error } = await supabase
      .from('photos')
      .insert([{
        photo_id: photoId,
        claim_id: claimId,
        original_filename: photoData.name,
        storage_url: photoData.url,
        tags: photoData.tags || [],
        category: photoData.category || 'uncategorized',
        severity_score: photoData.severityScore || 0,
        is_duplicate: photoData.isDuplicate || false,
        is_low_quality: photoData.isLowQuality || false,
        uploaded_at: new Date().toISOString(),
      }]);
    
    if (error) throw error;
    return { ...data, photo_id: photoId };
  },
  
  // Get all photos for a claim
  async getClaimPhotos(claimId) {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .eq('claim_id', claimId)
      .order('uploaded_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  // Update a photo
  async updatePhoto(photoId, updates) {
    const { data, error } = await supabase
      .from('photos')
      .update(updates)
      .eq('photo_id', photoId);
    
    if (error) throw error;
    return data;
  },
  
  // Delete a photo
  async deletePhoto(photoId) {
    const { error } = await supabase
      .from('photos')
      .delete()
      .eq('photo_id', photoId);
    
    if (error) throw error;
  },
  
  // Delete all photos for a claim
  async deleteClaimPhotos(claimId) {
    const { error } = await supabase
      .from('photos')
      .delete()
      .eq('claim_id', claimId);
    
    if (error) throw error;
  }
};

// Reports functions
export const reports = {
  // Create a new report
  async createReport(claimId, reportData) {
    const reportId = uuidv4();
    const { data, error } = await supabase
      .from('reports')
      .insert([{
        report_id: reportId,
        claim_id: claimId,
        title: reportData.title,
        content: reportData.content,
        photo_ids: reportData.photoIds || [],
        created_at: new Date().toISOString(),
      }]);
    
    if (error) throw error;
    return { ...data, report_id: reportId };
  },
  
  // Get all reports for a claim
  async getClaimReports(claimId) {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('claim_id', claimId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  // Get a specific report
  async getReport(reportId) {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('report_id', reportId)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Update a report
  async updateReport(reportId, updates) {
    const { data, error } = await supabase
      .from('reports')
      .update(updates)
      .eq('report_id', reportId);
    
    if (error) throw error;
    return data;
  },
  
  // Delete a report
  async deleteReport(reportId) {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('report_id', reportId);
    
    if (error) throw error;
  }
};

// Analytics functions
export const analytics = {
  // Get user usage statistics
  async getUserStats(userId) {
    // Get total claims
    const { data: claims, error: claimsError } = await supabase
      .from('claims')
      .select('claim_id')
      .eq('user_id', userId);
    
    if (claimsError) throw claimsError;
    
    // Get total photos
    const { count: photoCount, error: photoError } = await supabase
      .from('photos')
      .select('photo_id', { count: 'exact', head: true })
      .in('claim_id', claims.map(claim => claim.claim_id));
    
    if (photoError) throw photoError;
    
    // Get total reports
    const { count: reportCount, error: reportError } = await supabase
      .from('reports')
      .select('report_id', { count: 'exact', head: true })
      .in('claim_id', claims.map(claim => claim.claim_id));
    
    if (reportError) throw reportError;
    
    return {
      totalClaims: claims.length,
      totalPhotos: photoCount,
      totalReports: reportCount
    };
  },
  
  // Get claim statistics
  async getClaimStats(claimId) {
    // Get photo categories
    const { data: photos, error: photoError } = await supabase
      .from('photos')
      .select('category, severity_score, is_duplicate, is_low_quality')
      .eq('claim_id', claimId);
    
    if (photoError) throw photoError;
    
    // Calculate category distribution
    const categories = photos.reduce((acc, photo) => {
      acc[photo.category] = (acc[photo.category] || 0) + 1;
      return acc;
    }, {});
    
    // Calculate severity distribution
    const severityScores = photos.map(photo => photo.severity_score);
    const avgSeverity = severityScores.length > 0
      ? severityScores.reduce((sum, score) => sum + score, 0) / severityScores.length
      : 0;
    
    // Calculate quality metrics
    const duplicateCount = photos.filter(photo => photo.is_duplicate).length;
    const lowQualityCount = photos.filter(photo => photo.is_low_quality).length;
    
    return {
      totalPhotos: photos.length,
      categories,
      avgSeverity,
      duplicateCount,
      lowQualityCount
    };
  }
};

// Export all services
export default {
  auth,
  users,
  claims,
  photos,
  reports,
  analytics
};

