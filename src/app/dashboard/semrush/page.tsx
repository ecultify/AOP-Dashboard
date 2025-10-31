'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Calendar,
  Send,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  RefreshCw,
  AlertCircle,
  BarChart3
} from 'lucide-react'
import { useState, useMemo } from 'react'
import { useData } from '@/contexts/DataContext'

export default function SemrushPage() {
  const { websites, campaigns, loading, error, refreshData } = useData()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')

  // Filter only Semrush websites
  const semrushWebsites = useMemo(() => {
    return websites
      .filter(w => w.platform && w.platform.toLowerCase() === 'semrush')
      .map((w, index) => ({
        id: index + 1,
        url: w.url || '',
        title: w.title || '',
        contactEmail: w.contactEmail || '',
        contactName: w.contactName || '',
        contactStatus: w.contactStatus?.toLowerCase() || 'pending',
        dateFound: w.dateFound || '',
        keywordsUsed: w.keywordsUsed || '',
        description: w.description || '',
        socialLinks: w.socialLinks || ''
      }))
  }, [websites])

  // Calculate stats for Semrush websites
  const totalSemrush = semrushWebsites.length
  const withEmail = semrushWebsites.filter(w => w.contactEmail && w.contactEmail.trim() !== '').length
  const emailSent = semrushWebsites.filter(w => w.contactStatus === 'email_sent').length
  const pending = semrushWebsites.filter(w => w.contactStatus === 'pending').length
  
  // Calculate email performance from campaigns
  const totalEmailsSent = campaigns.reduce((sum, c) => sum + c.emailsSent, 0)
  const totalOpened = campaigns.reduce((sum, c) => sum + c.opened, 0)
  const openRate = totalEmailsSent > 0 ? ((totalOpened / totalEmailsSent) * 100).toFixed(1) : '0.0'

  // Filter websites
  const filteredWebsites = semrushWebsites.filter(website => {
    const matchesSearch = website.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         website.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (website.contactEmail && website.contactEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (website.contactName && website.contactName.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = selectedStatus === 'all' || website.contactStatus === selectedStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'email_sent':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'email_sent':
        return <CheckCircle className="h-4 w-4" />
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'failed':
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Semrush Websites</h1>
          <p className="text-sm md:text-base text-gray-600 mt-2">
            Track websites discovered via Semrush and their outreach status
          </p>
        </div>
        <Button 
          onClick={refreshData} 
          disabled={loading}
          size="sm"
          className="flex items-center gap-2"
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Semrush Sites
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {loading ? '...' : totalSemrush}
            </div>
            <p className="text-xs text-gray-500 mt-1">Discovered via Semrush</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              With Email Contacts
            </CardTitle>
            <Eye className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {loading ? '...' : withEmail}
            </div>
            <p className="text-xs text-gray-500 mt-1">Contact emails found</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Emails Sent
            </CardTitle>
            <Send className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {loading ? '...' : emailSent}
            </div>
            <p className="text-xs text-gray-500 mt-1">Outreach completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending Outreach
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {loading ? '...' : pending}
            </div>
            <p className="text-xs text-gray-500 mt-1">Awaiting contact</p>
          </CardContent>
        </Card>
      </div>

      {/* Semrush Websites Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Semrush Website Directory</CardTitle>
              <CardDescription>
                All websites discovered via Semrush with outreach tracking
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search by website, email, or contact name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="email_sent">Email Sent</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
              <p className="text-sm text-gray-500">Loading Semrush websites...</p>
            </div>
          ) : filteredWebsites.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-500">
                {semrushWebsites.length === 0 
                  ? 'No Semrush websites found' 
                  : 'No websites match your search criteria'}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto -mx-6 px-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 md:px-4 font-medium text-gray-700 text-sm whitespace-nowrap">Website</th>
                      <th className="text-left py-3 px-2 md:px-4 font-medium text-gray-700 text-sm whitespace-nowrap">Contact</th>
                      <th className="text-left py-3 px-2 md:px-4 font-medium text-gray-700 text-sm whitespace-nowrap">Keywords</th>
                      <th className="text-left py-3 px-2 md:px-4 font-medium text-gray-700 text-sm whitespace-nowrap">Date Found</th>
                      <th className="text-left py-3 px-2 md:px-4 font-medium text-gray-700 text-sm whitespace-nowrap">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWebsites.map((website) => (
                      <tr key={website.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-2 md:px-4">
                          <div>
                            <div className="font-medium text-gray-900 text-sm truncate max-w-xs">{website.title || 'No title'}</div>
                            <div className="text-xs text-gray-500 truncate max-w-xs">{website.url}</div>
                          </div>
                        </td>
                        <td className="py-3 px-2 md:px-4">
                          <div>
                            <div className="text-sm text-gray-900">{website.contactName || 'No name'}</div>
                            <div className="text-xs text-gray-500 truncate max-w-xs">{website.contactEmail || 'No email'}</div>
                          </div>
                        </td>
                        <td className="py-3 px-2 md:px-4">
                          <Badge variant="outline" className="text-xs">{website.keywordsUsed || 'N/A'}</Badge>
                        </td>
                        <td className="py-3 px-2 md:px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span>{website.dateFound || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 md:px-4">
                          <Badge className={`${getStatusColor(website.contactStatus)} text-xs flex items-center gap-1 w-fit`}>
                            {getStatusIcon(website.contactStatus)}
                            {website.contactStatus.replace('_', ' ')}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile/Tablet Cards */}
              <div className="lg:hidden space-y-4">
                {filteredWebsites.map((website) => (
                  <Card key={website.id} className="border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 text-sm truncate">{website.title || 'No title'}</h3>
                          <p className="text-xs text-gray-500 truncate mt-1">{website.url}</p>
                        </div>
                        <Badge className={`${getStatusColor(website.contactStatus)} text-xs ml-2`}>
                          {website.contactStatus.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-xs">
                          <span className="text-gray-500">Contact: </span>
                          <span className="text-gray-900">{website.contactName || 'No name'}</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-gray-500">Email: </span>
                          <span className="text-gray-900 truncate block">{website.contactEmail || 'No email'}</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-gray-500">Keywords: </span>
                          <Badge variant="outline" className="text-xs">{website.keywordsUsed || 'N/A'}</Badge>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Calendar className="h-3 w-3" />
                          <span>{website.dateFound || 'N/A'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Results count */}
              <div className="mt-4 text-sm text-gray-500 text-center">
                Showing {filteredWebsites.length} of {semrushWebsites.length} Semrush websites
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Performance Overview */}
      {emailSent > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Semrush Outreach Performance</CardTitle>
            <CardDescription>
              Email campaign performance for Semrush-discovered websites
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Completion Rate</span>
                  <span className="text-sm text-gray-500">
                    {totalSemrush > 0 ? ((emailSent / totalSemrush) * 100).toFixed(1) : '0'}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${totalSemrush > 0 ? (emailSent / totalSemrush) * 100 : 0}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Emails sent vs total websites</p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Contact Rate</span>
                  <span className="text-sm text-gray-500">
                    {totalSemrush > 0 ? ((withEmail / totalSemrush) * 100).toFixed(1) : '0'}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${totalSemrush > 0 ? (withEmail / totalSemrush) * 100 : 0}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Websites with contact info</p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Overall Open Rate</span>
                  <span className="text-sm text-gray-500">{openRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${openRate}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Campaign email open rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

