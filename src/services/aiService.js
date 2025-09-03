import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'demo-key',
  baseURL: import.meta.env.VITE_OPENAI_BASE_URL || "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

// Check if OpenAI API key is configured
const isOpenAIConfigured = import.meta.env.VITE_OPENAI_API_KEY && 
                          import.meta.env.VITE_OPENAI_API_KEY !== 'demo-key';

// Process photos with AI
export async function processPhotosWithAI(photos) {
  const processedPhotos = [];

  for (const photo of photos) {
    try {
      let analysis;
      
      // Use real OpenAI API if configured, otherwise use mock analysis
      if (isOpenAIConfigured) {
        analysis = await analyzeImageWithOpenAI(photo.url);
      } else {
        // Simulate AI processing delay
        await new Promise(resolve => setTimeout(resolve, 500));
        analysis = await mockAnalyzeImage(photo);
      }
      
      processedPhotos.push({
        ...photo,
        ...analysis,
        processedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error processing photo:', error);
      // Fallback to basic categorization
      processedPhotos.push({
        ...photo,
        category: 'uncategorized',
        tags: ['unprocessed'],
        severity: 'low',
        severityScore: 1,
        isDuplicate: false,
        isLowQuality: false,
        processedAt: new Date().toISOString()
      });
    }
  }

  return processedPhotos;
}

// Mock AI analysis function (used when OpenAI API is not configured)
async function mockAnalyzeImage(photo) {
  // Simulate different damage types based on filename
  const filename = photo.name.toLowerCase();
  
  let category = 'general';
  let tags = [];
  let severity = 'low';
  let severityScore = Math.floor(Math.random() * 10) + 1;

  // Basic keyword-based categorization for demo
  if (filename.includes('roof') || filename.includes('shingle')) {
    category = 'roof-damage';
    tags = ['Roof Damage', 'Shingles', 'Weather Damage'];
    severity = Math.random() > 0.5 ? 'high' : 'medium';
    severityScore = Math.floor(Math.random() * 5) + 6;
  } else if (filename.includes('water') || filename.includes('flood') || filename.includes('leak')) {
    category = 'water-damage';
    tags = ['Water Damage', 'Moisture', 'Flooding'];
    severity = Math.random() > 0.3 ? 'high' : 'medium';
    severityScore = Math.floor(Math.random() * 4) + 7;
  } else if (filename.includes('electrical') || filename.includes('wire') || filename.includes('outlet')) {
    category = 'electrical';
    tags = ['Electrical', 'Wiring', 'Safety Hazard'];
    severity = 'high';
    severityScore = Math.floor(Math.random() * 3) + 8;
  } else if (filename.includes('structure') || filename.includes('wall') || filename.includes('foundation')) {
    category = 'structural';
    tags = ['Structural', 'Foundation', 'Building Integrity'];
    severity = Math.random() > 0.4 ? 'high' : 'medium';
    severityScore = Math.floor(Math.random() * 6) + 5;
  } else if (filename.includes('exterior') || filename.includes('siding') || filename.includes('window')) {
    category = 'exterior';
    tags = ['Exterior', 'Siding', 'Windows'];
    severity = Math.random() > 0.6 ? 'medium' : 'low';
    severityScore = Math.floor(Math.random() * 6) + 2;
  } else {
    category = 'interior';
    tags = ['Interior', 'General Damage'];
    severity = Math.random() > 0.7 ? 'medium' : 'low';
    severityScore = Math.floor(Math.random() * 5) + 1;
  }

  // Add some common insurance tags
  const additionalTags = ['Property Damage', 'Insurance Claim', 'Documentation'];
  tags.push(...additionalTags.slice(0, Math.floor(Math.random() * 3) + 1));

  // Simulate duplicate detection (random for demo)
  const isDuplicate = Math.random() < 0.1; // 10% chance of duplicate

  // Simulate quality detection (random for demo)
  const isLowQuality = Math.random() < 0.15; // 15% chance of low quality

  return {
    category,
    tags,
    severity,
    severityScore,
    isDuplicate,
    isLowQuality
  };
}

// Real OpenAI integration function
export async function analyzeImageWithOpenAI(imageUrl) {
  try {
    // First try with OpenRouter/Gemini if configured
    try {
      const response = await openai.chat.completions.create({
        model: "google/gemini-2.0-flash-001",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this property damage image and provide:
                1. Damage category (roof-damage, water-damage, electrical, structural, exterior, interior)
                2. Relevant tags for insurance purposes (provide at least 3-5 specific tags)
                3. Severity score (1-10) and level (low, medium, high)
                4. Whether it appears to be a duplicate or low quality image
                
                Return as JSON with keys: category, tags (array of strings), severity (string), severityScore (number), isDuplicate (boolean), isLowQuality (boolean)`
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        max_tokens: 500
      });

      const analysisText = response.choices[0].message.content;
      
      // Extract JSON from the response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        
        // Validate and sanitize the response
        return {
          category: analysis.category || 'uncategorized',
          tags: Array.isArray(analysis.tags) ? analysis.tags : ['Unspecified'],
          severity: ['low', 'medium', 'high'].includes(analysis.severity) ? analysis.severity : 'low',
          severityScore: typeof analysis.severityScore === 'number' ? analysis.severityScore : 1,
          isDuplicate: typeof analysis.isDuplicate === 'boolean' ? analysis.isDuplicate : false,
          isLowQuality: typeof analysis.isLowQuality === 'boolean' ? analysis.isLowQuality : false
        };
      }
      
      throw new Error('Invalid response format from AI');
    } catch (openRouterError) {
      console.error('OpenRouter API error:', openRouterError);
      
      // Fall back to OpenAI GPT-4 Vision if available
      if (import.meta.env.VITE_USE_OPENAI_FALLBACK === 'true') {
        const response = await openai.chat.completions.create({
          model: "gpt-4-vision-preview",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Analyze this property damage image and provide:
                  1. Damage category (roof-damage, water-damage, electrical, structural, exterior, interior)
                  2. Relevant tags for insurance purposes (provide at least 3-5 specific tags)
                  3. Severity score (1-10) and level (low, medium, high)
                  4. Whether it appears to be a duplicate or low quality image
                  
                  Return as JSON with keys: category, tags (array of strings), severity (string), severityScore (number), isDuplicate (boolean), isLowQuality (boolean)`
                },
                {
                  type: "image_url",
                  image_url: {
                    url: imageUrl
                  }
                }
              ]
            }
          ],
          max_tokens: 500
        });
        
        const analysisText = response.choices[0].message.content;
        
        // Extract JSON from the response
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const analysis = JSON.parse(jsonMatch[0]);
          
          // Validate and sanitize the response
          return {
            category: analysis.category || 'uncategorized',
            tags: Array.isArray(analysis.tags) ? analysis.tags : ['Unspecified'],
            severity: ['low', 'medium', 'high'].includes(analysis.severity) ? analysis.severity : 'low',
            severityScore: typeof analysis.severityScore === 'number' ? analysis.severityScore : 1,
            isDuplicate: typeof analysis.isDuplicate === 'boolean' ? analysis.isDuplicate : false,
            isLowQuality: typeof analysis.isLowQuality === 'boolean' ? analysis.isLowQuality : false
          };
        }
        
        throw new Error('Invalid response format from AI');
      } else {
        throw openRouterError;
      }
    }
  } catch (error) {
    console.error('AI analysis error:', error);
    throw error;
  }
}

// Compare images to detect duplicates
export async function detectDuplicates(photos) {
  // This would ideally use AI to compare images
  // For now, we'll use a simple filename-based approach
  const duplicates = [];
  const fileNames = new Map();
  
  photos.forEach(photo => {
    const baseName = photo.name.split('.')[0].toLowerCase();
    
    if (fileNames.has(baseName)) {
      // Mark both the current and previous photo as duplicates
      duplicates.push(photo.id);
      duplicates.push(fileNames.get(baseName));
    } else {
      fileNames.set(baseName, photo.id);
    }
  });
  
  return duplicates;
}

// Detect low quality images
export async function detectLowQualityImages(photos) {
  // This would ideally use AI to detect blurry or low-quality images
  // For now, we'll use a simple size-based approach
  const lowQualityThreshold = 50 * 1024; // 50KB
  
  return photos
    .filter(photo => photo.size < lowQualityThreshold)
    .map(photo => photo.id);
}

// Export all functions
export default {
  processPhotosWithAI,
  analyzeImageWithOpenAI,
  detectDuplicates,
  detectLowQualityImages
};
