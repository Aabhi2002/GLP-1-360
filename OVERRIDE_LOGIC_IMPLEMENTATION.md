# Override Logic Implementation Summary

## ✅ What Was Implemented

### New Questions Added (Q12, Q13, Q14)

All three questions have the same text: **"Select if applicable:"**

**Question 12 - Critical EXIT Flags:**
- Appetite < 600 kcal/day
- Planning to stop GLP-1 within 30 days
- Already regained > 3 kg after stopping
- None

**Question 13 - Severe Risk Flags:**
- Muscle loss > 1.5–2.0 kg on BCA
- Plateau > 4 weeks
- Persistent weakness
- Moderate gut issues
- None

**Question 14 - Additional Risk Flags:**
- Completely new starter
- No side effects
- Normal strength levels
- None

---

## 🔄 Logic Flow

```
Q1-Q11 (Calculate Score)
    ↓
Q12 (EXIT Flags)
    ↓
    ├─ If ANY selected (not None) → EXIT™️ Plan 🔴
    └─ If None → Q13
                  ↓
                Q13 (TRANSFORM Flags)
                  ↓
                  ├─ If ANY selected (not None) → TRANSFORM™️ Plan 🟡
                  └─ If None → Q14
                                ↓
                              Q14 (BASE Flags)
                                ↓
                                ├─ If ANY selected (not None) → BASE™️ Plan 🟢
                                └─ If None → Score-Based Logic
                                              ↓
                                              0-15 = BASE™️
                                              16-30 = TRANSFORM™️
                                              31+ = EXIT™️
```

---

## 📝 Key Features

### 1. Conditional Question Display
- Q13 only shows if Q12 = "None"
- Q14 only shows if Q12 = "None" AND Q13 = "None"
- Questions are automatically skipped based on user selections

### 2. Override Alert
- When override is triggered, a prominent warning box appears on results page
- Shows which flags were triggered
- Explains why EXIT™️ plan was assigned

### 3. Data Tracking
All submissions include:
- Q12, Q13, Q14 answers (or "Skipped" if not shown)
- Override Applied: Yes/No
- Triggered Flags: List of selected flags
- Total Score: Still calculated from Q1-Q11 for analytics

### 4. Smart Progress Bar
- Adjusts based on which questions will be shown
- Accounts for skipped questions

---

## 📊 Google Sheets Data Structure

New columns added:
- **Q12: EXIT Flags** - Selected flags or "None" or "Skipped"
- **Q13: Severe Risk Flags** - Selected flags or "None" or "Skipped"
- **Q14: Additional Risk Flags** - Selected flags or "None" or "Skipped"
- **Override Applied** - "Yes" or "No"
- **Triggered Flags** - Comma-separated list of flags that triggered EXIT

---

## 🎨 UI Changes

### Override Alert Box
- Orange/yellow warning color scheme
- Large warning icon (⚠️)
- Clear explanation of why override was applied
- List of triggered flags
- Appears above the analysis section

### Question Display
- All 3 override questions use the same section header
- Multi-select checkboxes (like Q8 and Q10)
- "None" option clears other selections

---

## 🔧 Technical Implementation

### Files Modified:

1. **src/questionsConfig.js**
   - Added Q12, Q13, Q14 with `isOverride: true` flag
   - Set `overrideCategory: "EXIT"` for all three

2. **src/scoring.js**
   - Added `checkOverrideFlags()` function
   - Updated `getFinalCategory()` to check overrides first
   - Returns override information with flags

3. **src/GlpTestPage.jsx**
   - Added `shouldShowQuestion()` logic
   - Updated `handleNext()` to skip questions
   - Modified progress calculation
   - Updated submit handler to pass override data

4. **src/ResultPage.jsx**
   - Added override alert display
   - Shows triggered flags
   - Styled warning box

5. **GOOGLE_SHEETS_SETUP.md**
   - Updated headers to include Q12, Q13, Q14
   - Added Override Applied column
   - Updated test data

---

## ✅ Testing Checklist

- [ ] Q12 with any selection (not None) → Shows EXIT™️ plan
- [ ] Q12 = None → Shows Q13
- [ ] Q13 with any selection (not None) → Shows EXIT™️ plan
- [ ] Q13 = None → Shows Q14
- [ ] Q14 with any selection (not None) → Shows EXIT™️ plan
- [ ] Q14 = None → Uses score-based logic
- [ ] Override alert displays correctly
- [ ] Triggered flags show in alert
- [ ] Data saves to Google Sheets with all new fields
- [ ] Progress bar adjusts for skipped questions

---

## 🚀 Deployment Notes

No additional environment variables needed. The implementation works with existing setup.

When deploying to Vercel:
1. Same `.env` configuration as before
2. No changes to Google Apps Script needed (columns auto-added)
3. Test all override scenarios after deployment

---

## 📱 User Experience

### Scenario 1: User selects EXIT flag in Q12
1. Answers Q1-Q11
2. Sees Q12, selects "Appetite < 600 kcal/day"
3. Q13 and Q14 are skipped
4. Enters name and phone
5. Sees EXIT™️ plan with override alert

### Scenario 2: User selects flag in Q13
1. Answers Q1-Q11
2. Sees Q12, selects "None"
3. Sees Q13, selects "Plateau > 4 weeks"
4. Q14 is skipped
5. Enters name and phone
6. Sees EXIT™️ plan with override alert

### Scenario 3: No flags selected
1. Answers Q1-Q11
2. Sees Q12, selects "None"
3. Sees Q13, selects "None"
4. Sees Q14, selects "None"
5. Enters name and phone
6. Sees plan based on score (BASE/TRANSFORM/EXIT)

---

**Implementation Complete! ✅**
