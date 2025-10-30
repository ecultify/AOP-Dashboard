import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;
const GOOGLE_SHEETS_API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;

// Support both API Key and Service Account authentication
const useServiceAccount = GOOGLE_CLIENT_EMAIL && GOOGLE_PRIVATE_KEY;

if (!GOOGLE_SHEETS_API_KEY && !useServiceAccount) {
  console.warn('Google Sheets credentials not configured. Using fallback data.');
}

// Create auth client for service account
function getAuthClient() {
  if (useServiceAccount && GOOGLE_CLIENT_EMAIL && GOOGLE_PRIVATE_KEY) {
    return new JWT({
      email: GOOGLE_CLIENT_EMAIL,
      key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
  }
  return null;
}

export interface WebsiteData {
  id: number;
  url: string;
  title: string;
  category: string;
  dateFound: string;
  emailsExtracted: number;
  status: string;
}

export interface CampaignData {
  id: number;
  name: string;
  status: string;
  emailsSent: number;
  opened: number;
  clicked: number;
  responded: number;
  dateCreated: string;
}

export interface EmailData {
  id: number;
  email: string;
  website: string;
  status: string;
  dateSent: string | null;
  response: string;
  subject: string;
}

export interface KeywordData {
  id: number;
  date: string;
  keywords: string;
  keywordsList?: string[];
}

export interface DashboardMetric {
  metric: string;
  value: string;
  lastUpdated: string;
}

export interface AnalyticsData {
  id: number;
  date: string;
  requests: number;
  delivered: number;
  bounces: number;
  opens: number;
  uniqueOpens: number;
  clicks: number;
  uniqueClicks: number;
  spamReports: number;
  unsubscribes: number;
  blocks: number;
}

export async function getGoogleSheetsData(sheetName: string): Promise<Record<string, string | number>[]> {
  try {
    if (!GOOGLE_SHEET_ID) {
      throw new Error('Google Sheet ID not configured');
    }

    // Use service account auth if available, otherwise use API key
    const authClient = getAuthClient();
    const auth = authClient || GOOGLE_SHEETS_API_KEY;
    
    if (!auth) {
      throw new Error('No authentication method configured');
    }

    const sheets = google.sheets({ version: 'v4', auth });
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEET_ID,
      range: `${sheetName}!A1:Z1000`, // Fetch columns A to Z, rows 1 to 1000
    });

    const rows = response.data.values;
    
    if (!rows || rows.length === 0) {
      console.log(`No data found in sheet: ${sheetName}`);
      return [];
    }

    // First row is headers
    const headers = rows[0];
    const data = rows.slice(1);

    // Convert rows to objects
    const result = data.map((row, index) => {
      const obj: Record<string, string | number> = { id: index + 1 };
      headers.forEach((header, i) => {
        obj[header.toLowerCase().replace(/\s+/g, '_')] = row[i] || '';
      });
      return obj;
    });

    return result;
  } catch (error) {
    console.error(`Error fetching data from sheet ${sheetName}:`, error);
    throw error;
  }
}

export interface WebsiteDetailData {
  id: number;
  url: string;
  title: string;
  description: string;
  category: string;
  dateFound: string;
  contactStatus: string;
  contactEmail: string;
  contactName: string;
  socialLinks: string;
  keywordsUsed: string;
  platform: string;
}

export async function getWebsitesData(): Promise<WebsiteData[]> {
  try {
    const sheetName = process.env.WEBSITES_SHEET_NAME || 'Websites';
    const rawData = await getGoogleSheetsData(sheetName);
    
    return rawData.map((row, index) => ({
      id: index + 1,
      url: String(row.website_url || row.url || row.website || ''),
      title: String(row.title || row.name || ''),
      category: String(row.keywords_used || row.category || 'Uncategorized'),
      dateFound: String(row.discovery_date || row.date_found || row.date || new Date().toISOString().split('T')[0]),
      emailsExtracted: row.contact_email ? 1 : 0,
      status: String(row.contact_status || '').toLowerCase() === 'email_sent' ? 'processed' : 
              String(row.contact_status || '').toLowerCase() === 'pending' ? 'pending' : 'pending',
    }));
  } catch (error) {
    console.error('Error fetching websites data:', error);
    return [];
  }
}

export async function getWebsitesDetailData(): Promise<WebsiteDetailData[]> {
  try {
    const sheetName = process.env.WEBSITES_SHEET_NAME || 'Websites';
    const rawData = await getGoogleSheetsData(sheetName);
    
    return rawData.map((row, index) => ({
      id: index + 1,
      url: String(row.website_url || ''),
      title: String(row.title || ''),
      description: String(row.description || '').substring(0, 100) + '...',
      category: String(row.keywords_used || 'Uncategorized'),
      dateFound: String(row.discovery_date || ''),
      contactStatus: String(row.contact_status || 'Pending'),
      contactEmail: String(row.contact_email || ''),
      contactName: String(row.contact_name || ''),
      socialLinks: String(row.social_links || ''),
      keywordsUsed: String(row.keywords_used || ''),
      platform: String(row.platform || ''),
    }));
  } catch (error) {
    console.error('Error fetching websites detail data:', error);
    return [];
  }
}

export async function getCampaignsData(): Promise<CampaignData[]> {
  try {
    const sheetName = process.env.CAMPAIGNS_SHEET_NAME || 'Campaigns';
    const rawData = await getGoogleSheetsData(sheetName);
    
    return rawData.map((row, index) => ({
      id: index + 1,
      name: String(row.name || row.campaign_name || ''),
      status: String(row.status || 'active'),
      emailsSent: parseInt(String(row.emails_sent || row.sent || '0')),
      opened: parseInt(String(row.opened || row.opens || '0')),
      clicked: parseInt(String(row.clicked || row.clicks || '0')),
      responded: parseInt(String(row.responded || row.responses || '0')),
      dateCreated: String(row.date_created || row.date || new Date().toISOString().split('T')[0]),
    }));
  } catch (error) {
    console.error('Error fetching campaigns data:', error);
    return [];
  }
}

export async function getEmailsData(): Promise<EmailData[]> {
  try {
    const sheetName = 'Emails'; // You can add this to env if needed
    const rawData = await getGoogleSheetsData(sheetName);
    
    return rawData.map((row, index) => ({
      id: index + 1,
      email: String(row.email || ''),
      website: String(row.website || ''),
      status: String(row.status || 'pending'),
      dateSent: row.date_sent ? String(row.date_sent) : null,
      response: String(row.response || 'none'),
      subject: String(row.subject || ''),
    }));
  } catch (error) {
    console.error('Error fetching emails data:', error);
    return [];
  }
}

export async function getKeywordsData(): Promise<KeywordData[]> {
  try {
    const sheetName = process.env.KEYWORDS_SHEET_NAME || 'Keywords';
    const rawData = await getGoogleSheetsData(sheetName);
    
    return rawData
      .filter((row) => row.date && row.keywords) // Only include rows with both date and keywords
      .map((row, index) => {
        const keywordsString = String(row.keywords || '');
        // Split keywords by comma and trim whitespace
        const keywordsList = keywordsString ? keywordsString.split(',').map((k: string) => k.trim()).filter((k: string) => k) : [];
        
        return {
          id: index + 1,
          date: String(row.date || new Date().toISOString().split('T')[0]),
          keywords: keywordsString,
          keywordsList: keywordsList,
        };
      });
  } catch (error) {
    console.error('Error fetching keywords data:', error);
    return [];
  }
}

export async function getDashboardMetrics(): Promise<DashboardMetric[]> {
  try {
    const sheetName = 'Dashboard';
    const rawData = await getGoogleSheetsData(sheetName);
    
    return rawData
      .filter((row) => row.metric && row.value) // Only include rows with metric and value
      .map((row) => ({
        metric: String(row.metric || ''),
        value: String(row.value || '0'),
        lastUpdated: String(row.last_updated || ''),
      }));
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    return [];
  }
}

export async function getAnalyticsData(): Promise<AnalyticsData[]> {
  try {
    const sheetName = 'Analytics';
    const rawData = await getGoogleSheetsData(sheetName);
    
    return rawData
      .filter((row) => row.date) // Only include rows with dates
      .map((row, index) => ({
        id: index + 1,
        date: String(row.date || ''),
        requests: parseInt(String(row.requests || '0')),
        delivered: parseInt(String(row.delivered || '0')),
        bounces: parseInt(String(row.bounces || '0')),
        opens: parseInt(String(row.opens || '0')),
        uniqueOpens: parseInt(String(row.unique_opens || '0')),
        clicks: parseInt(String(row.clicks || '0')),
        uniqueClicks: parseInt(String(row.unique_clicks || '0')),
        spamReports: parseInt(String(row.spam_reports || '0')),
        unsubscribes: parseInt(String(row.unsubscribes || '0')),
        blocks: parseInt(String(row.blocks || '0')),
      }));
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return [];
  }
}

