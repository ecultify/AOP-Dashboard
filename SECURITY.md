# Security Notice

## Protected Files

The following files contain sensitive credentials and are excluded from version control:

### 1. Google Cloud Service Account Key
- **File**: `data-hangout-476613-t5-6e9b3be04c1b.json` (or any `*.json` file)
- **Purpose**: Authenticates with Google Sheets API
- **Storage**: Keep this file locally in your project root
- **Never commit this file to Git**

### 2. Mailgun Test Script
- **File**: `test-email.js`
- **Purpose**: Testing email functionality
- **Template**: Use `test-email.example.js` as a template
- **Never commit this file to Git**

## Setup Instructions

1. **Google Sheets Credentials**:
   - Download your service account key from Google Cloud Console
   - Save it as `data-hangout-476613-t5-6e9b3be04c1b.json` in the project root
   - The file will be automatically ignored by git

2. **Mailgun Configuration** (if needed):
   - Copy `test-email.example.js` to `test-email.js`
   - Add your Mailgun API key and domain
   - The file will be automatically ignored by git

## Important Security Notes

⚠️ **NEVER** commit files containing:
- API keys
- Private keys
- Service account credentials
- Passwords
- Access tokens

✅ The `.gitignore` file has been configured to prevent accidental commits of sensitive files.

## What Was Fixed

GitHub's push protection detected sensitive credentials in your previous commit:
1. Google Cloud Service Account Credentials
2. Mailgun API Key

These have been removed from the repository and added to `.gitignore` to prevent future accidental commits.

## If Credentials Were Exposed

If your credentials were already pushed to GitHub:
1. **Rotate all exposed credentials immediately**:
   - Generate a new Google Cloud service account key
   - Generate a new Mailgun API key
2. Delete the old credentials from Google Cloud Console / Mailgun
3. Update your local files with the new credentials

