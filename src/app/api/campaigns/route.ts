import { NextResponse } from 'next/server';
import { getCampaignsData } from '@/lib/googleSheets';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const campaigns = await getCampaignsData();
    return NextResponse.json({ success: true, data: campaigns });
  } catch (error) {
    console.error('API Error fetching campaigns:', error);
    
    // Return fallback data if Google Sheets fails
    const fallbackData = [
      {
        id: 1,
        name: 'Tech Outreach Q1',
        status: 'active',
        emailsSent: 250,
        opened: 85,
        clicked: 42,
        responded: 18,
        dateCreated: '2024-01-01'
      },
      {
        id: 2,
        name: 'Gaming Industry Campaign',
        status: 'active',
        emailsSent: 180,
        opened: 62,
        clicked: 28,
        responded: 12,
        dateCreated: '2024-01-10'
      }
    ];
    
    return NextResponse.json({ 
      success: false, 
      data: fallbackData,
      error: 'Failed to fetch from Google Sheets. Using fallback data.',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

