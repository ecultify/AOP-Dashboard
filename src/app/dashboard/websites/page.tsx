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
  Download
} from 'lucide-react'
import { useState } from 'react'

const websiteData = [
  {
    id: 1,
    url: 'techstartup1.com',
    title: 'Tech Startup 1',
    category: 'Technology',
    dateFound: '2024-01-15',
    emailsExtracted: 3,
    status: 'processed'
  },
  {
    id: 2,
    url: 'businesscorp.com',
    title: 'Business Corp',
    category: 'Business Services',
    dateFound: '2024-01-15',
    emailsExtracted: 2,
    status: 'processed'
  },
  {
    id: 3,
    url: 'innovativeagency.co',
    title: 'Innovative Agency',
    category: 'Marketing',
    dateFound: '2024-01-14',
    emailsExtracted: 1,
    status: 'processing'
  },
  {
    id: 4,
    url: 'designstudio.net',
    title: 'Design Studio',
    category: 'Design',
    dateFound: '2024-01-14',
    emailsExtracted: 0,
    status: 'pending'
  },
  {
    id: 5,
    url: 'consultingfirm.org',
    title: 'Consulting Firm',
    category: 'Consulting',
    dateFound: '2024-01-13',
    emailsExtracted: 4,
    status: 'processed'
  },
  {
    id: 6,
    url: 'digitalmarketingpro.io',
    title: 'Digital Marketing Pro',
    category: 'Marketing',
    dateFound: '2024-01-13',
    emailsExtracted: 2,
    status: 'processed'
  }
]

export default function WebsitesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed':
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
    const matchesSearch = website.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         website.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || website.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(websiteData.map(w => w.category)))

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Website Discovery</h1>
        <p className="text-gray-600 mt-2">
          Track discovered websites and email extraction progress
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Websites
            </CardTitle>
            <Globe className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">1,247</div>
            <p className="text-xs text-gray-500 mt-1">+23.4% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Processed
            </CardTitle>
            <Globe className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">1,036</div>
            <p className="text-xs text-gray-500 mt-1">83.1% of total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Processing
            </CardTitle>
            <Globe className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">164</div>
            <p className="text-xs text-gray-500 mt-1">13.1% of total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending
            </CardTitle>
            <Globe className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">47</div>
            <p className="text-xs text-gray-500 mt-1">3.8% of total</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Website Directory</CardTitle>
              <CardDescription>
                Browse and manage discovered websites
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
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search websites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-md text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Website Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Website</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Date Found</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Emails</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWebsites.map((website) => (
                  <tr key={website.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{website.title}</div>
                        <div className="text-sm text-gray-500">{website.url}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{website.category}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{website.dateFound}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium text-gray-900">
                        {website.emailsExtracted}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(website.status)}>
                        {website.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredWebsites.length === 0 && (
            <div className="text-center py-8">
              <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No websites found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
