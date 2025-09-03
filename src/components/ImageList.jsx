import React, { useState } from 'react'
import { Tag, Filter, Search, Download, AlertTriangle } from 'lucide-react'
import { useClaim } from '../contexts/ClaimContext'
import { TaggingInput } from './TaggingInput'

export function ImageList() {
  const { state } = useClaim()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  const categories = [
    'all',
    'roof-damage',
    'water-damage',
    'electrical',
    'structural',
    'exterior',
    'interior'
  ]

  const severityColors = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500'
  }

  const filteredPhotos = state.processedPhotos.filter(photo => {
    const matchesCategory = selectedCategory === 'all' || photo.category === selectedCategory
    const matchesSearch = photo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Filters and Search */}
      <div className="glass-card p-6 rounded-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                type="text"
                placeholder="Search photos or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="text-white/70 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg text-white px-3 py-2 focus:outline-none focus:border-accent"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-gray-800">
                    {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-white/70">
            {filteredPhotos.length} of {state.processedPhotos.length} photos
          </div>
        </div>
      </div>

      {/* Photo Grid */}
      <div className="photo-grid">
        {filteredPhotos.map(photo => (
          <div 
            key={photo.id} 
            className="glass-card rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedPhoto(photo)}
          >
            <div className="relative">
              <img
                src={photo.url}
                alt={photo.name}
                className="w-full h-48 object-cover"
              />
              
              {/* Severity indicator */}
              <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${severityColors[photo.severity]}`} />
              
              {/* Duplicate/Quality flags */}
              {photo.isDuplicate && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  Duplicate
                </div>
              )}
              {photo.isLowQuality && (
                <div className="absolute top-8 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                  Low Quality
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="text-white font-medium text-sm mb-2 truncate">
                {photo.name}
              </h3>
              
              <div className="mb-3">
                <span className="inline-block bg-accent/20 text-accent text-xs px-2 py-1 rounded">
                  {photo.category.replace('-', ' ')}
                </span>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {photo.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="bg-white/10 text-white text-xs px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
                {photo.tags.length > 3 && (
                  <span className="text-white/50 text-xs">
                    +{photo.tags.length - 3} more
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-white/50">
                <span>Score: {photo.severityScore}/10</span>
                <span>{(photo.size / 1024 / 1024).toFixed(1)}MB</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPhotos.length === 0 && (
        <div className="glass-card p-12 rounded-lg text-center">
          <AlertTriangle className="mx-auto w-16 h-16 text-white/50 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No photos found</h3>
          <p className="text-white/70">
            {state.processedPhotos.length === 0 
              ? "Upload some photos to get started."
              : "Try adjusting your filters or search terms."
            }
          </p>
        </div>
      )}

      {/* Photo Detail Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="glass-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">{selectedPhoto.name}</h2>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="text-white/70 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedPhoto.url}
                    alt={selectedPhoto.name}
                    className="w-full rounded-lg"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/70">Category:</span>
                        <span className="text-white">{selectedPhoto.category.replace('-', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Severity:</span>
                        <span className={`font-medium ${
                          selectedPhoto.severity === 'high' ? 'text-red-400' :
                          selectedPhoto.severity === 'medium' ? 'text-yellow-400' :
                          'text-green-400'
                        }`}>
                          {selectedPhoto.severity} ({selectedPhoto.severityScore}/10)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">File size:</span>
                        <span className="text-white">{(selectedPhoto.size / 1024 / 1024).toFixed(1)}MB</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Tags</h3>
                    <TaggingInput
                      photo={selectedPhoto}
                      onTagsUpdate={(newTags) => {
                        // Update tags in state
                        console.log('Updated tags:', newTags)
                      }}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 bg-accent hover:bg-accent/90 text-white py-2 px-4 rounded-lg transition-colors">
                      <Download className="w-4 h-4 inline mr-2" />
                      Download
                    </button>
                    <button className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg transition-colors">
                      Add to Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}