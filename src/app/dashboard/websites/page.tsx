'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Globe, 
  Search, 
  Calendar,
  ExternalLink,
  Filter,
  Download,
  RefreshCw,
  AlertCircle,
  Mail,
  CheckCircle,
  Clock
} from 'lucide-react'
import { useState } from 'react'
import { useData } from '@/contexts/DataContext'

export default function WebsitesPage() {
  // Use global data context
  const { websites: websiteData, loading, error, refreshData } = useData()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const getStatusColor = (status: string | undefined) => {
    if (!status) return 'bg-gray-100 text-gray-800'
    const statusLower = status.toLowerCase()
    switch (statusLower) {
      case 'email_sent':
        return 'bg-green-100 text-green-800'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'pending':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredWebsites = websiteData.filter(website => {
    const matchesSearch = (website.url || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (website.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (website.contactEmail || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || (website.keywordsUsed || '').toLowerCase().includes(selectedCategory.toLowerCase())
    return matchesSearch && matchesCategory
  })

  // Get unique keywords for filtering
  const allKeywords = websiteData
    .map(w => w.keywordsUsed)
    .filter(k => k && k.trim() !== '')
    .flatMap(k => k.split(',').map(kw => kw.trim()))
    .filter(kw => kw !== '')
  const categories = Array.from(new Set(allKeywords))
  
  const totalWebsites = websiteData.length
  const emailSentWebsites = websiteData.filter(w => w.contactStatus && w.contactStatus.toLowerCase() === 'email_sent').length
  const pendingWebsites = websiteData.filter(w => w.contactStatus && w.contactStatus.toLowerCase() === 'pending').length
  const withContactsWebsites = websiteData.filter(w => w.contactEmail && w.contactEmail.trim() !== '').length

  return (
    <div className="space-y-6 md:space-y-8 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 truncate">Website Discovery</h1>
          <p className="text-sm md:text-base text-gray-600 mt-2">
            Track discovered websites and email extraction progress
          </p>
        </div>
        <Button 
          onClick={refreshData} 
          disabled={loading}
          size="sm"
          className="flex items-center gap-2 flex-shrink-0"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800">Warning</p>
              <p className="text-xs text-yellow-700">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Websites
            </CardTitle>
            <Globe className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {loading ? '...' : totalWebsites}
            </div>
            <p className="text-xs text-gray-500 mt-1">Gaming websites found</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              With Contacts
            </CardTitle>
            <Mail className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {loading ? '...' : withContactsWebsites}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {totalWebsites > 0 ? `${((withContactsWebsites / totalWebsites) * 100).toFixed(1)}% have contact info` : 'No data'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Email Sent
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {loading ? '...' : emailSentWebsites}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {totalWebsites > 0 ? `${((emailSentWebsites / totalWebsites) * 100).toFixed(1)}% contacted` : 'No data'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {loading ? '...' : pendingWebsites}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {totalWebsites > 0 ? `${((pendingWebsites / totalWebsites) * 100).toFixed(1)}% awaiting contact` : 'No data'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div>
              <CardTitle className="text-lg md:text-xl">Website Directory</CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Browse and manage discovered websites
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="text-xs md:text-sm">
                <Filter className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="text-xs md:text-sm">
                <Download className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search websites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Website Table - Desktop */}
          <div className="hidden lg:block overflow-x-auto -mx-6 px-6">
            <table className="w-full min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 md:px-4 font-medium text-gray-700 text-sm whitespace-nowrap">Website</th>
                  <th className="text-left py-3 px-2 md:px-4 font-medium text-gray-700 text-sm whitespace-nowrap">Category</th>
                  <th className="text-left py-3 px-2 md:px-4 font-medium text-gray-700 text-sm whitespace-nowrap">Date Found</th>
                  <th className="text-left py-3 px-2 md:px-4 font-medium text-gray-700 text-sm whitespace-nowrap">Contact</th>
                  <th className="text-left py-3 px-2 md:px-4 font-medium text-gray-700 text-sm whitespace-nowrap">Status</th>
                  <th className="text-left py-3 px-2 md:px-4 font-medium text-gray-700 text-sm whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWebsites.map((website) => (
                  <tr key={website.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 md:px-4 max-w-xs">
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900 text-sm truncate">{website.title || 'No title'}</div>
                        <div className="text-xs text-gray-500 truncate">{website.url}</div>
                      </div>
                    </td>
                    <td className="py-3 px-2 md:px-4">
                      <Badge variant="outline" className="text-xs whitespace-nowrap">{website.keywordsUsed || website.category || 'N/A'}</Badge>
                    </td>
                    <td className="py-3 px-2 md:px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600">{website.dateFound}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 md:px-4">
                      <span className="text-xs text-gray-600 truncate max-w-[150px] block">
                        {website.contactEmail || 'N/A'}
                      </span>
                    </td>
                    <td className="py-3 px-2 md:px-4">
                      <Badge className={`${getStatusColor(website.contactStatus)} text-xs whitespace-nowrap`}>
                        {website.contactStatus || 'pending'}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 md:px-4">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => window.open(website.url, '_blank')}
                        className="h-8 w-8 p-0"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Website Cards - Mobile/Tablet */}
          <div className="lg:hidden space-y-4">
            {filteredWebsites.map((website) => (
              <Card key={website.id} className="border-gray-200 overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm line-clamp-2">{website.title || 'No title'}</h3>
                      <p className="text-xs text-gray-500 truncate mt-1">{website.url}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex-shrink-0 h-8 w-8 p-0"
                      onClick={() => window.open(website.url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2 text-xs">
                      <span className="text-gray-500 flex-shrink-0">Keywords:</span>
                      <Badge variant="outline" className="text-xs truncate max-w-[60%]">
                        {website.keywordsUsed || website.category || 'N/A'}
                      </Badge>
                    </div>
                    
                    {website.contactEmail && (
                      <div className="flex justify-between items-start gap-2 text-xs">
                        <span className="text-gray-500 flex-shrink-0">Contact:</span>
                        <span className="text-gray-900 truncate text-right flex-1">{website.contactEmail}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500">Date:</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-600">{website.dateFound}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs pt-2">
                      <span className="text-gray-500">Status:</span>
                      <Badge className={`${getStatusColor(website.contactStatus)} text-xs`}>
                        {website.contactStatus || 'pending'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {loading && (
            <div className="text-center py-12">
              <RefreshCw className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mx-auto mb-4 animate-spin" />
              <p className="text-sm md:text-base text-gray-500">Loading websites from Google Sheets...</p>
            </div>
          )}

          {!loading && filteredWebsites.length === 0 && (
            <div className="text-center py-8">
              <Globe className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm md:text-base text-gray-500">No websites found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
