'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Activity,
  Globe,
  Mail,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Send,
  Eye
} from 'lucide-react'

const metrics = [
  {
    title: 'Websites Found',
    value: '1,247',
    change: '+23.4%',
    trend: 'up',
    icon: Globe,
    description: 'Total websites discovered'
  },
  {
    title: 'Emails Found',
    value: '892',
    change: '+18.7%',
    trend: 'up',
    icon: Mail,
    description: 'Contact emails extracted'
  },
  {
    title: 'Emails Sent',
    value: '634',
    change: '+15.2%',
    trend: 'up',
    icon: Send,
    description: 'Outreach emails delivered'
  },
  {
    title: 'Response Rate',
    value: '12.8%',
    change: '+2.1%',
    trend: 'up',
    icon: TrendingUp,
    description: 'Email response percentage'
  },
  {
    title: 'Failed Deliveries',
    value: '47',
    change: '-8.5%',
    trend: 'down',
    icon: XCircle,
    description: 'Emails that failed to send'
  },
  {
    title: 'Pending Contacts',
    value: '211',
    change: '+5.3%',
    trend: 'up',
    icon: Clock,
    description: 'Contacts awaiting outreach'
  }
]

const emailStatuses = [
  { contact: 'tech@company1.com', status: 'sent', type: 'Email Sent', timestamp: '2 hours ago' },
  { contact: 'info@startup2.com', status: 'pending', type: 'Pending', timestamp: '1 day ago' },
  { contact: 'hello@business3.com', status: 'found', type: 'Email Found', timestamp: '3 hours ago' },
  { contact: 'contact@firm4.com', status: 'failed', type: 'Delivery Failed', timestamp: '5 hours ago' },
  { contact: 'support@agency5.com', status: 'sent', type: 'Email Sent', timestamp: '1 hour ago' },
]

export default function DashboardPage() {
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
        return <AlertTriangle className="h-4 w-4 text-gray-600" />
    }
  }

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">AI Outreach Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Track website discovery, email extraction, and outreach campaign performance
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {metric.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {metric.value}
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${getTrendColor(metric.trend)}`}>
                    {metric.change}
                  </span>
                  <span className="text-sm text-gray-500">vs last month</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">{metric.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Email Status Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Status Tracking
            </CardTitle>
            <CardDescription>
              Recent email outreach activity and status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {emailStatuses.map((email, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(email.status)}
                  <div>
                    <p className="font-medium text-gray-900">{email.contact}</p>
                    <p className="text-sm text-gray-500">{email.timestamp}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(email.status)}>
                  {email.type}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Campaign Performance
            </CardTitle>
            <CardDescription>
              Outreach campaign metrics and success rates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Email Discovery Rate</span>
                  <span className="text-sm text-gray-500">71.5%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: '71.5%' }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Delivery Success Rate</span>
                  <span className="text-sm text-gray-500">92.6%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: '92.6%' }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Response Rate</span>
                  <span className="text-sm text-gray-500">12.8%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: '12.8%' }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Outreach Activity</CardTitle>
          <CardDescription>
            Latest website discoveries and email outreach events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                time: '2 minutes ago',
                event: 'Found 12 new websites in tech startup category',
                status: 'success'
              },
              {
                time: '15 minutes ago',
                event: 'Email delivery failed to contact@startup7.com',
                status: 'warning'
              },
              {
                time: '1 hour ago',
                event: 'Successfully sent outreach email to 25 contacts',
                status: 'success'
              },
              {
                time: '2 hours ago',
                event: 'Extracted 18 email addresses from new websites',
                status: 'info'
              },
              {
                time: '3 hours ago',
                event: 'Received positive response from info@techcorp.com',
                status: 'success'
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-b-0">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.status === 'success' ? 'bg-green-500' :
                  activity.status === 'warning' ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.event}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}