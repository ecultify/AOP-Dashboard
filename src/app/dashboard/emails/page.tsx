'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Mail, 
  Search, 
  Calendar,
  Send,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  RefreshCw,
  AlertCircle,
  Activity
} from 'lucide-react'
import { useState, useMemo } from 'react'
import { useData } from '@/contexts/DataContext'

export default function EmailsPage() {
  // Use global data context
  const { websites, campaigns, loading, error, refreshData } = useData()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')

  // Transform websites data to email format
  const emailData = useMemo(() => {
    return websites
      .filter(w => w.contactEmail && w.contactEmail.trim() !== '') // Only show websites with email
      .map((w, index) => ({
        id: index + 1,
        email: w.contactEmail || '',
        website: w.url || '',
        status: w.contactStatus?.toLowerCase() || 'pending',
        dateSent: w.contactStatus?.toLowerCase() === 'email_sent' ? w.dateFound : null,
        contactName: w.contactName || '',
        keywordsUsed: w.keywordsUsed || ''
      }))
  }, [websites])

  // Calculate email stats from campaigns data
  const totalEmailsSent = campaigns.reduce((sum, c) => sum + c.emailsSent, 0)
  const totalOpened = campaigns.reduce((sum, c) => sum + c.opened, 0)
  const totalClicked = campaigns.reduce((sum, c) => sum + c.clicked, 0)
  
  const openRate = totalEmailsSent > 0 ? ((totalOpened / totalEmailsSent) * 100).toFixed(1) : '0.0'
  const clickRate = totalEmailsSent > 0 ? ((totalClicked / totalEmailsSent) * 100).toFixed(1) : '0.0'

  // Summary metrics
  const totalEmails = emailData.length
  const emailsSent = emailData.filter(e => e.status === 'email_sent').length
  const pending = emailData.filter(e => e.status === 'pending').length
  const failed = emailData.filter(e => e.status === 'failed').length

  // Filter emails
  const filteredEmails = emailData.filter(email => {
    const matchesSearch = email.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (email.contactName && email.contactName.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = selectedStatus === 'all' || email.status === selectedStatus
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
        return <Mail className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Email Outreach</h1>
          <p className="text-sm md:text-base text-gray-600 mt-2">
            Manage email contacts from discovered gaming websites
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
              Total Emails
            </CardTitle>
            <Mail className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {loading ? '...' : totalEmails}
            </div>
            <p className="text-xs text-gray-500 mt-1">Contact emails collected</p>
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
              {loading ? '...' : emailsSent}
            </div>
            <p className="text-xs text-gray-500 mt-1">Successfully sent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {loading ? '...' : pending}
            </div>
            <p className="text-xs text-gray-500 mt-1">Awaiting outreach</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Open Rate
            </CardTitle>
            <Eye className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {loading ? '...' : `${openRate}%`}
            </div>
            <p className="text-xs text-gray-500 mt-1">Emails opened</p>
          </CardContent>
        </Card>
      </div>

      {/* Emails Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Email Contacts</CardTitle>
              <CardDescription>
                Manage and track email outreach to gaming websites
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
                placeholder="Search emails, websites, or names..."
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
              <p className="text-sm text-gray-500">Loading emails...</p>
            </div>
          ) : filteredEmails.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-500">No email contacts found</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto -mx-6 px-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 md:px-4 font-medium text-gray-700 text-sm whitespace-nowrap">Contact</th>
                      <th className="text-left py-3 px-2 md:px-4 font-medium text-gray-700 text-sm whitespace-nowrap">Website</th>
                      <th className="text-left py-3 px-2 md:px-4 font-medium text-gray-700 text-sm whitespace-nowrap">Keywords</th>
                      <th className="text-left py-3 px-2 md:px-4 font-medium text-gray-700 text-sm whitespace-nowrap">Date</th>
                      <th className="text-left py-3 px-2 md:px-4 font-medium text-gray-700 text-sm whitespace-nowrap">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmails.map((email) => (
                      <tr key={email.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-2 md:px-4">
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{email.contactName || 'No name'}</div>
                            <div className="text-xs text-gray-500">{email.email}</div>
                          </div>
                        </td>
                        <td className="py-3 px-2 md:px-4">
                          <div className="text-sm text-gray-600 truncate max-w-xs">{email.website}</div>
                        </td>
                        <td className="py-3 px-2 md:px-4">
                          <Badge variant="outline" className="text-xs">{email.keywordsUsed || 'N/A'}</Badge>
                        </td>
                        <td className="py-3 px-2 md:px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span>{email.dateSent || 'Not sent'}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 md:px-4">
                          <Badge className={`${getStatusColor(email.status)} text-xs flex items-center gap-1 w-fit`}>
                            {getStatusIcon(email.status)}
                            {email.status.replace('_', ' ')}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile/Tablet Cards */}
              <div className="lg:hidden space-y-4">
                {filteredEmails.map((email) => (
                  <Card key={email.id} className="border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 text-sm">{email.contactName || 'No name'}</h3>
                          <p className="text-xs text-gray-500 truncate mt-1">{email.email}</p>
                        </div>
                        <Badge className={`${getStatusColor(email.status)} text-xs ml-2`}>
                          {email.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-xs">
                          <span className="text-gray-500">Website: </span>
                          <span className="text-gray-900 truncate block">{email.website}</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-gray-500">Keywords: </span>
                          <Badge variant="outline" className="text-xs">{email.keywordsUsed || 'N/A'}</Badge>
                        </div>
                        {email.dateSent && (
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <Calendar className="h-3 w-3" />
                            <span>{email.dateSent}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
