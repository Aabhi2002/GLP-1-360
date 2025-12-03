# Google Sheets Setup Guide - Complete End-to-End Process

## 📊 What Data Will Be Stored

Your app will send the following data to Google Sheets:

### User Information
- `timestamp` - When the test was completed
- `name` - User's full name
- `phone` - User's phone number

### Question Answers (11 questions)
- `q1` - Which GLP-1 medication
- `q2` - Duration of GLP-1 use
- `q3` - Weight changes since starting
- `q4` - Weakness, fatigue, or reduced stamina
- `q5` - Strength training frequency
- `q6` - Daily protein intake
- `q7` - Body Composition Scan Result
- `q8` - Side effects (multiple selections)
- `q9` - Appetite description
- `q10` - Medical conditions (multiple selections)
- `q11` - Immediate goal

### Results
- `totalScore` - Calculated score (0-50+)
- `baseCategory` - Initial category determination
- `finalCategory` - Final category (BASE™️, TRANSFORM™️, or EXIT™️)
- `triggeredFlags` - Any special flags (currently empty array)

---

## 🚀 Step-by-Step Setup Process

### Step 1: Create a New Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **"+ Blank"** to create a new spreadsheet
3. Name it: **"GLP-1 360 Risk Score Test Results"**
4. Keep this tab open - you'll need it later

---

### Step 2: Open Google Apps Script Editor

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. A new tab will open with the Apps Script editor
3. You'll see a default `Code.gs` file with some sample code
4. Delete all the default code

---

### Step 3: Add the Apps Script Code

Copy and paste this complete code into the Apps Script editor:

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Log the received data for debugging
    Logger.log('Received data: ' + JSON.stringify(data));
    
    // If this is the first row, add headers
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Timestamp',
        'Name',
        'Phone',
        'Q1: GLP-1 Medication',
        'Q2: Duration of Use',
        'Q3: Weight Changes',
        'Q4: Weakness/Fatigue',
        'Q5: Strength Training',
        'Q6: Protein Intake',
        'Q7: Body Composition',
        'Q8: Side Effects',
        'Q9: Appetite',
        'Q10: Medical Conditions',
        'Q11: Immediate Goal',
        'Total Score',
        'Base Category',
        'Final Category',
        'Triggered Flags'
      ];
      sheet.appendRow(headers);
      
      // Format header row
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#2c5aa0');
      headerRange.setFontColor('#ffffff');
    }
    
    // Prepare the row data in the correct order
    const rowData = [
      data.timestamp || new Date().toISOString(),
      data.name || '',
      data.phone || '',
      data.q1 || '',
      data.q2 || '',
      data.q3 || '',
      data.q4 || '',
      data.q5 || '',
      data.q6 || '',
      data.q7 || '',
      data.q8 || '',
      data.q9 || '',
      data.q10 || '',
      data.q11 || '',
      data.totalScore || 0,
      data.baseCategory || '',
      data.finalCategory || '',
      Array.isArray(data.triggeredFlags) ? data.triggeredFlags.join(', ') : ''
    ];
    
    // Append the data row
    sheet.appendRow(rowData);
    
    // Auto-resize columns for better readability
    sheet.autoResizeColumns(1, rowData.length);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Data saved successfully',
      row: sheet.getLastRow()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Log error for debugging
    Logger.log('Error: ' + error.toString());
    
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function to verify the script works
function testDoPost() {
  const testData = {
    timestamp: new Date().toISOString(),
    name: 'Test User',
    phone: '+1234567890',
    q1: 'Ozempic / Wegovy',
    q2: '1–3 months',
    q3: 'Lost 5–10 kg',
    q4: 'Mild',
    q5: '1–2 days',
    q6: '0.7–1 g/kg',
    q7: 'No scan done',
    q8: 'Nausea, Constipation',
    q9: 'Mildly reduced',
    q10: 'Pre-diabetes',
    q11: 'Reduce side effects',
    totalScore: 18,
    baseCategory: 'GLP-1 360: TRANSFORM™️',
    finalCategory: 'GLP-1 360: TRANSFORM™️',
    triggeredFlags: []
  };
  
  const e = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(e);
  Logger.log('Test result: ' + result.getContent());
}
```

---

### Step 4: Save the Script

1. Click the **disk icon** or press `Ctrl+S` (Windows) / `Cmd+S` (Mac)
2. Name your project: **"GLP-1 Test Data Handler"**
3. Click **"OK"**

---

### Step 5: Test the Script (Optional but Recommended)

1. In the Apps Script editor, select the function **`testDoPost`** from the dropdown at the top
2. Click the **"Run"** button (▶️ play icon)
3. You'll be asked to authorize the script:
   - Click **"Review permissions"**
   - Choose your Google account
   - Click **"Advanced"** → **"Go to GLP-1 Test Data Handler (unsafe)"**
   - Click **"Allow"**
4. Go back to your Google Sheet - you should see a test row with sample data
5. If you see the data, the script is working! You can delete this test row.

---

### Step 6: Deploy as Web App

1. In the Apps Script editor, click **"Deploy"** → **"New deployment"**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **"Web app"**
4. Configure the deployment:
   - **Description**: "GLP-1 Risk Score Data Receiver"
   - **Execute as**: **"Me"** (your email)
   - **Who has access**: **"Anyone"** (important!)
5. Click **"Deploy"**
6. You may need to authorize again - follow the same steps as before
7. **IMPORTANT**: Copy the **Web App URL** - it will look like:
   ```
   https://script.google.com/macros/s/AKfycbx.../exec
   ```
8. Click **"Done"**

---

### Step 7: Add the URL to Your React App

1. Open your project folder
2. Edit the `.env` file
3. Replace the placeholder with your actual Web App URL:
   ```
   REACT_APP_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_ACTUAL_SCRIPT_ID/exec
   ```
4. Save the file
5. **Restart your development server**:
   ```bash
   # Stop the current server (Ctrl+C)
   # Then restart:
   npm start
   ```

---

### Step 8: Test the Complete Flow

1. Open your app in the browser (http://localhost:3000)
2. Complete the entire questionnaire
3. Enter your name and phone number
4. Submit the form
5. Check your Google Sheet - you should see a new row with all the data!

---

## 📋 What Your Google Sheet Will Look Like

| Timestamp | Name | Phone | Q1: GLP-1 Medication | Q2: Duration | ... | Total Score | Final Category |
|-----------|------|-------|---------------------|--------------|-----|-------------|----------------|
| 2024-12-02T10:30:00Z | John Doe | +1234567890 | Ozempic / Wegovy | 1–3 months | ... | 18 | GLP-1 360: TRANSFORM™️ |

---

## 🔧 Troubleshooting

### Issue: "Script not authorized"
**Solution**: Make sure you authorized the script in Step 5 and set "Who has access" to "Anyone" in Step 6.

### Issue: "No data appearing in sheet"
**Solution**: 
1. Check the Apps Script logs: In Apps Script editor, click **"Executions"** on the left
2. Look for errors in recent executions
3. Make sure you restarted your React app after updating `.env`

### Issue: "CORS error in browser console"
**Solution**: This is normal! We use `mode: "no-cors"` in the fetch request. The data is still being sent successfully.

### Issue: "Columns are too narrow"
**Solution**: The script auto-resizes columns, but you can manually adjust them in Google Sheets.

---

## 🎨 Optional: Format Your Google Sheet

### Add Conditional Formatting for Categories

1. Select the "Final Category" column
2. Click **Format** → **Conditional formatting**
3. Add rules:
   - **BASE™️**: Green background (#e8f5e9)
   - **TRANSFORM™️**: Orange background (#fff3e0)
   - **EXIT™️**: Red background (#ffebee)

### Freeze Header Row

1. Click on row 1
2. Click **View** → **Freeze** → **1 row**

### Add Data Validation

You can add filters to easily sort and analyze your data:
1. Select all data (Ctrl+A / Cmd+A)
2. Click **Data** → **Create a filter**

---

## 📊 Analyzing Your Data

### View Statistics
- Use Google Sheets formulas to calculate:
  - Average score: `=AVERAGE(O2:O)`
  - Category distribution: `=COUNTIF(Q2:Q,"*BASE*")`
  - Most common answers: Use pivot tables

### Export Data
- **File** → **Download** → Choose format (Excel, CSV, PDF)

### Share with Team
- Click **Share** button → Add team members' emails

---

## 🔒 Security Notes

1. **Never commit your `.env` file** - it's already in `.gitignore`
2. **Keep your Web App URL private** - anyone with it can submit data
3. **Regularly backup your Google Sheet**
4. **Consider adding authentication** for production use

---

## 🚀 For Production Deployment

When deploying to production (Vercel, Netlify, etc.):

1. Add the environment variable in your hosting platform:
   - **Vercel**: Settings → Environment Variables
   - **Netlify**: Site settings → Environment variables
   - Add: `REACT_APP_GOOGLE_SCRIPT_URL` = your Web App URL

2. The app will automatically use the production URL

---

## ✅ Checklist

- [ ] Created Google Sheet
- [ ] Added Apps Script code
- [ ] Saved and named the project
- [ ] Tested with `testDoPost` function
- [ ] Deployed as Web App
- [ ] Copied Web App URL
- [ ] Updated `.env` file
- [ ] Restarted React app
- [ ] Tested complete flow
- [ ] Data appears in Google Sheet

---

## 📞 Need Help?

If you encounter any issues:
1. Check the Apps Script execution logs
2. Verify the Web App URL is correct in `.env`
3. Make sure the script is deployed with "Anyone" access
4. Check browser console for any errors

---

**That's it! Your GLP-1 Risk Score Test is now fully connected to Google Sheets! 🎉**
