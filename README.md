# GLP-1 360™️ Risk Score Test

A complete React application for the GLP-1 360™️ Risk Score Test that collects user answers, calculates scores, determines categories, and submits results to Google Sheets.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory and add your Google Apps Script URL:

```bash
cp .env.example .env
```

Then edit `.env` and replace the placeholder:

```
REACT_APP_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

**Important:** Never commit your `.env` file to version control. It's already included in `.gitignore`.

### 3. Google Apps Script Setup

Create a new Google Apps Script with the following code:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // If first row is empty, add headers
    if (sheet.getLastRow() === 0) {
      const headers = Object.keys(data);
      sheet.appendRow(headers);
    }
    
    // Add data row
    const values = Object.values(data);
    sheet.appendRow(values);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

Deploy as Web App:
- Click "Deploy" > "New deployment"
- Select type: "Web app"
- Execute as: "Me"
- Who has access: "Anyone"
- Copy the Web App URL and paste it in ContactForm.jsx

### 4. Run the Application

```bash
npm start
```

The app will open at http://localhost:3000

## File Structure

```
├── App.jsx                 # Main app component
├── GlpTestPage.jsx        # Question form page
├── ResultPage.jsx         # Results display page
├── ContactForm.jsx        # Contact form for submission
├── questionsConfig.js     # Questions configuration
├── scoring.js             # Scoring logic
├── index.js               # React entry point
├── index.html             # HTML template
├── package.json           # Dependencies
└── README.md              # This file
```

## Features

- ✅ 100% frontend implementation
- ✅ One question at a time with progress tracking
- ✅ Dynamic question rendering from config
- ✅ Single and multi-select question support
- ✅ Exact scoring as documented
- ✅ Category determination (BASE/TRANSFORM/EXIT)
- ✅ Beautiful, modern UI with animations
- ✅ Personalized action plan recommendations
- ✅ Contact info collected as final question
- ✅ Auto-submit to Google Sheets
- ✅ Responsive design for all devices
- ✅ Clean, modular code structure

## Scoring Categories

- **0-15**: GLP-1 360: BASE™️ (Starting/low-risk phase)
- **16-30**: GLP-1 360: TRANSFORM™️ (Muscle-loss/plateau correction)
- **31+**: GLP-1 360: EXIT™️ (Tapering/rebound prevention)

## Data Submitted to Google Sheets

- timestamp
- name
- phone
- All question answers (q1-q11)
- totalScore
- baseCategory
- finalCategory
- triggeredFlags
