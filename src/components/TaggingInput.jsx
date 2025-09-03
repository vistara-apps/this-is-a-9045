import React, { useState } from 'react'
import { Tag, Plus, X } from 'lucide-react'

export function TaggingInput({ photo, onTagsUpdate }) {
  const [newTag, setNewTag] = useState('')
  const [tags, setTags] = useState(photo.tags || [])

  const commonTags = [
    'Water Damage', 'Structural', 'Electrical', 'Roof Leak', 'Fire Damage',
    'Mold', 'Broken Window', 'Foundation', 'HVAC', 'Plumbing'
  ]

  const addTag = (tag) => {
    if (tag && !tags.includes(tag)) {
      const updatedTags = [...tags, tag]
      setTags(updatedTags)
      onTagsUpdate(updatedTags)
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove)
    setTags(updatedTags)
    onTagsUpdate(updatedTags)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag(newTag.trim())
    }
  }

  return (
    <div className="space-y-3">
      {/* Current Tags */}
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <span 
            key={tag}
            className="inline-flex items-center space-x-1 bg-accent/20 text-accent px-2 py-1 rounded text-sm"
          >
            <span>{tag}</span>
            <button
              onClick={() => removeTag(tag)}
              className="hover:text-accent/70"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>

      {/* Add New Tag */}
      <div className="flex space-x-2">
        <div className="flex-1">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add new tag..."
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:border-accent"
          />
        </div>
        <button
          onClick={() => addTag(newTag.trim())}
          className="bg-accent hover:bg-accent/90 text-white px-3 py-2 rounded transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Common Tags */}
      <div>
        <p className="text-white/70 text-sm mb-2">Common tags:</p>
        <div className="flex flex-wrap gap-2">
          {commonTags.filter(tag => !tags.includes(tag)).slice(0, 6).map(tag => (
            <button
              key={tag}
              onClick={() => addTag(tag)}
              className="bg-white/10 hover:bg-white/20 text-white text-xs px-2 py-1 rounded transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}