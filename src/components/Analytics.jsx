import React, { useState, useEffect } from 'react';
import { useClaim } from '../contexts/ClaimContext';
import { useAuth } from '../contexts/AuthContext';
import { BarChart3, PieChart, Calendar, Filter, Download, AlertTriangle } from 'lucide-react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export function Analytics() {
  const { state } = useClaim();
  const { profile } = useAuth();
  const [dateRange, setDateRange] = useState('all');
  const [chartType, setChartType] = useState('category');
  
  // Filter photos based on date range
  const getFilteredPhotos = () => {
    if (dateRange === 'all') {
      return state.processedPhotos;
    }
    
    const now = new Date();
    let startDate;
    
    switch (dateRange) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      default:
        return state.processedPhotos;
    }
    
    return state.processedPhotos.filter(photo => {
      const photoDate = new Date(photo.processedAt || photo.uploadedAt);
      return photoDate >= startDate;
    });
  };
  
  const filteredPhotos = getFilteredPhotos();
  
  // Calculate category distribution
  const getCategoryData = () => {
    const categories = {};
    
    filteredPhotos.forEach(photo => {
      categories[photo.category] = (categories[photo.category] || 0) + 1;
    });
    
    return {
      labels: Object.keys(categories).map(cat => cat.replace('-', ' ')),
      datasets: [
        {
          label: 'Photos by Category',
          data: Object.values(categories),
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };
  
  // Calculate severity distribution
  const getSeverityData = () => {
    const severities = { low: 0, medium: 0, high: 0 };
    
    filteredPhotos.forEach(photo => {
      severities[photo.severity] = (severities[photo.severity] || 0) + 1;
    });
    
    return {
      labels: Object.keys(severities),
      datasets: [
        {
          label: 'Photos by Severity',
          data: Object.values(severities),
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(255, 99, 132, 0.6)',
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };
  
  // Calculate quality metrics
  const getQualityData = () => {
    const duplicates = filteredPhotos.filter(photo => photo.isDuplicate).length;
    const lowQuality = filteredPhotos.filter(photo => photo.isLowQuality).length;
    const good = filteredPhotos.length - duplicates - lowQuality;
    
    return {
      labels: ['Good Quality', 'Duplicates', 'Low Quality'],
      datasets: [
        {
          label: 'Photo Quality',
          data: [good, duplicates, lowQuality],
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(255, 99, 132, 0.6)',
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };
  
  // Calculate upload trends
  const getTrendData = () => {
    // Group photos by date
    const photosByDate = {};
    
    filteredPhotos.forEach(photo => {
      const date = new Date(photo.uploadedAt).toLocaleDateString();
      photosByDate[date] = (photosByDate[date] || 0) + 1;
    });
    
    // Sort dates
    const sortedDates = Object.keys(photosByDate).sort((a, b) => new Date(a) - new Date(b));
    
    return {
      labels: sortedDates,
      datasets: [
        {
          label: 'Photos Uploaded',
          data: sortedDates.map(date => photosByDate[date]),
          fill: false,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          tension: 0.1
        },
      ],
    };
  };
  
  // Get chart options
  const getChartOptions = () => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: 'white'
          }
        },
        title: {
          display: true,
          text: getChartTitle(),
          color: 'white',
          font: {
            size: 16
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          titleColor: 'white',
          bodyColor: 'white',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          borderWidth: 1
        }
      },
      scales: chartType === 'trend' ? {
        x: {
          ticks: {
            color: 'white'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        },
        y: {
          ticks: {
            color: 'white'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        }
      } : undefined
    };
  };
  
  // Get chart title based on current selections
  const getChartTitle = () => {
    const timeFrame = dateRange === 'all' ? 'All Time' : 
                     dateRange === 'today' ? 'Today' : 
                     dateRange === 'week' ? 'Past Week' : 'Past Month';
    
    switch (chartType) {
      case 'category':
        return `Damage Categories (${timeFrame})`;
      case 'severity':
        return `Damage Severity (${timeFrame})`;
      case 'quality':
        return `Photo Quality (${timeFrame})`;
      case 'trend':
        return `Upload Trend (${timeFrame})`;
      default:
        return 'Analytics';
    }
  };
  
  // Render the appropriate chart based on selection
  const renderChart = () => {
    const options = getChartOptions();
    
    switch (chartType) {
      case 'category':
        return <Pie data={getCategoryData()} options={options} />;
      case 'severity':
        return <Pie data={getSeverityData()} options={options} />;
      case 'quality':
        return <Pie data={getQualityData()} options={options} />;
      case 'trend':
        return <Line data={getTrendData()} options={options} />;
      default:
        return null;
    }
  };
  
  // Calculate summary statistics
  const getSummaryStats = () => {
    const totalPhotos = filteredPhotos.length;
    const highSeverity = filteredPhotos.filter(photo => photo.severity === 'high').length;
    const avgSeverity = totalPhotos > 0 
      ? filteredPhotos.reduce((sum, photo) => sum + photo.severityScore, 0) / totalPhotos
      : 0;
    const duplicates = filteredPhotos.filter(photo => photo.isDuplicate).length;
    const lowQuality = filteredPhotos.filter(photo => photo.isLowQuality).length;
    
    return {
      totalPhotos,
      highSeverity,
      avgSeverity: avgSeverity.toFixed(1),
      duplicates,
      lowQuality
    };
  };
  
  const stats = getSummaryStats();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="glass-card p-6 rounded-lg">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-8 h-8 text-accent" />
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalPhotos}</p>
              <p className="text-white/70">Total Photos</p>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-6 rounded-lg">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-8 h-8 text-red-400" />
            <div>
              <p className="text-2xl font-bold text-white">{stats.highSeverity}</p>
              <p className="text-white/70">High Severity</p>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-6 rounded-lg">
          <div className="flex items-center space-x-3">
            <PieChart className="w-8 h-8 text-yellow-400" />
            <div>
              <p className="text-2xl font-bold text-white">{stats.avgSeverity}/10</p>
              <p className="text-white/70">Avg. Severity</p>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-6 rounded-lg">
          <div className="flex items-center space-x-3">
            <Filter className="w-8 h-8 text-orange-400" />
            <div>
              <p className="text-2xl font-bold text-white">{stats.duplicates}</p>
              <p className="text-white/70">Duplicates</p>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-6 rounded-lg">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-8 h-8 text-orange-400" />
            <div>
              <p className="text-2xl font-bold text-white">{stats.lowQuality}</p>
              <p className="text-white/70">Low Quality</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chart Controls */}
      <div className="glass-card p-6 rounded-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div>
              <label className="block text-white font-medium mb-2">Chart Type</label>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg text-white px-3 py-2 focus:outline-none focus:border-accent"
              >
                <option value="category">Damage Categories</option>
                <option value="severity">Severity Distribution</option>
                <option value="quality">Photo Quality</option>
                <option value="trend">Upload Trend</option>
              </select>
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Time Period</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg text-white px-3 py-2 focus:outline-none focus:border-accent"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Past Week</option>
                <option value="month">Past Month</option>
              </select>
            </div>
          </div>
          
          <button className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>
        </div>
      </div>
      
      {/* Chart */}
      <div className="glass-card p-6 rounded-lg">
        <div className="h-80">
          {filteredPhotos.length > 0 ? (
            renderChart()
          ) : (
            <div className="h-full flex flex-col items-center justify-center">
              <BarChart3 className="w-16 h-16 text-white/30 mb-4" />
              <p className="text-white/70 text-lg">No data available for the selected period</p>
              <p className="text-white/50 text-sm mt-2">Upload and process some photos to see analytics</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Subscription Upsell (for free tier) */}
      {profile?.subscription_tier === 'free' && (
        <div className="glass-card p-6 rounded-lg bg-gradient-to-r from-purple-800/50 to-indigo-800/50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h3 className="text-xl font-semibold text-white">Unlock Advanced Analytics</h3>
              <p className="text-white/70 mt-1">
                Upgrade to Pro or Business plan to access advanced analytics features, 
                including custom date ranges, export options, and predictive insights.
              </p>
            </div>
            <button className="bg-white text-purple-800 px-6 py-3 rounded-lg font-medium hover:bg-white/90 transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

