# Deployment Guide - Student Attendance Webapp

## Table of Contents
1. [Local Development](#local-development)
2. [Production Deployment](#production-deployment)
3. [Cloud Deployment](#cloud-deployment)
4. [Docker Deployment](#docker-deployment)
5. [Troubleshooting](#troubleshooting)

## Local Development

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- Git

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nitikeni/devin-repo-demo.git
   cd devin-repo-demo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Access the application:**
   - Open your browser and navigate to `http://localhost:3000`
   - To load sample data, visit `http://localhost:3000/sample-data-init.html`

### Development Commands

```bash
# Start server
npm start

# Run tests
npm test

# Install new package
npm install <package-name>
```

## Production Deployment

### Environment Setup

1. **Create `.env` file:**
   ```bash
   NODE_ENV=production
   PORT=3000
   ```

2. **Update `server.js` for production:**
   ```javascript
   const PORT = process.env.PORT || 3000;
   const ENV = process.env.NODE_ENV || 'development';
   ```

3. **Install production dependencies:**
   ```bash
   npm install --production
   ```

### Running in Production

1. **Using Node directly:**
   ```bash
   NODE_ENV=production node server.js
   ```

2. **Using PM2 (Process Manager):**
   ```bash
   # Install PM2 globally
   npm install -g pm2
   
   # Start application
   pm2 start server.js --name "attendance-app"
   
   # View logs
   pm2 logs attendance-app
   
   # Restart application
   pm2 restart attendance-app
   
   # Stop application
   pm2 stop attendance-app
   ```

3. **Create PM2 ecosystem file (`ecosystem.config.js`):**
   ```javascript
   module.exports = {
     apps: [{
       name: 'attendance-app',
       script: './server.js',
       instances: 'max',
       exec_mode: 'cluster',
       env: {
         NODE_ENV: 'production',
         PORT: 3000
       }
     }]
   };
   ```

   Then run:
   ```bash
   pm2 start ecosystem.config.js
   ```

## Cloud Deployment

### Heroku Deployment

1. **Install Heroku CLI:**
   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku
   
   # Windows
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Create Procfile:**
   ```
   web: node server.js
   ```

3. **Deploy:**
   ```bash
   heroku login
   heroku create your-app-name
   git push heroku main
   heroku open
   ```

### AWS EC2 Deployment

1. **Launch EC2 instance:**
   - Choose Ubuntu 20.04 LTS AMI
   - Select t2.micro (free tier eligible)
   - Configure security group (allow ports 80, 443, 3000)

2. **Connect and setup:**
   ```bash
   ssh -i your-key.pem ubuntu@your-instance-ip
   
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Clone repository
   git clone https://github.com/nitikeni/devin-repo-demo.git
   cd devin-repo-demo
   
   # Install dependencies
   npm install
   
   # Start with PM2
   npm install -g pm2
   pm2 start server.js
   pm2 startup
   pm2 save
   ```

3. **Setup Nginx reverse proxy:**
   ```bash
   sudo apt install nginx
   
   # Edit /etc/nginx/sites-available/default
   sudo nano /etc/nginx/sites-available/default
   ```

   Add:
   ```nginx
   server {
       listen 80 default_server;
       listen [::]:80 default_server;
       
       server_name _;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Then:
   ```bash
   sudo systemctl restart nginx
   ```

### Google Cloud Run Deployment

1. **Create `Dockerfile`:**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install --production
   COPY . .
   EXPOSE 3000
   CMD ["node", "server.js"]
   ```

2. **Deploy:**
   ```bash
   gcloud run deploy attendance-app \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

### Azure App Service Deployment

1. **Create App Service:**
   ```bash
   az group create --name myResourceGroup --location eastus
   az appservice plan create --name myAppServicePlan --resource-group myResourceGroup --sku B1 --is-linux
   az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name attendance-app --runtime "NODE|18-lts"
   ```

2. **Deploy from Git:**
   ```bash
   az webapp deployment source config-zip --resource-group myResourceGroup --name attendance-app --src deploy.zip
   ```

## Docker Deployment

### Build and Run Locally

1. **Create `Dockerfile`:**
   ```dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   
   # Copy package files
   COPY package*.json ./
   
   # Install dependencies
   RUN npm install --production
   
   # Copy application files
   COPY . .
   
   # Expose port
   EXPOSE 3000
   
   # Health check
   HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
     CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"
   
   # Start application
   CMD ["node", "server.js"]
   ```

2. **Create `.dockerignore`:**
   ```
   node_modules
   npm-debug.log
   .git
   .gitignore
   README.md
   .env
   .DS_Store
   ```

3. **Build image:**
   ```bash
   docker build -t attendance-app:latest .
   ```

4. **Run container:**
   ```bash
   docker run -p 3000:3000 --name attendance-app attendance-app:latest
   ```

### Docker Compose

1. **Create `docker-compose.yml`:**
   ```yaml
   version: '3.8'
   
   services:
     app:
       build: .
       ports:
         - "3000:3000"
       environment:
         - NODE_ENV=production
         - PORT=3000
       restart: unless-stopped
       healthcheck:
         test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
         interval: 30s
         timeout: 10s
         retries: 3
         start_period: 5s
   ```

2. **Run with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

## SSL/HTTPS Setup

### Using Let's Encrypt with Certbot

1. **Install Certbot:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

2. **Get certificate:**
   ```bash
   sudo certbot certonly --nginx -d yourdomain.com
   ```

3. **Update Nginx configuration:**
   ```nginx
   server {
       listen 443 ssl http2;
       server_name yourdomain.com;
       
       ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   
   # Redirect HTTP to HTTPS
   server {
       listen 80;
       server_name yourdomain.com;
       return 301 https://$server_name$request_uri;
   }
   ```

## Monitoring and Logging

### PM2 Monitoring

```bash
# Install PM2 Plus
pm2 install pm2-auto-pull

# Monitor in real-time
pm2 monit

# View logs
pm2 logs

# Save logs
pm2 save
```

### Application Logging

Add to `server.js`:
```javascript
const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logFile = path.join(logDir, `app-${new Date().toISOString().split('T')[0]}.log`);

function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(logMessage);
  fs.appendFileSync(logFile, logMessage);
}
```

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 npm start
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Memory Issues
```bash
# Increase Node.js memory limit
node --max-old-space-size=4096 server.js
```

### CORS Issues
- Ensure CORS is enabled in `server.js`
- Check allowed origins
- Verify headers are correct

## Performance Optimization

1. **Enable compression:**
   ```bash
   npm install compression
   ```

2. **Add caching headers:**
   ```javascript
   app.use(express.static(path.join(__dirname), {
     maxAge: '1d',
     etag: false
   }));
   ```

3. **Use CDN for static files**

4. **Enable gzip compression in Nginx:**
   ```nginx
   gzip on;
   gzip_types text/plain text/css text/javascript application/json;
   ```

## Backup and Recovery

1. **Backup data:**
   ```bash
   # Backup entire application
   tar -czf attendance-app-backup.tar.gz /path/to/app
   
   # Upload to cloud storage
   aws s3 cp attendance-app-backup.tar.gz s3://your-bucket/
   ```

2. **Restore from backup:**
   ```bash
   tar -xzf attendance-app-backup.tar.gz
   ```

## Security Checklist

- [ ] Use HTTPS/SSL
- [ ] Set secure headers
- [ ] Implement rate limiting
- [ ] Validate all inputs
- [ ] Use environment variables for secrets
- [ ] Keep dependencies updated
- [ ] Enable CORS only for trusted domains
- [ ] Implement authentication
- [ ] Use strong passwords
- [ ] Regular security audits

---

**Last Updated:** June 19, 2024
