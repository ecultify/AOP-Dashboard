'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'

// Interfaces
export interface Website {
  id: number
  url: string
  title: string
  description?: string
  category?: string
  dateFound: string
  contactStatus: string
  contactEmail: string
  contactName?: string
  keywordsUsed: string
  platform?: string
  socialLinks?: string
}

export interface Keyword {
  id: number
  date: string
  keywords: string
  keywordsList?: string[]
}

export interface Campaign {
  id: number
  name: string
  status: string
  emailsSent: number
  opened: number
  clicked: number
  responded: number
  dateCreated: string
}

export interface Email {
  id: number
  email: string
  website: string
  status: string
  dateSent: string | null
  response: string
  subject: string
}

// Context State
interface DataContextState {
  websites: Website[]
  keywords: Keyword[]
  campaigns: Campaign[]
  emails: Email[]
  loading: boolean
  error: string | null
  lastFetchTime: Date | null
  
  // Actions
  fetchAllData: () => Promise<void>
  refreshData: () => Promise<void>
}

const DataContext = createContext<DataContextState | undefined>(undefined)

// Provider Component
export function DataProvider({ children }: { children: ReactNode }) {
  const [websites, setWebsites] = useState<Website[]>([])
  const [keywords, setKeywords] = useState<Keyword[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [emails, setEmails] = useState<Email[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null)

  const fetchAllData = useCallback(async () => {
    // Skip if data was fetched less than 5 seconds ago (prevent rapid refetching)
    if (lastFetchTime && Date.now() - lastFetchTime.getTime() < 5000) {
      console.log('⚡ Using cached data (fetched < 5s ago)')
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      console.log('🔄 Fetching fresh data from Google Sheets...')
      
      // Fetch all data in parallel
      const [websitesRes, keywordsRes, campaignsRes, emailsRes] = await Promise.all([
        fetch('/api/websites-detail', { 
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        }),
        fetch('/api/keywords', { 
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        }),
        fetch('/api/campaigns', { 
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        }),
        fetch('/api/emails', { 
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        })
      ])
      
      const [websitesData, keywordsData, campaignsData, emailsData] = await Promise.all([
        websitesRes.json(),
        keywordsRes.json(),
        campaignsRes.json(),
        emailsRes.json()
      ])
      
      // Update state with fetched data
      setWebsites(websitesData.success ? websitesData.data : [])
      setKeywords(keywordsData.success ? keywordsData.data : [])
      setCampaigns(campaignsData.success ? campaignsData.data : [])
      setEmails(emailsData.success ? emailsData.data : [])
      
      setLastFetchTime(new Date())
      console.log('✅ Data fetched successfully!')
      
      // Set error only if ALL requests failed
      if (!websitesData.success && !keywordsData.success && !campaignsData.success && !emailsData.success) {
        setError('Failed to fetch data from Google Sheets')
      }
    } catch (err) {
      console.error('❌ Error fetching data:', err)
      setError('Failed to connect to API')
    } finally {
      setLoading(false)
    }
  }, [lastFetchTime])

  const refreshData = useCallback(async () => {
    setLastFetchTime(null) // Clear cache timestamp to force refresh
    await fetchAllData()
  }, [fetchAllData])

  const value: DataContextState = {
    websites,
    keywords,
    campaigns,
    emails,
    loading,
    error,
    lastFetchTime,
    fetchAllData,
    refreshData
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

// Custom Hook
export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}


