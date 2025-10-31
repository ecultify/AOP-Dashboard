# Semrush Websites Tracking Feature

## Overview
A dedicated dashboard page for tracking websites discovered via Semrush and monitoring their email outreach status.

## What Was Added

### 1. New Dashboard Page: `/dashboard/semrush`
- **Location**: `src/app/dashboard/semrush/page.tsx`
- **Purpose**: Track and manage Semrush-discovered websites separately from Google-discovered sites

### 2. Features

#### Summary Statistics
- **Total Semrush Sites**: Count of all websites discovered via Semrush
- **With Email Contacts**: Number of sites with extracted contact information
- **Emails Sent**: Number of sites that have been contacted
- **Pending Outreach**: Number of sites awaiting contact

#### Website Directory Table
- Comprehensive list of all Semrush websites
- Real-time status tracking (Email Sent, Pending, Failed)
- Contact information display (name, email)
- Keywords and discovery date tracking
- Search and filter functionality
- Responsive design (desktop table, mobile cards)

#### Performance Metrics
- **Completion Rate**: Percentage of sites contacted
- **Contact Rate**: Percentage of sites with email information
- **Overall Open Rate**: Email campaign performance

### 3. Navigation
Added "Semrush Sites" to the main navigation sidebar with BarChart3 icon

### 4. Data Source

The page filters websites based on the `platform` column in the Google Sheet:
- **Platform = "Semrush"**: Websites discovered via Semrush
- **Platform = "Google"**: Websites discovered via Google Search (shown on main Websites page)

## How It Works

### Data Flow
1. Google Sheet's "Websites" sheet contains a `platform` column
2. Automation populates this column with either "Google" or "Semrush"
3. The Semrush page filters `websites` data where `platform === "semrush"`
4. Displays filtered results with email outreach status

### Status Tracking
The page tracks three main statuses:
- **email_sent**: Outreach completed
- **pending**: Awaiting contact
- **failed**: Contact attempt failed

### Search & Filter
Users can:
- Search by website URL, title, contact name, or email
- Filter by status (All, Email Sent, Pending, Failed)
- View detailed information for each website

## Technical Details

### Components Used
- Card components for statistics and layout
- Badge components for status indicators
- Input components for search
- Responsive table/card layout
- Lucide icons for visual elements

### Data Structure
```typescript
interface SemrushWebsite {
  id: number
  url: string
  title: string
  contactEmail: string
  contactName: string
  contactStatus: 'email_sent' | 'pending' | 'failed'
  dateFound: string
  keywordsUsed: string
  description: string
  socialLinks: string
}
```

### Performance
- Real-time data refresh capability
- Cached data (5-second cache to prevent rapid refetching)
- Optimized filtering with useMemo hooks
- Mobile-responsive design

## Benefits for Client

1. **Separate Tracking**: Semrush websites are tracked independently
2. **Clear Status Visibility**: Easy to see which Semrush sites have been contacted
3. **Performance Metrics**: Understand outreach effectiveness for Semrush leads
4. **Efficient Workflow**: Search and filter to quickly find specific sites
5. **Export Ready**: Export functionality for reporting (button in place)

## Future Enhancements

Potential additions:
- Bulk email sending to pending Semrush sites
- CSV export functionality
- Individual website detail pages
- Integration with email service provider
- Performance comparison (Semrush vs Google sources)
- Custom notes/tags for each website

## Deployment

✅ Pushed to GitHub: Commit `9149925`
✅ Vercel will auto-deploy the changes
✅ Available at: `your-domain.com/dashboard/semrush`

