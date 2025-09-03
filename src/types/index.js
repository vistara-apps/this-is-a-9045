/**
 * @typedef {Object} User
 * @property {string} user_id - Unique identifier for the user
 * @property {string} email - User's email address
 * @property {string} subscription_tier - User's subscription tier (free, pro, business)
 * @property {string} created_at - ISO timestamp of when the user was created
 */

/**
 * @typedef {Object} Claim
 * @property {string} claim_id - Unique identifier for the claim
 * @property {string} user_id - ID of the user who owns the claim
 * @property {string} claim_number - Human-readable claim number
 * @property {string} status - Current status of the claim (open, closed, etc.)
 * @property {string} created_at - ISO timestamp of when the claim was created
 */

/**
 * @typedef {Object} Photo
 * @property {string} photo_id - Unique identifier for the photo
 * @property {string} claim_id - ID of the claim the photo belongs to
 * @property {string} original_filename - Original filename of the photo
 * @property {string} storage_url - URL where the photo is stored
 * @property {string[]} tags - Array of tags associated with the photo
 * @property {string} category - Category of damage shown in the photo
 * @property {number} severity_score - Numerical score of damage severity (1-10)
 * @property {boolean} is_duplicate - Whether the photo is a duplicate
 * @property {boolean} is_low_quality - Whether the photo is low quality
 * @property {string} uploaded_at - ISO timestamp of when the photo was uploaded
 */

/**
 * @typedef {Object} Report
 * @property {string} report_id - Unique identifier for the report
 * @property {string} claim_id - ID of the claim the report belongs to
 * @property {string} title - Title of the report
 * @property {Object} content - Content of the report
 * @property {string[]} photo_ids - Array of photo IDs included in the report
 * @property {string} created_at - ISO timestamp of when the report was created
 */

/**
 * @typedef {Object} PhotoAnalysis
 * @property {string} category - Category of damage shown in the photo
 * @property {string[]} tags - Array of tags associated with the photo
 * @property {string} severity - Severity level (low, medium, high)
 * @property {number} severityScore - Numerical score of damage severity (1-10)
 * @property {boolean} isDuplicate - Whether the photo is a duplicate
 * @property {boolean} isLowQuality - Whether the photo is low quality
 * @property {string} processedAt - ISO timestamp of when the photo was processed
 */

/**
 * @typedef {Object} UploadedPhoto
 * @property {string} id - Unique identifier for the photo
 * @property {File} file - Original file object
 * @property {string} url - URL where the photo is stored or displayed
 * @property {string} name - Name of the photo file
 * @property {number} size - Size of the photo in bytes
 * @property {string} uploadedAt - ISO timestamp of when the photo was uploaded
 */

/**
 * @typedef {Object} ProcessedPhoto
 * @property {string} id - Unique identifier for the photo
 * @property {File} file - Original file object
 * @property {string} url - URL where the photo is stored or displayed
 * @property {string} name - Name of the photo file
 * @property {number} size - Size of the photo in bytes
 * @property {string} uploadedAt - ISO timestamp of when the photo was uploaded
 * @property {string} category - Category of damage shown in the photo
 * @property {string[]} tags - Array of tags associated with the photo
 * @property {string} severity - Severity level (low, medium, high)
 * @property {number} severityScore - Numerical score of damage severity (1-10)
 * @property {boolean} isDuplicate - Whether the photo is a duplicate
 * @property {boolean} isLowQuality - Whether the photo is low quality
 * @property {string} processedAt - ISO timestamp of when the photo was processed
 */

/**
 * @typedef {Object} GeneratedReport
 * @property {string} id - Unique identifier for the report
 * @property {string} title - Title of the report
 * @property {string} generatedAt - ISO timestamp of when the report was generated
 * @property {ProcessedPhoto[]} photos - Array of photos included in the report
 * @property {Object} summary - Summary statistics for the report
 * @property {number} summary.totalPhotos - Total number of photos in the report
 * @property {Object} summary.categoryCounts - Counts of photos by category
 * @property {Object} summary.severityCounts - Counts of photos by severity
 * @property {number} summary.averageSeverity - Average severity score of all photos
 */

/**
 * @typedef {Object} ReportConfig
 * @property {string} title - Title of the report
 * @property {string[]} includeCategories - Categories to include in the report
 * @property {boolean} includeLowQuality - Whether to include low quality photos
 * @property {boolean} includeDuplicates - Whether to include duplicate photos
 * @property {string} severityFilter - Severity filter (all, high, medium, low)
 * @property {string} sortBy - Sort order (upload-date, severity, category)
 */

/**
 * @typedef {Object} AuthState
 * @property {Object|null} user - Current authenticated user
 * @property {Object|null} profile - User profile data
 * @property {boolean} loading - Whether authentication is loading
 * @property {string|null} error - Authentication error message
 */

/**
 * @typedef {Object} ClaimState
 * @property {Claim|null} currentClaim - Current active claim
 * @property {UploadedPhoto[]} photos - Array of uploaded photos
 * @property {ProcessedPhoto[]} processedPhotos - Array of processed photos
 * @property {boolean} isProcessing - Whether photos are being processed
 * @property {GeneratedReport[]} reports - Array of generated reports
 */

export {};

