import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;
const GOOGLE_SHEETS_API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;

interface SheetInfo {
  name: string;
  rowCount: number;
  columnCount: number;
  headers: string[];
  sampleData: any[];
  dataTypes: { [key: string]: string };
}

interface SpreadsheetAnalysis {
  spreadsheetId: string;
  title: string;
  sheets: SheetInfo[];
  totalSheets: number;
}

function getAuthClient() {
  if (GOOGLE_CLIENT_EMAIL && GOOGLE_PRIVATE_KEY) {
    return new JWT({
      email: GOOGLE_CLIENT_EMAIL,
      key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
  }
  return null;
}

function detectDataType(value: any): string {
  if (!value || value === '') return 'empty';
  if (!isNaN(Number(value))) return 'number';
  if (value.match(/^\d{4}-\d{2}-\d{2}$/)) return 'date';
  if (value.match(/^\d{2}\/\d{2}\/\d{4}$/)) return 'date';
  if (value.includes('@')) return 'email';
  if (value.match(/^https?:\/\//)) return 'url';
  if (value.includes(',')) return 'comma-separated';
  return 'text';
}

export async function analyzeSpreadsheet(): Promise<SpreadsheetAnalysis> {
  try {
    if (!GOOGLE_SHEET_ID) {
      throw new Error('Google Sheet ID not configured');
    }

    const authClient = getAuthClient();
    const auth = authClient || GOOGLE_SHEETS_API_KEY;

    if (!auth) {
      throw new Error('No authentication configured');
    }

    const sheets = google.sheets({ version: 'v4', auth });

    // Get spreadsheet metadata
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: GOOGLE_SHEET_ID,
    });

    const title = spreadsheet.data.properties?.title || 'Unknown';
    const sheetsList = spreadsheet.data.sheets || [];
    
    const analysis: SpreadsheetAnalysis = {
      spreadsheetId: GOOGLE_SHEET_ID,
      title,
      sheets: [],
      totalSheets: sheetsList.length,
    };

    // Analyze each sheet
    for (const sheet of sheetsList) {
      const sheetName = sheet.properties?.title || 'Unknown';
      const rowCount = sheet.properties?.gridProperties?.rowCount || 0;
      const columnCount = sheet.properties?.gridProperties?.columnCount || 0;

      try {
        // Get data from the sheet
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId: GOOGLE_SHEET_ID,
          range: `${sheetName}!A1:Z100`, // Get first 100 rows
        });

        const rows = response.data.values || [];
        const headers = rows.length > 0 ? rows[0] : [];
        const dataRows = rows.slice(1, 6); // Get 5 sample rows

        // Detect data types
        const dataTypes: { [key: string]: string } = {};
        headers.forEach((header, index) => {
          const columnData = dataRows
            .map(row => row[index])
            .filter(val => val && val !== '');
          
          if (columnData.length > 0) {
            const types = columnData.map(detectDataType);
            // Get most common type
            const typeCount: { [key: string]: number } = {};
            types.forEach(type => {
              typeCount[type] = (typeCount[type] || 0) + 1;
            });
            const mostCommon = Object.entries(typeCount).sort((a, b) => b[1] - a[1])[0];
            dataTypes[header] = mostCommon ? mostCommon[0] : 'text';
          } else {
            dataTypes[header] = 'empty';
          }
        });

        analysis.sheets.push({
          name: sheetName,
          rowCount,
          columnCount,
          headers,
          sampleData: dataRows,
          dataTypes,
        });
      } catch (error) {
        console.error(`Error analyzing sheet ${sheetName}:`, error);
        analysis.sheets.push({
          name: sheetName,
          rowCount,
          columnCount,
          headers: [],
          sampleData: [],
          dataTypes: {},
        });
      }
    }

    return analysis;
  } catch (error) {
    console.error('Error analyzing spreadsheet:', error);
    throw error;
  }
}

export function generateMarkdownReport(analysis: SpreadsheetAnalysis): string {
  let markdown = `# Google Spreadsheet Structure Analysis\n\n`;
  markdown += `**Spreadsheet:** ${analysis.title}\n`;
  markdown += `**Spreadsheet ID:** \`${analysis.spreadsheetId}\`\n`;
  markdown += `**Total Sheets:** ${analysis.totalSheets}\n`;
  markdown += `**Analysis Date:** ${new Date().toISOString().split('T')[0]}\n\n`;
  markdown += `---\n\n`;

  analysis.sheets.forEach((sheet, index) => {
    markdown += `## ${index + 1}. Sheet: "${sheet.name}"\n\n`;
    markdown += `**Dimensions:** ${sheet.rowCount} rows × ${sheet.columnCount} columns\n\n`;

    if (sheet.headers.length > 0) {
      markdown += `### Column Structure\n\n`;
      markdown += `| Column | Header | Data Type | Sample Values |\n`;
      markdown += `|--------|--------|-----------|---------------|\n`;

      sheet.headers.forEach((header, colIndex) => {
        const dataType = sheet.dataTypes[header] || 'unknown';
        const samples = sheet.sampleData
          .map(row => row[colIndex])
          .filter(val => val && val !== '')
          .slice(0, 2)
          .join(', ');
        
        markdown += `| ${String.fromCharCode(65 + colIndex)} | ${header} | ${dataType} | ${samples || 'N/A'} |\n`;
      });

      markdown += `\n### Sample Data (First 5 Rows)\n\n`;
      markdown += `| ${sheet.headers.join(' | ')} |\n`;
      markdown += `|${sheet.headers.map(() => '---').join('|')}|\n`;

      sheet.sampleData.slice(0, 5).forEach(row => {
        const paddedRow = [...row];
        while (paddedRow.length < sheet.headers.length) {
          paddedRow.push('');
        }
        markdown += `| ${paddedRow.map(cell => cell || '').join(' | ')} |\n`;
      });

      markdown += `\n`;
    } else {
      markdown += `*No data found in this sheet*\n\n`;
    }

    markdown += `---\n\n`;
  });

  markdown += `## Summary\n\n`;
  markdown += `This spreadsheet contains ${analysis.totalSheets} sheet(s):\n\n`;
  analysis.sheets.forEach(sheet => {
    markdown += `- **${sheet.name}**: ${sheet.headers.length} columns, ${sheet.rowCount} rows\n`;
  });

  return markdown;
}

