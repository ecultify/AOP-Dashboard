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
  Eye
} from 'lucide-react'
import { useState } from 'react'

const emailData = [
  {
    id: 1,
    email: 'tech@company1.com',
    website: 'company1.com',
    status: 'sent',
    dateSent: '2024-01-15',
    response: 'pending',
    subject: 'Partnership Opportunity'
  },
  {
    id: 2,
    email: 'info@startup2.com',
    website: 'startup2.com',
    status: 'pending',
    dateSent: null,
    response: 'none',
    subject: 'Collaboration Proposal'
  },
  {
    id: 3,
    email: 'hello@business3.com',
    website: 'business3.com',
    status: 'found',
    dateSent: null,
    response: 'none',
    subject: 'Business Development'
  },
  {
    id: 4,
    email: 'contact@firm4.com',
    website: 'firm4.com',
    status: 'failed',
    dateSent: '2024-01-14',
    response: 'none',
    subject: 'Strategic Partnership'
  },
  {
    id: 5,
    email: 'support@agency5.com',
    website: 'agency5.com',
    status: 'sent',
    dateSent: '2024-01-14',
    response: 'positive',
    subject: 'Marketing Collaboration'
  },
  {
    id: 6,
    email: 'team@consultancy6.org',
    website: 'consultancy6.org',
    status: 'sent',
    dateSent: '2024-01-13',
    response: 'negative',
    subject: 'Service Partnership'
  }
]

export default function EmailsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800'
      case 'found':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'found':
        return <Eye className="h-4 w-4 text-blue-600" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Mail className="h-4 w-4 text-gray-600" />
    }
  }

  const getResponseColor = (response: string) => {
    switch (response) {
      case 'positive':
        return 'bg-green-100 text-green-800'
      case 'negative':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredEmails = emailData.filter(email => {
    const matchesSearch = email.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.website.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || email.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const statuses = Array.from(new Set(emailData.map(e => e.status)))

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Email Outreach</h1>
        <p className="text-gray-600 mt-2">
          Manage email contacts and track outreach campaign performance
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Emails
            </CardTitle>
            <Mail className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">892</div>
            <p className="text-xs text-gray-500 mt-1">+18.7% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Emails Sent
            </CardTitle>
            <Send className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">634</div>
            <p className="text-xs text-gray-500 mt-1">71.1% of total</p>
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
            <div className="text-2xl font-bold text-gray-900">211</div>
            <p className="text-xs text-gray-500 mt-1">23.7% of total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Failed
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">47</div>
            <p className="text-xs text-gray-500 mt-1">5.3% of total</p>
          </CardContent>
        </Card>
      </div>

      {/* Email Campaign Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Response Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-2">12.8%</div>
            <p className="text-sm text-gray-500">81 responses from 634 sent emails</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '12.8%' }}></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Delivery Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-2">92.6%</div>
            <p className="text-sm text-gray-500">587 delivered from 634 sent</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92.6%' }}></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Open Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 mb-2">34.2%</div>
            <p className="text-sm text-gray-500">201 opens from 587 delivered</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '34.2%' }}></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email Management */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Email Contacts</CardTitle>
              <CardDescription>
                Manage your outreach email list and campaign status
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm">
                <Send className="h-4 w-4 mr-2" />
                Send Campaign
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search emails or websites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-md text-sm"
            >
              <option value="all">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Email Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Contact</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Website</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Subject</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Response</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Date Sent</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmails.map((email) => (
                  <tr key={email.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(email.status)}
                        <span className="font-medium text-gray-900">{email.email}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600">{email.website}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-900">{email.subject}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(email.status)}>
                        {email.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getResponseColor(email.response)}>
                        {email.response}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {email.dateSent ? (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{email.dateSent}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Send className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredEmails.length === 0 && (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No emails found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
