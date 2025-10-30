import { NextResponse } from 'next/server';
import { getEmailsData } from '@/lib/googleSheets';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const emails = await getEmailsData();
    return NextResponse.json({ success: true, data: emails });
  } catch (error) {
    console.error('API Error fetching emails:', error);
    
    // Return fallback data if Google Sheets fails
    const fallbackData = [
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

