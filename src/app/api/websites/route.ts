import { NextResponse } from 'next/server';
import { getWebsitesData } from '@/lib/googleSheets';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const websites = await getWebsitesData();
    return NextResponse.json(
      { success: true, data: websites },
      { 
        headers: { 
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        } 
      }
    );
  } catch (error) {
    console.error('API Error fetching websites:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        data: [],
        error: 'Failed to fetch from Google Sheets.',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { 
        headers: { 
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        } 
      }
    );
  }
}

