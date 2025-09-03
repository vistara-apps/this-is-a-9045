import React, { useState } from 'react'
import { FileText, Download, Share2, Filter, Calendar } from 'lucide-react'
import { useClaim } from '../contexts/ClaimContext'

export function ReportGenerator() {
  const { state, dispatch } = useClaim()
  const [reportConfig, setReportConfig] = useState({
    title: 'Property Damage Assessment',
    includeCategories: ['all'],
    includeLowQuality: false,
    includeDuplicates: false,
    severityFilter: 'all',
    sortBy: 'upload-date'
  })
  const [generatingReport, setGeneratingReport] = useState(false)

  const categories = [
    'all', 'roof-damage', 'water-damage', 'electrical', 'structural', 'exterior', 'interior'
  ]

  const generateReport = async () => {
    setGeneratingReport(true)
    
    // Filter photos based on configuration
    let filteredPhotos = state.processedPhotos.filter(photo => {
      const categoryMatch = reportConfig.includeCategories.includes('all') || 
                           reportConfig.includeCategories.includes(photo.category)
      const qualityMatch = reportConfig.includeLowQuality || !photo.isLowQuality
      const duplicateMatch = reportConfig.includeDuplicates || !photo.isDuplicate
      const severityMatch = reportConfig.severityFilter === 'all' || 
                           photo.severity === reportConfig.severityFilter
      
      return categoryMatch && qualityMatch && duplicateMatch && severityMatch
    })

    // Sort photos
    filteredPhotos.sort((a, b) => {
      switch (reportConfig.sortBy) {
        case 'severity':
          const severityOrder = { high: 3, medium: 2, low: 1 }
          return severityOrder[b.severity] - severityOrder[a.severity]
        case 'category':
          return a.category.localeCompare(b.category)
        case 'upload-date':
        default:
          return new Date(b.uploadedAt) - new Date(a.uploadedAt)
      }
    })

    const report = {
      id: Math.random().toString(36).substr(2, 9),
      title: reportConfig.title,
      generatedAt: new Date().toISOString(),
      photos: filteredPhotos,
      summary: {
        totalPhotos: filteredPhotos.length,
        categoryCounts: getCategoryCounts(filteredPhotos),
        severityCounts: getSeverityCounts(filteredPhotos),
        averageSeverity: getAverageSeverity(filteredPhotos)
      }
    }

    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    dispatch({ type: 'ADD_REPORT', payload: report })
    setGeneratingReport(false)
  }

  const getCategoryCounts = (photos) => {
    return photos.reduce((acc, photo) => {
      acc[photo.category] = (acc[photo.category] || 0) + 1
      return acc
    }, {})
  }

  const getSeverityCounts = (photos) => {
    return photos.reduce((acc, photo) => {
      acc[photo.severity] = (acc[photo.severity] || 0) + 1
      return acc
    }, {})
  }

  const getAverageSeverity = (photos) => {
    if (photos.length === 0) return 0
    const total = photos.reduce((sum, photo) => sum + photo.severityScore, 0)
    return (total / photos.length).toFixed(1)
  }

  const downloadReport = (report) => {
    // Create a simple HTML report
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${report.title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
          .photo-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
          .photo-item { border: 1px solid #ddd; padding: 10px; border-radius: 5px; }
          .photo-item img { width: 100%; height: 150px; object-fit: cover; }
          .summary { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${report.title}</h1>
          <p>Generated on: ${new Date(report.generatedAt).toLocaleString()}</p>
        </div>
        
        <div class="summary">
          <h2>Summary</h2>
          <p><strong>Total Photos:</strong> ${report.summary.totalPhotos}</p>
          <p><strong>Average Severity:</strong> ${report.summary.averageSeverity}/10</p>
          <p><strong>High Severity Items:</strong> ${report.summary.severityCounts.high || 0}</p>
        </div>

        <h2>Photo Documentation</h2>
        <div class="photo-grid">
          ${report.photos.map(photo => `
            <div class="photo-item">
              <img src="${photo.url}" alt="${photo.name}" />
              <h3>${photo.name}</h3>
              <p><strong>Category:</strong> ${photo.category}</p>
              <p><strong>Severity:</strong> ${photo.severity} (${photo.severityScore}/10)</p>
              <p><strong>Tags:</strong> ${photo.tags.join(', ')}</p>
            </div>
          `).join('')}
        </div>
      </body>
      </html>
    `

    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${report.title.replace(/\s+/g, '-')}-${report.id}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Report Configuration */}
      <div className="glass-card p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-white mb-6">Generate Report</h2>
        
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-2">Report Title</label>
              <input
                type="text"
                value={reportConfig.title}
                onChange={(e) => setReportConfig(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Include Categories</label>
              <div className="space-y-2">
                {categories.map(category => (
                  <label key={category} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={reportConfig.includeCategories.includes(category)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setReportConfig(prev => ({
                            ...prev,
                            includeCategories: [...prev.includeCategories, category]
                          }))
                        } else {
                          setReportConfig(prev => ({
                            ...prev,
                            includeCategories: prev.includeCategories.filter(c => c !== category)
                          }))
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-white">
                      {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-2">Severity Filter</label>
              <select
                value={reportConfig.severityFilter}
                onChange={(e) => setReportConfig(prev => ({ ...prev, severityFilter: e.target.value }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:border-accent"
              >
                <option value="all">All Severities</option>
                <option value="high">High Only</option>
                <option value="medium">Medium Only</option>
                <option value="low">Low Only</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Sort By</label>
              <select
                value={reportConfig.sortBy}
                onChange={(e) => setReportConfig(prev => ({ ...prev, sortBy: e.target.value }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:border-accent"
              >
                <option value="upload-date">Upload Date</option>
                <option value="severity">Severity</option>
                <option value="category">Category</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={reportConfig.includeLowQuality}
                  onChange={(e) => setReportConfig(prev => ({ ...prev, includeLowQuality: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-white">Include low quality photos</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={reportConfig.includeDuplicates}
                  onChange={(e) => setReportConfig(prev => ({ ...prev, includeDuplicates: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-white">Include duplicate photos</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={generateReport}
            disabled={generatingReport || state.processedPhotos.length === 0}
            className="bg-accent hover:bg-accent/90 disabled:bg-gray-500 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
          >
            <FileText className="w-5 h-5" />
            <span>{generatingReport ? 'Generating...' : 'Generate Report'}</span>
          </button>
        </div>
      </div>

      {/* Generated Reports */}
      {state.reports.length > 0 && (
        <div className="glass-card p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-white mb-4">Generated Reports</h3>
          
          <div className="space-y-4">
            {state.reports.map(report => (
              <div key={report.id} className="bg-white/5 p-4 rounded-lg">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div>
                    <h4 className="text-lg font-medium text-white">{report.title}</h4>
                    <p className="text-white/70 text-sm">
                      Generated {new Date(report.generatedAt).toLocaleString()}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-white/70">
                      <span>{report.summary.totalPhotos} photos</span>
                      <span>Avg severity: {report.summary.averageSeverity}/10</span>
                      <span>High priority: {report.summary.severityCounts.high || 0}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => downloadReport(report)}
                      className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded text-sm transition-colors flex items-center space-x-1"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                    <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded text-sm transition-colors flex items-center space-x-1">
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {state.processedPhotos.length === 0 && (
        <div className="glass-card p-12 rounded-lg text-center">
          <FileText className="mx-auto w-16 h-16 text-white/50 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No photos to report on</h3>
          <p className="text-white/70">
            Upload and process some photos first to generate reports.
          </p>
        </div>
      )}
    </div>
  )
}