import React, { useCallback, useState } from 'react'
import { Upload, Camera, AlertCircle, CheckCircle } from 'lucide-react'
import { useClaim } from '../contexts/ClaimContext'
import { processPhotosWithAI } from '../services/aiService'

export function FileUploadComponent() {
  const { state, dispatch } = useClaim()
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    )

    if (files.length > 0) {
      await processFiles(files)
    }
  }, [])

  const handleFileInput = useCallback(async (e) => {
    const files = Array.from(e.target.files).filter(file => 
      file.type.startsWith('image/')
    )

    if (files.length > 0) {
      await processFiles(files)
    }
  }, [])

  const processFiles = async (files) => {
    // Add photos to state
    const photoObjects = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      uploadedAt: new Date().toISOString()
    }))

    dispatch({ type: 'ADD_PHOTOS', payload: photoObjects })
    dispatch({ type: 'START_PROCESSING' })

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i)
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      // Process with AI
      const processedPhotos = await processPhotosWithAI(photoObjects)
      dispatch({ type: 'FINISH_PROCESSING', payload: processedPhotos })
      
      setUploadProgress(0)
    } catch (error) {
      console.error('Error processing photos:', error)
      dispatch({ type: 'FINISH_PROCESSING', payload: photoObjects })
      setUploadProgress(0)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Upload Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-6 rounded-lg">
          <div className="flex items-center space-x-3">
            <Camera className="w-8 h-8 text-accent" />
            <div>
              <p className="text-2xl font-bold text-white">{state.photos.length}</p>
              <p className="text-white/70">Photos Uploaded</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6 rounded-lg">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-accent" />
            <div>
              <p className="text-2xl font-bold text-white">{state.processedPhotos.length}</p>
              <p className="text-white/70">AI Processed</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6 rounded-lg">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-8 h-8 text-orange-400" />
            <div>
              <p className="text-2xl font-bold text-white">
                {state.processedPhotos.filter(p => p.severity === 'high').length}
              </p>
              <p className="text-white/70">High Severity</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="glass-card p-8 rounded-lg">
        <div
          className={`
            border-2 border-dashed rounded-lg p-12 text-center transition-colors
            ${dragActive 
              ? 'border-accent bg-accent/10' 
              : 'border-white/30 hover:border-white/50'
            }
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto w-16 h-16 text-white/70 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Upload Property Damage Photos
          </h3>
          <p className="text-white/70 mb-6 max-w-md mx-auto">
            Drag and drop your photos here, or click to browse. 
            AI will automatically categorize and tag your images.
          </p>
          
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center space-x-2 bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-lg cursor-pointer transition-colors"
          >
            <Camera className="w-5 h-5" />
            <span>Browse Files</span>
          </label>

          {state.isProcessing && (
            <div className="mt-6">
              <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                <div 
                  className="bg-accent h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-white/70 text-sm">
                Processing photos with AI... {uploadProgress}%
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Photos Preview */}
      {state.photos.length > 0 && (
        <div className="glass-card p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-white mb-4">Recent Uploads</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {state.photos.slice(-6).map(photo => (
              <div key={photo.id} className="relative group">
                <img
                  src={photo.url}
                  alt={photo.name}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <p className="text-white text-xs text-center px-2">
                    {photo.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}