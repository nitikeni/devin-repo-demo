# Installation Guide

## Prerequisites

- **Node.js** v14 or higher
- **npm** v6 or higher
- **Git** (optional, for cloning)
- Modern web browser

## Installation Steps

### 1. Get the Code

**Option A: Clone from GitHub**
```bash
git clone https://github.com/nitikeni/devin-repo-demo.git
cd devin-repo-demo
```

**Option B: Download ZIP**
1. Go to https://github.com/nitikeni/devin-repo-demo
2. Click "Code" → "Download ZIP"
3. Extract the ZIP file
4. Open terminal in the extracted folder

### 2. Install Dependencies

```bash
npm install
```

This will install:
- express (^4.18.2)
- cors (^2.8.5)

### 3. Start the Server

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

### 4. Open in Browser

1. Open your web browser
2. Navigate to `http://localhost:3000`
3. You should see the Student Attendance System

## Verify Installation

### Check Node.js
```bash
node --version
# Should show v14.0.0 or higher
```

### Check npm
```bash
npm --version
# Should show v6.0.0 or higher
```

### Check Installation
```bash
npm list --depth=0
# Should show express and cors
```

### Test Server
```bash
curl http://localhost:3000/api/health
# Should return JSON with status: "ok"
```

## Troubleshooting

### Issue: "command not found: node"
**Solution:** Install Node.js from https://nodejs.org/

### Issue: "Port 3000 already in use"
**Solution:** Use a different port
```bash
PORT=3001 npm start
```

### Issue: "npm ERR! code EACCES"
**Solution:** Fix npm permissions
```bash
sudo chown -R $(whoami) ~/.npm
```

### Issue: Dependencies won't install
**Solution:** Clear npm cache
```bash
npm cache clean --force
npm install
```

## Next Steps

1. **Load Sample Data**
   - Visit http://localhost:3000/sample-data-init.html
   - Click "Load Sample Data"

2. **Test Features**
   - Mark attendance
   - Add students
   - View reports
   - Export data

3. **Read Documentation**
   - See QUICKSTART.md for quick start
   - See README.md for full documentation
   - See TEST_GUIDE.md for testing

## Uninstall

To remove the application:

```bash
# Stop the server (Ctrl+C)

# Remove dependencies
rm -rf node_modules
rm package-lock.json

# Remove the folder
cd ..
rm -rf devin-repo-demo
```

## System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| Node.js | v14 | v18+ |
| npm | v6 | v8+ |
| RAM | 512MB | 2GB+ |
| Disk Space | 100MB | 500MB+ |
| Browser | Modern | Latest |

## Supported Operating Systems

- ✅ Windows 10/11
- ✅ macOS 10.15+
- ✅ Linux (Ubuntu, Debian, CentOS, etc.)
- ✅ Any OS with Node.js support

## Getting Help

1. Check QUICKSTART.md
2. Review TEST_GUIDE.md
3. Check browser console (F12)
4. Review DEPLOYMENT_GUIDE.md
5. Open an issue on GitHub

---

**Installation Complete!** 🎉

Your Student Attendance Webapp is now ready to use.
