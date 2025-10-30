'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  BarChart3, 
  TrendingUp, 
  Globe,
  Mail,
  Clock,
  CheckCircle,
  Send,
  RefreshCw,
  AlertCircle,
  Activity
} from 'lucide-react'
import { useData } from '@/contexts/DataContext'

export default function DashboardPage() {
  // Use global data context instead of local state
  const { websites, keywords, campaigns, loading, error, refreshData } = useData()

  // Calculate ALL metrics from Websites, Keywords, and Campaigns sheets ONLY
  const totalWebsites = websites.length
  const websitesWithContacts = websites.filter(w => w.contactEmail && w.contactEmail.trim() !== '').length
  
  // Calculate from Campaigns sheet
  const totalEmailsSent = campaigns.reduce((sum, c) => sum + c.emailsSent, 0)
  const totalOpened = campaigns.reduce((sum, c) => sum + c.opened, 0)
  const totalClicked = campaigns.reduce((sum, c) => sum + c.clicked, 0)
  
  // Calculate email stats from Websites sheet
  const emailSentWebsites = websites.filter(w => w.contactStatus && w.contactStatus.toLowerCase() === 'email_sent').length
  
  // Calculate rates
  const openRate = totalEmailsSent > 0 ? ((totalOpened / totalEmailsSent) * 100).toFixed(1) : '0.0'
  const clickRate = totalEmailsSent > 0 ? ((totalClicked / totalEmailsSent) * 100).toFixed(1) : '0.0'

  // Dashboard metric cards - ONLY using data from Websites, Keywords, Campaigns
  const dashboardMetrics = [
    {
      title: 'Total Websites',
      value: loading ? '...' : totalWebsites.toString(),
      icon: Globe,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Discovered websites'
    },
    {
      title: 'With Contacts',
      value: loading ? '...' : websitesWithContacts.toString(),
      icon: Mail,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Contact info extracted'
    },
    {
      title: 'Emails Sent',
      value: loading ? '...' : emailSentWebsites.toString(),
      icon: Send,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'Total emails sent'
    },
    {
      title: 'Delivered',
      value: loading ? '...' : totalEmailsSent.toString(),
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      description: 'Successfully delivered'
    },
    {
      title: 'Open Rate',
      value: loading ? '...' : `${openRate}%`,
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      description: 'Email open percentage'
    },
    {
      title: 'Click Rate',
      value: loading ? '...' : `${clickRate}%`,
      icon: TrendingUp,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      description: 'Email click percentage'
    }
  ]

  // Get recent websites (last 5)
  const recentWebsites = websites
    .sort((a, b) => new Date(b.dateFound).getTime() - new Date(a.dateFound).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Gaming Websites Dashboard</h1>
          <p className="text-sm md:text-base text-gray-600 mt-2">
            Track website discovery and outreach campaign performance
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

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {dashboardMetrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {metric.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <Icon className={`h-4 w-4 ${metric.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {metric.value}
                </div>
                <p className="text-xs text-gray-500">{metric.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Keywords Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Keywords Tracking
          </CardTitle>
          <CardDescription>
            Keywords being tracked for website discovery
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 text-gray-400 mx-auto mb-3 animate-spin" />
              <p className="text-sm text-gray-500">Loading keywords...</p>
            </div>
          ) : keywords.length > 0 ? (
            <div className="space-y-4">
              {keywords.slice(0, 10).map((keyword) => (
                <div key={keyword.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-gray-700">{keyword.date}</span>
                    <Badge variant="outline" className="text-xs">
                      {keyword.keywordsList?.length || 0} keywords
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {keyword.keywordsList && keyword.keywordsList.length > 0 ? (
                      keyword.keywordsList.map((kw, idx) => (
                        <Badge key={idx} className="bg-blue-100 text-blue-800 hover:bg-blue-200 text-xs">
                          {kw}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500">{keyword.keywords}</span>
                    )}
                  </div>
                </div>
              ))}
              {keywords.length > 10 && (
                <p className="text-xs text-center text-gray-500 pt-2">
                  Showing 10 of {keywords.length} keyword entries
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No keywords data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Discoveries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Website Discoveries</CardTitle>
          <CardDescription>
            Latest gaming websites found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 text-gray-400 mx-auto mb-3 animate-spin" />
              <p className="text-sm text-gray-500">Loading recent discoveries...</p>
            </div>
          ) : recentWebsites.length > 0 ? (
            <div className="space-y-4">
              {recentWebsites.map((website) => (
                <div key={website.id} className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-b-0">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    website.contactStatus?.toLowerCase() === 'email_sent' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{website.title || website.url}</p>
                    <p className="text-xs text-gray-500 truncate">{website.url}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{website.keywordsUsed || 'No keywords'}</Badge>
                      <span className="text-xs text-gray-400">{website.dateFound}</span>
                    </div>
                  </div>
                  <Badge className={website.contactStatus?.toLowerCase() === 'email_sent' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {website.contactStatus || 'Pending'}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Globe className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No recent discoveries</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Campaign Summary */}
      {campaigns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Campaign Analytics
            </CardTitle>
            <CardDescription>
              Performance metrics from Campaigns sheet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Open Rate</span>
                  <span className="text-sm text-gray-500">
                    {openRate}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${openRate}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Open Rate</span>
                  <span className="text-sm text-gray-500">{openRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${openRate}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Click Rate</span>
                  <span className="text-sm text-gray-500">{clickRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${clickRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
