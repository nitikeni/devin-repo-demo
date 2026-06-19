# Quick Start Guide - Student Attendance Webapp

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
cd /workspace/repo
npm install
```

### Step 2: Start the Server
```bash
npm start
```

You should see:
```
============================================================
Student Attendance Webapp Server
============================================================
Server running at: http://localhost:3000
Environment: development
Timestamp: 2024-06-19T...
============================================================
```

### Step 3: Open in Browser
1. Open your browser
2. Go to `http://localhost:3000`
3. Click "Load Sample Data" to populate with test data

## 📋 What You Can Do

### Add Students
- Fill in the "Add New Student" form
- Enter name, ID, email, and roll number
- Click "Add Student"

### Mark Attendance
- Select a date using the date picker
- Click "Present", "Absent", or "Leave" for each student
- Click "Save Attendance"

### View Reports
- See total students and attendance records
- Filter by student to view history
- Export data as CSV

### Manage Data
- Clear attendance for current date
- Clear all data and start fresh

## 🎯 Sample Data

The app comes with 5 sample students:
1. **John Doe** (STU001) - john.doe@example.com
2. **Jane Smith** (STU002) - jane.smith@example.com
3. **Michael Johnson** (STU003) - michael.j@example.com
4. **Emily Davis** (STU004) - emily.davis@example.com
5. **Robert Wilson** (STU005) - robert.w@example.com

And 10 attendance records spanning 2 days.

## 🌐 Access Points

- **Main App:** http://localhost:3000
- **Sample Data Loader:** http://localhost:3000/sample-data-init.html
- **Health Check:** http://localhost:3000/api/health
- **Sample Data API:** http://localhost:3000/api/sample-data

## 📱 Features

✅ Add and manage students
✅ Mark attendance (Present/Absent/Leave)
✅ View attendance history
✅ Generate reports
✅ Export data as CSV
✅ Responsive design (mobile, tablet, desktop)
✅ Data persistence (localStorage)
✅ No database required

## 🛠️ Troubleshooting

### Port 3000 already in use?
```bash
PORT=3001 npm start
```

### Sample data not loading?
1. Clear browser cache (Ctrl+Shift+Delete)
2. Try incognito/private mode
3. Check browser console for errors

### Styles not showing?
1. Hard refresh (Ctrl+F5)
2. Check browser console
3. Verify server is running

## 📚 Documentation

- **Full Guide:** See `DEPLOYMENT_GUIDE.md`
- **Testing:** See `TEST_GUIDE.md`
- **Completion Report:** See `STEP7_COMPLETION.md`
- **Database Schema:** See `DATA_SCHEMA.md`

## 🎓 Next Steps

1. **Explore the UI** - Click around and get familiar with the interface
2. **Load Sample Data** - Use the sample data to test features
3. **Add Your Data** - Add your own students and attendance records
4. **Export Reports** - Generate and download attendance reports
5. **Deploy** - Follow `DEPLOYMENT_GUIDE.md` to deploy to production

## 💡 Tips

- Data is saved in browser's localStorage
- Clear browser data to reset the app
- Use the date picker to view different dates
- Export data regularly as backup
- Check browser console (F12) for any errors

## 🆘 Need Help?

1. Check the documentation files
2. Review the TEST_GUIDE.md for detailed testing procedures
3. Check browser console for error messages
4. Verify Node.js and npm are installed correctly

---

**Happy tracking! 📊**
