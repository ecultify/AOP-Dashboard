import { NextResponse } from 'next/server';
import { analyzeSpreadsheet, generateMarkdownReport } from '@/lib/analyzeSheet';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const analysis = await analyzeSpreadsheet();
    const markdown = generateMarkdownReport(analysis);
    
    return NextResponse.json({ 
      success: true, 
      analysis,
      markdown 
    });
  } catch (error) {
    console.error('Error analyzing spreadsheet:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

