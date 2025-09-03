import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'demo-key',
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
})

// Mock AI processing for demo purposes (replace with real API calls in production)
export async function processPhotosWithAI(photos) {
  const processedPhotos = []

  for (const photo of photos) {
    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 500))

      // Mock AI analysis results
      const analysis = await mockAnalyzeImage(photo)
      
      processedPhotos.push({
        ...photo,
        ...analysis
      })
    } catch (error) {
      console.error('Error processing photo:', error)
      // Fallback to basic categorization
      processedPhotos.push({
        ...photo,
        category: 'uncategorized',
        tags: ['unprocessed'],
        severity: 'low',
        severityScore: 1,
        isDuplicate: false,
        isLowQuality: false
      })
    }
  }

  return processedPhotos
}

// Mock AI analysis function (replace with real OpenAI API calls)
async function mockAnalyzeImage(photo) {
  // Simulate different damage types based on filename
  const filename = photo.name.toLowerCase()
  
  let category = 'general'
  let tags = []
  let severity = 'low'
  let severityScore = Math.floor(Math.random() * 10) + 1

  // Basic keyword-based categorization for demo
  if (filename.includes('roof') || filename.includes('shingle')) {
    category = 'roof-damage'
    tags = ['Roof Damage', 'Shingles', 'Weather Damage']
    severity = Math.random() > 0.5 ? 'high' : 'medium'
    severityScore = Math.floor(Math.random() * 5) + 6
  } else if (filename.includes('water') || filename.includes('flood') || filename.includes('leak')) {
    category = 'water-damage'
    tags = ['Water Damage', 'Moisture', 'Flooding']
    severity = Math.random() > 0.3 ? 'high' : 'medium'
    severityScore = Math.floor(Math.random() * 4) + 7
  } else if (filename.includes('electrical') || filename.includes('wire') || filename.includes('outlet')) {
    category = 'electrical'
    tags = ['Electrical', 'Wiring', 'Safety Hazard']
    severity = 'high'
    severityScore = Math.floor(Math.random() * 3) + 8
  } else if (filename.includes('structure') || filename.includes('wall') || filename.includes('foundation')) {
    category = 'structural'
    tags = ['Structural', 'Foundation', 'Building Integrity']
    severity = Math.random() > 0.4 ? 'high' : 'medium'
    severityScore = Math.floor(Math.random() * 6) + 5
  } else if (filename.includes('exterior') || filename.includes('siding') || filename.includes('window')) {
    category = 'exterior'
    tags = ['Exterior', 'Siding', 'Windows']
    severity = Math.random() > 0.6 ? 'medium' : 'low'
    severityScore = Math.floor(Math.random() * 6) + 2
  } else {
    category = 'interior'
    tags = ['Interior', 'General Damage']
    severity = Math.random() > 0.7 ? 'medium' : 'low'
    severityScore = Math.floor(Math.random() * 5) + 1
  }

  // Add some common insurance tags
  const additionalTags = ['Property Damage', 'Insurance Claim', 'Documentation']
  tags.push(...additionalTags.slice(0, Math.floor(Math.random() * 3) + 1))

  // Simulate duplicate detection (random for demo)
  const isDuplicate = Math.random() < 0.1 // 10% chance of duplicate

  // Simulate quality detection (random for demo)
  const isLowQuality = Math.random() < 0.15 // 15% chance of low quality

  return {
    category,
    tags,
    severity,
    severityScore,
    isDuplicate,
    isLowQuality,
    processedAt: new Date().toISOString()
  }
}

// Real OpenAI integration function (commented out for demo)
export async function analyzeImageWithOpenAI(imageUrl) {
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
              2. Relevant tags for insurance purposes
              3. Severity score (1-10) and level (low, medium, high)
              4. Whether it appears to be a duplicate or low quality image
              
              Return as JSON with keys: category, tags, severity, severityScore, isDuplicate, isLowQuality`
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
    })

    const analysis = JSON.parse(response.choices[0].message.content)
    return analysis
  } catch (error) {
    console.error('OpenAI API error:', error)
    throw error
  }
}