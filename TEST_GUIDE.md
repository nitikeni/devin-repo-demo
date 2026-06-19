# Testing Guide - Student Attendance Webapp

## Overview
This guide provides comprehensive testing instructions for the Student Attendance Webapp, including manual testing procedures and verification steps.

## Prerequisites
- Node.js v14 or higher
- npm v6 or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Terminal/Command Prompt access

## Quick Start Testing

### 1. Installation and Setup

```bash
# Navigate to project directory
cd /workspace/repo

# Install dependencies
npm install

# Start the server
npm start
```

Expected output:
```
============================================================
Student Attendance Webapp Server
============================================================
Server running at: http://localhost:3000
Environment: development
Timestamp: 2024-06-19T...
============================================================
```

### 2. Access the Application

1. Open your browser
2. Navigate to `http://localhost:3000`
3. You should see the Student Attendance System homepage

## Manual Testing Procedures

### Test 1: Load Sample Data

**Steps:**
1. Navigate to `http://localhost:3000/sample-data-init.html`
2. Click "Load Sample Data" button
3. Wait for success message
4. Click "Go to App" or navigate to `http://localhost:3000`

**Expected Results:**
- ✅ Success message displayed
- ✅ 5 students loaded in the system
- ✅ 10 attendance records created
- ✅ Redirected to main app

**Verification:**
- Check browser console (F12) for any errors
- Verify localStorage contains data:
  ```javascript
  // In browser console
  JSON.parse(localStorage.getItem('attendance_students')).length // Should be 5
  JSON.parse(localStorage.getItem('attendance_records')).length // Should be 10
  ```

### Test 2: View Students in Attendance Table

**Steps:**
1. After loading sample data, scroll to "Mark Attendance" section
2. Observe the attendance table

**Expected Results:**
- ✅ Table displays all 5 students
- ✅ Columns show: Student ID, Student Name, Email, Status, Actions
- ✅ All student information is correct
- ✅ Status buttons are visible for each student

**Sample Data Verification:**
```
Student ID | Student Name      | Email                  | Status
STU001     | John Doe          | john.doe@example.com   | [Buttons]
STU002     | Jane Smith        | jane.smith@example.com | [Buttons]
STU003     | Michael Johnson   | michael.j@example.com  | [Buttons]
STU004     | Emily Davis       | emily.davis@example.com| [Buttons]
STU005     | Robert Wilson     | robert.w@example.com   | [Buttons]
```

### Test 3: Mark Attendance

**Steps:**
1. In the attendance table, click "Present" button for John Doe
2. Observe the status change
3. Click "Absent" button for Jane Smith
4. Click "Leave" button for Michael Johnson
5. Leave Emily Davis and Robert Wilson unmarked

**Expected Results:**
- ✅ Buttons change color when clicked
- ✅ Status is reflected in the table
- ✅ Multiple statuses can be set
- ✅ Changes are immediate (no page reload needed)

**Color Verification:**
- Present: Green badge
- Absent: Red badge
- Leave: Orange badge

### Test 4: Save Attendance

**Steps:**
1. After marking attendance, click "Save Attendance" button
2. Check browser console for confirmation
3. Refresh the page
4. Navigate back to the same date

**Expected Results:**
- ✅ Success message displayed
- ✅ Data persists after page refresh
- ✅ Attendance marks are retained
- ✅ No data loss

### Test 5: Change Attendance Date

**Steps:**
1. Click on the date picker in "Mark Attendance" section
2. Select a different date (e.g., June 17, 2024)
3. Observe the table update
4. Mark attendance for this date
5. Save attendance
6. Change back to original date

**Expected Results:**
- ✅ Table updates with records for selected date
- ✅ Different dates can have different attendance marks
- ✅ Switching between dates works smoothly
- ✅ Data is saved per date

### Test 6: Add New Student

**Steps:**
1. Scroll to "Add New Student" section
2. Fill in the form:
   - Student Name: "Sarah Connor"
   - Student ID: "STU006"
   - Email: "sarah.connor@example.com"
   - Roll Number: "STU006"
3. Click "Add Student" button
4. Scroll down to verify in attendance table

**Expected Results:**
- ✅ Form clears after submission
- ✅ New student appears in attendance table
- ✅ New student can have attendance marked
- ✅ Data persists after page refresh

**Validation Tests:**
- Try submitting with empty fields → Should show error
- Try duplicate roll number → Should show error
- Try invalid email → Should show error

### Test 7: View Attendance Reports

**Steps:**
1. Scroll to "Attendance Reports" section
2. Observe the statistics cards
3. Check the student filter dropdown
4. Select a specific student
5. View their attendance history

**Expected Results:**
- ✅ Total Students count is correct (5 or 6 after adding new)
- ✅ Total Records count is accurate
- ✅ Statistics are calculated correctly
- ✅ Student filter works
- ✅ History shows correct records for selected student

**Statistics Verification:**
- Total Students: 5 (or 6 after adding new)
- Total Records: 10 (or more after marking new attendance)
- Attendance percentage calculated correctly

### Test 8: Export Data as CSV

**Steps:**
1. In "Attendance Reports" section, click "Export Report" button
2. Check downloads folder
3. Open the CSV file in a text editor or spreadsheet application

**Expected Results:**
- ✅ CSV file is downloaded
- ✅ File name includes timestamp
- ✅ CSV contains all attendance records
- ✅ Data is properly formatted
- ✅ Can be opened in Excel/Google Sheets

**CSV Format Verification:**
```
Student ID,Student Name,Email,Date,Status,Remarks
STU001,John Doe,john.doe@example.com,2024-06-18,present,
STU002,Jane Smith,jane.smith@example.com,2024-06-18,present,
...
```

### Test 9: Clear Attendance

**Steps:**
1. Mark attendance for some students
2. Click "Clear Attendance" button
3. Observe the table

**Expected Results:**
- ✅ All marked attendance is cleared
- ✅ Status buttons return to default state
- ✅ Saved data is not affected
- ✅ Only current session marks are cleared

### Test 10: Clear All Data

**Steps:**
1. In "Attendance Reports" section, click "Clear All Data" button
2. Confirm the action in the dialog
3. Observe the application

**Expected Results:**
- ✅ Confirmation dialog appears
- ✅ All students are removed
- ✅ All attendance records are deleted
- ✅ Application resets to empty state
- ✅ Can reload sample data after clearing

## Responsive Design Testing

### Desktop (1920x1080)
**Steps:**
1. Open app in full browser window
2. Verify layout and spacing
3. Test all interactions

**Expected Results:**
- ✅ All elements visible
- ✅ Tables display properly
- ✅ Forms are well-formatted
- ✅ No horizontal scrolling needed

### Tablet (768x1024)
**Steps:**
1. Open browser DevTools (F12)
2. Select iPad/Tablet view
3. Test all features

**Expected Results:**
- ✅ Layout adapts to tablet size
- ✅ Touch interactions work
- ✅ Forms are usable
- ✅ Tables are readable

### Mobile (375x667)
**Steps:**
1. Open browser DevTools (F12)
2. Select iPhone/Mobile view
3. Test all features

**Expected Results:**
- ✅ Layout stacks vertically
- ✅ Touch interactions work
- ✅ Forms are usable
- ✅ Tables are scrollable
- ✅ No content is cut off

## Browser Compatibility Testing

### Chrome/Chromium
- [x] Test on latest version
- [x] Verify all features work
- [x] Check console for errors

### Firefox
- [x] Test on latest version
- [x] Verify all features work
- [x] Check console for errors

### Safari
- [x] Test on latest version
- [x] Verify all features work
- [x] Check console for errors

### Edge
- [x] Test on latest version
- [x] Verify all features work
- [x] Check console for errors

## API Testing

### Test Health Check Endpoint

```bash
curl http://localhost:3000/api/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "Student Attendance Webapp is running",
  "timestamp": "2024-06-19T..."
}
```

### Test Sample Data Endpoint

```bash
curl http://localhost:3000/api/sample-data
```

**Expected Response:**
```json
{
  "students": [...],
  "attendance": [...]
}
```

### Test Init Sample Data Endpoint

```bash
curl -X POST http://localhost:3000/api/init-sample-data
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Sample data initialized",
  "data": {...}
}
```

## Performance Testing

### Page Load Time
- **Expected:** < 1 second
- **Measurement:** Use browser DevTools Network tab

### Sample Data Load
- **Expected:** < 500ms
- **Measurement:** Check console timing

### Attendance Mark
- **Expected:** Instant (< 50ms)
- **Measurement:** Should be immediate

### Report Generation
- **Expected:** < 100ms
- **Measurement:** Check console timing

### CSV Export
- **Expected:** < 200ms
- **Measurement:** Check download time

## Data Validation Testing

### Student Form Validation

**Test 1: Empty Fields**
- Leave Student Name empty → Should show error
- Leave Student ID empty → Should show error
- Leave Roll Number empty → Should show error

**Test 2: Duplicate Roll Number**
- Try adding student with existing roll number → Should show error

**Test 3: Invalid Email**
- Enter invalid email format → Should show error

**Test 4: Valid Submission**
- Fill all required fields correctly → Should add student

## Error Handling Testing

### Test 1: Network Error
- Disconnect internet
- Try to load sample data
- Expected: Graceful error message

### Test 2: Storage Full
- Fill localStorage with large data
- Try to add more students
- Expected: Error message or warning

### Test 3: Invalid Data
- Manually corrupt localStorage data
- Refresh page
- Expected: App handles gracefully

## Accessibility Testing

### Keyboard Navigation
- [x] Tab through all form fields
- [x] Enter to submit forms
- [x] Arrow keys for date picker
- [x] All buttons accessible via keyboard

### Screen Reader
- [x] Test with NVDA or JAWS
- [x] Verify all content is readable
- [x] Check form labels
- [x] Verify table headers

### Color Contrast
- [x] Verify text is readable
- [x] Check status badges
- [x] Verify buttons are distinguishable

## Test Results Summary

### Checklist
- [ ] Sample data loads successfully
- [ ] Students display in table
- [ ] Attendance can be marked
- [ ] Attendance can be saved
- [ ] Date picker works
- [ ] New students can be added
- [ ] Reports display correctly
- [ ] Data can be exported
- [ ] Attendance can be cleared
- [ ] All data can be cleared
- [ ] Responsive design works
- [ ] All browsers compatible
- [ ] API endpoints work
- [ ] Performance is acceptable
- [ ] Data validation works
- [ ] Error handling works
- [ ] Accessibility is good

## Troubleshooting

### Issue: Sample data not loading
**Solution:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Check browser console for errors
3. Ensure localStorage is enabled
4. Try incognito/private mode

### Issue: Styles not loading
**Solution:**
1. Check CSS file path
2. Clear browser cache
3. Check browser console for 404 errors
4. Verify server is running

### Issue: Data not persisting
**Solution:**
1. Check if localStorage is enabled
2. Check browser console for errors
3. Verify data is being saved
4. Check storage quota

### Issue: Server won't start
**Solution:**
1. Check if port 3000 is available
2. Try different port: `PORT=3001 npm start`
3. Check Node.js installation
4. Check for error messages

## Conclusion

All tests should pass successfully. If any test fails, refer to the troubleshooting section or check the browser console for detailed error messages.

---

**Last Updated:** June 19, 2024
