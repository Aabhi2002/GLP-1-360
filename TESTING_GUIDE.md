# Testing Guide for Override Logic

## 🧪 Test Scenarios

### Test 1: Q12 Override (EXIT)
**Steps:**
1. Start the questionnaire
2. Answer Q1-Q11 with any values
3. On Q12, select **"Appetite < 600 kcal/day"** (or any option except "None")
4. Notice Q13 and Q14 are skipped
5. Enter name and phone
6. Submit

**Expected Result:**
- ✅ Shows EXIT™️ plan
- ✅ Orange override alert appears
- ✅ Alert shows: "Appetite < 600 kcal/day"
- ✅ Google Sheet shows Q12 with selected flag, Q13="Skipped", Q14="Skipped"
- ✅ Override Applied = "Yes"

---

### Test 2: Q13 Override (EXIT)
**Steps:**
1. Start the questionnaire
2. Answer Q1-Q11 with any values
3. On Q12, select **"None"**
4. On Q13, select **"Plateau > 4 weeks"** (or any option except "None")
5. Notice Q14 is skipped
6. Enter name and phone
7. Submit

**Expected Result:**
- ✅ Shows EXIT™️ plan
- ✅ Orange override alert appears
- ✅ Alert shows: "Plateau > 4 weeks"
- ✅ Google Sheet shows Q12="None", Q13 with selected flag, Q14="Skipped"
- ✅ Override Applied = "Yes"

---

### Test 3: Q14 Override (EXIT)
**Steps:**
1. Start the questionnaire
2. Answer Q1-Q11 with any values
3. On Q12, select **"None"**
4. On Q13, select **"None"**
5. On Q14, select **"Completely new starter"** (or any option except "None")
6. Enter name and phone
7. Submit

**Expected Result:**
- ✅ Shows EXIT™️ plan
- ✅ Orange override alert appears
- ✅ Alert shows: "Completely new starter"
- ✅ Google Sheet shows Q12="None", Q13="None", Q14 with selected flag
- ✅ Override Applied = "Yes"

---

### Test 4: No Override - Score-Based (BASE)
**Steps:**
1. Start the questionnaire
2. Answer Q1-Q11 to get a LOW score (0-15)
   - Example: Select lowest score options
3. On Q12, select **"None"**
4. On Q13, select **"None"**
5. On Q14, select **"None"**
6. Enter name and phone
7. Submit

**Expected Result:**
- ✅ Shows BASE™️ plan
- ✅ NO override alert
- ✅ Google Sheet shows Q12="None", Q13="None", Q14="None"
- ✅ Override Applied = "No"
- ✅ Score between 0-15

---

### Test 5: No Override - Score-Based (TRANSFORM)
**Steps:**
1. Start the questionnaire
2. Answer Q1-Q11 to get a MEDIUM score (16-30)
   - Example: Select medium score options
3. On Q12, select **"None"**
4. On Q13, select **"None"**
5. On Q14, select **"None"**
6. Enter name and phone
7. Submit

**Expected Result:**
- ✅ Shows TRANSFORM™️ plan
- ✅ NO override alert
- ✅ Google Sheet shows Q12="None", Q13="None", Q14="None"
- ✅ Override Applied = "No"
- ✅ Score between 16-30

---

### Test 6: No Override - Score-Based (EXIT)
**Steps:**
1. Start the questionnaire
2. Answer Q1-Q11 to get a HIGH score (31+)
   - Example: Select highest score options
3. On Q12, select **"None"**
4. On Q13, select **"None"**
5. On Q14, select **"None"**
6. Enter name and phone
7. Submit

**Expected Result:**
- ✅ Shows EXIT™️ plan
- ✅ NO override alert (score-based, not override)
- ✅ Google Sheet shows Q12="None", Q13="None", Q14="None"
- ✅ Override Applied = "No"
- ✅ Score 31 or higher

---

### Test 7: Multiple Flags Selected
**Steps:**
1. Start the questionnaire
2. Answer Q1-Q11 with any values
3. On Q12, select **multiple options** (e.g., "Appetite < 600 kcal/day" AND "Planning to stop GLP-1 within 30 days")
4. Notice Q13 and Q14 are skipped
5. Enter name and phone
6. Submit

**Expected Result:**
- ✅ Shows EXIT™️ plan
- ✅ Override alert shows BOTH flags in the list
- ✅ Google Sheet shows both flags in Q12 column (comma-separated)
- ✅ Triggered Flags column shows both flags

---

### Test 8: "None" Selection Clears Others
**Steps:**
1. On Q12, select "Appetite < 600 kcal/day"
2. Then select "None"

**Expected Result:**
- ✅ "Appetite < 600 kcal/day" is deselected
- ✅ Only "None" remains selected
- ✅ Q13 appears (because Q12 = None)

---

### Test 9: Progress Bar Adjustment
**Steps:**
1. Start questionnaire
2. On Q12, select any flag (not None)
3. Watch progress bar

**Expected Result:**
- ✅ Progress bar jumps from Q12 directly to contact form
- ✅ Progress shows correct percentage (skipping Q13, Q14)

---

### Test 10: Google Sheets Data Verification
**After any test, check Google Sheet:**

**Expected Columns:**
1. Timestamp ✅
2. Name ✅
3. Phone ✅
4. Q1-Q11 answers ✅
5. Q12 answer ✅
6. Q13 answer (or "Skipped") ✅
7. Q14 answer (or "Skipped") ✅
8. Total Score ✅
9. Override Applied (Yes/No) ✅
10. Base Category ✅
11. Final Category ✅
12. Triggered Flags ✅

---

## 🐛 Common Issues to Check

### Issue: Q13 shows even when Q12 has a flag
**Check:** Make sure "None" option is not also selected with the flag

### Issue: Override alert doesn't show
**Check:** Verify `isOverride` and `triggeredFlags` are being passed to ResultPage

### Issue: Google Sheet missing columns
**Check:** Run the `testDoPost` function in Apps Script to initialize headers

### Issue: Progress bar incorrect
**Check:** Make sure `shouldShowQuestion()` logic is working correctly

---

## ✅ Quick Test Checklist

- [ ] Q12 flag triggers EXIT
- [ ] Q13 flag triggers EXIT
- [ ] Q14 flag triggers EXIT
- [ ] All "None" selections use score-based logic
- [ ] Override alert displays correctly
- [ ] Triggered flags show in alert
- [ ] Questions skip correctly
- [ ] Progress bar adjusts
- [ ] Google Sheet receives all data
- [ ] Multiple flags can be selected
- [ ] "None" clears other selections

---

**Happy Testing! 🎉**
