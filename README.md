# VolcAshDB_IPGP

Implementation of VolcAshDB in IPGP Virtual Machines

## Overview

VolcAshDB is a comprehensive database for volcanic ash samples and particle analysis, providing:

- **Web Application** - React-based interface for browsing and analyzing volcanic ash samples
- **REST API** - Express.js backend for data management and user authentication
- **STAC API** - OGC-compliant API for geospatial access to particle data
- **ML Classifier** - Python-based particle classification using Vision Transformer models
- **Database** - MongoDB Atlas for storing samples, particles, and metadata

### Key Requirements

| Component | Technology | Version Required |
|-----------|-----------|------------------|
| Node.js | nvm | 20.14.0 |
| Python | uv | 3.12+ |
| MongoDB | Atlas | Latest |
| PM2 | npm global | Latest |

## Project Structure

```
volcashdev/
├── front-end/          # React web application (Port 5002)
├── back-end/           # Express.js REST API (Port 5001)
├── stac-server/        # STAC API server (Port 5004)
├── volcashclassifier/  # Python FastAPI classifier (Port 5003) [submodule]
├── ecosystem.config.js # PM2 configuration for all services
├── logs/               # PM2 log files
└── README.md           # This file
```

## Quick Start

### Prerequisites

- **Node.js 20.14.0** (required for frontend compatibility)
- **nvm** (Node Version Manager) - recommended for managing Node versions
- **Python 3.12+** (required for classifier)
- **uv** (Python package manager for classifier)
- MongoDB Atlas connection (credentials required)
- Git
- PM2 (process manager)

### Installation

1. **Set up Node.js 20.14.0 using nvm:**
   
   ```shell
   # Install nvm if not already installed
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   
   # Restart shell or source nvm
   source ~/.bashrc  # or ~/.zshrc
   
   # Install and use Node.js 20.14.0
   nvm install 20.14.0
   nvm use 20.14.0
   nvm alias default 20.14.0
   
   # Verify version
   node --version  # Should show v20.14.0
   ```

2. **Clone the repository with submodules:**
   ```shell
   git clone --recurse-submodules git@github.com:dbenet-ntu/volcashdev.git
   cd volcashdev
   ```
   
   If you already cloned without submodules:
   ```shell
   git submodule init
   git submodule update
   ```

3. **Install Node.js dependencies for all services:**
   ```shell
   # Backend (Express.js REST API)
   cd back-end && npm install && cd ..
   
   # Frontend (React application)
   cd front-end && npm install && cd ..
   
   # STAC Server (Geospatial API)
   cd stac-server && npm install && cd ..
   ```
   
   **Note:** If you encounter module errors with the frontend, ensure you're using Node.js 20.14.0:
   ```shell
   nvm use 20.14.0
   cd front-end && rm -rf node_modules package-lock.json && npm install
   ```

4. **Install Python dependencies for classifier:**
   
   The classifier uses `uv` for fast, reliable Python package management.
   
   ```shell
   # Install uv (if not already installed)
   curl -LsSf https://astral.sh/uv/install.sh | sh
   source $HOME/.local/bin/env  # Add uv to PATH
   
   # Or add permanently to your shell profile
   echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
   source ~/.bashrc
   
   # Navigate to classifier submodule
   cd volcashclassifier
   
   # Install dependencies using uv (creates .venv automatically)
   uv sync
   
   # Create model symlink if needed (see Classifier Submodule Setup section)
   # ln -s /path/to/model app/model
   
   # Return to root
   cd ..
   ```
   
5. **Install PM2 globally (if not already installed):**
   ```shell
   npm install -g pm2
   ```
   
   **Important:** PM2 must be installed with Node.js 20.14.0:
   ```shell
   nvm use 20.14.0
   npm install -g pm2
   
   # Verify PM2 is available
   pm2 --version
   ```

6. **Configure environment variables:**
   
   **Backend:**
   ```shell
   cd back-end
   cp .env.example .env
   # Edit .env with your MongoDB Atlas credentials
   ```
   
   **STAC Server:**
   ```shell
   cd stac-server
   cp .env.example .env
   # Edit .env with your MongoDB Atlas credentials
   ```
   
   **Frontend:**
   ```shell
   cd front-end
  cp .env.example .env
   ```
   
   **Classifier:**
   ```shell
   cd volcashclassifier
   cat > .env << 'EOF'
   ATLAS_URI=mongodb+srv://{username}:{password}@cluster.mongodb.net/{database}
   ENV=development
   PORT=5003
   SENDER_EMAIL=...@ipgp.fr
   RECEIVER_EMAIL=...@ipgp.fr
   DOI_MODEL=https://doi.org/10.1029/2023GC011224
   EOF
   # Update with your actual MongoDB credentials
   ```

7. **Start all services with PM2:**
   
   ```shell
   # Ensure you're using Node.js 20.14.0
   nvm use 20.14.0
   
   # Start all services at once
   pm2 start ecosystem.config.js
   
   # Or start individual services
   pm2 start ecosystem.config.js --only volcashdb-backend
   pm2 start ecosystem.config.js --only volcashdb-frontend
   pm2 start ecosystem.config.js --only volcashdb-stac
   pm2 start ecosystem.config.js --only volcashdb-classifier
   ```
   
   **Alternative: Manual start (for development):**
   
   Open four separate terminals:
   
   ```shell
   # Terminal 1 - Backend
   cd back-end && npm start
   
   # Terminal 2 - Frontend
   cd front-end && npm start
   
   # Terminal 3 - STAC Server
   cd stac-server && npm run dev
   
   # Terminal 4 - Classifier (from submodule)
   cd volcashclassifier
   uv run -m app.main
   # This runs Flask in development mode on port 5003
   ```

## Services

### Back-end (REST API)

- **Port:** 5001
- **Tech:** Express.js, Mongoose, Keycloak
- **Features:**
  - Sample and particle data management
  - User authentication and authorization
  - Image upload and storage
  - Classification and opinion systems
  - Particle image URLs (FAIR compliant)

**Start server:**
```shell
pm2 start ecosystem.config.js --only volcashdb-backend
# Or manually: cd back-end && npm start
```

**Run tests:**
```shell
cd back-end && npm test
```

### Front-end (React Application)

- **Port:** 5002
- **Tech:** React, Material-UI, Leaflet
- **Features:** 
  - Browse volcanic ash samples
  - View particle images and classifications
  - Interactive map interface
  - User authentication

**Start development server:**
```shell
pm2 start ecosystem.config.js --only volcashdb-frontend
# Or manually: cd front-end && npm start
```

### STAC Server (Geospatial API)

- **Port:** 5004
- **Tech:** Express.js, STAC 1.0.0
- **Features:**
  - OGC-compliant STAC API
  - 22 Collections (natural samples)
  - ~11,808 Items (particles with images)
  - Scientific Extension support
  - Particle-centric architecture

**Start server:**
```shell
pm2 start ecosystem.config.js --only volcashdb-stac
# Or manually: cd stac-server && npm run dev
```

**Run tests:**
```shell
cd stac-server && npm test
```

**Documentation:** See [stac-server/README.md](stac-server/README.md) for detailed STAC API documentation.

### Classifier (Python Flask/FastAPI)

- **Port:** 5003
- **Tech:** Python, Flask, Vision Transformer, PyTorch
- **Features:**
  - Machine learning particle classification
  - Vision transformer model for image analysis
  - RESTful API endpoints
  - Model inference and predictions

**Start server:**
```shell
# Using PM2 (recommended)
pm2 start ecosystem.config.js --only volcashdb-classifier

# Or manually with uv (from submodule directory)
cd volcashclassifier
uv run -m app.main
```

**Documentation:** See [volcashclassifier/README.md](volcashclassifier/README.md) for detailed classifier documentation.

# Setting up local development for VolcAshDB for MacOS

## Install NodeJS

Install NodeJS by entering below commands to terminal

```shell
brew update && brew install node
```

Check if NodeJS and NPM are installed 

```shell
node -v 
npm -v
```

## Setting code base and required data

- Clone VolcAshDB github repo 

    ```shell
    git clone git@github.com:dbenet-ntu/VolcAshDB.git
    ```

- Modify `front-end/src/Constants.js` to set `PROXY` variable. This `PROXY` variable is the address of the back-end of the site.

    ```javascript
    export const PROXY = "http://localhost:5001"
    ```
    
    Notes: On production server, this variable is set differently.

## Install required dependencies

- Install required dependencies for `back-end`

    ```shell
    cd back-end
    npm install
    ```

- Install required dependies for `front-end`
    ```shell
    cd front-end
    npm install
    ```

## Start development server

- Start `back-end` service

    ```shell
    cd back-end 
    npm start
    ```

- Opening a different terminal, start `front-end` development environment

    ```shell
    cd front-end
    npm start
    ```

- (Optional) Start `stac-server` for STAC API access

    ```shell
    cd stac-server
    npm run dev
    ```

## Classifier Submodule Setup

The `volcashclassifier` exists in two locations:

1. **Git Submodule** (`./volcashclassifier/`) - Linked to the GitHub repository for version control
2. **Main Installation** (`/root/volcashclassifier/`) - Working installation with ML models and dependencies

**Why this setup?**

The classifier requires ~7GB of ML models and Python packages. To avoid disk space issues and duplication, the PM2 configuration points to the main installation at `/root/volcashclassifier` where the virtual environment and models are already set up.

**For developers:**

- Use the submodule for tracking code changes: `cd volcashdev/volcashclassifier && git pull`
- Use the main installation for running the service: `cd /root/volcashclassifier && uv run -m app.main`
- Update the submodule reference when new versions are released

**Syncing submodule with main installation:**

```shell
# Pull latest classifier code
cd /root/volcashdev/volcashclassifier
git pull origin main

# Copy updates to main installation (if needed)
rsync -av --exclude='.venv' --exclude='__pycache__' /root/volcashdev/volcashclassifier/ /root/volcashclassifier/

# Update dependencies in main installation
cd /root/volcashclassifier
uv sync
```

## PM2 Process Management

### Managing All Services

```shell
# Start all services
pm2 start ecosystem.config.js

# View status of all services
pm2 status

# View logs (all services)
pm2 logs

# View logs (specific service)
pm2 logs volcashdb-backend
pm2 logs volcashdb-frontend
pm2 logs volcashdb-stac
pm2 logs volcashdb-classifier

# Restart all services
pm2 restart all

# Restart specific service
pm2 restart volcashdb-backend

# Stop all services
pm2 stop all

# Stop specific service
pm2 stop volcashdb-classifier

# Delete all services from PM2
pm2 delete all

# Monitor services in real-time
pm2 monit

# Save PM2 process list (for auto-restart on server reboot)
pm2 save
pm2 startup
```

### Service Health Check

```shell
# Check if all services are running
curl http://localhost:5001/api/volcanoes?limit=1  # Backend
curl http://localhost:5002                         # Frontend (if running dev server)
curl http://localhost:5004/                        # STAC
curl http://localhost:5003/                        # Classifier (Flask app)

# Check PM2 status
pm2 status

# Monitor in real-time
pm2 monit
```

## 🧪 Testing

### Backend Tests

```shell
cd back-end
npm test
```

### STAC Server Tests

```shell
cd stac-server
npm test
```

Expected: 18/18 tests passing for STAC API

### Classifier Tests

```shell
cd volcashclassifier
source venv/bin/activate
pytest
```

## 📚 Documentation

- **Front-end:** React components and UI documentation
- **Back-end:** API endpoints in `back-end/docs/api-documentation.json`
- **STAC Server:** Comprehensive guide in [stac-server/README.md](stac-server/README.md)
  - STAC 1.0.0 API specification
  - Particle-centric architecture details
  - Integration with STAC ecosystem (PySTAC, QGIS, STAC Browser)

## 🌐 Production Deployment

### URLs

- **Front-end:** `https://volcashdb.ipgp.fr`
- **Backend API:** `https://volcashdb.ipgp.fr/api`
- **STAC API:** `https://volcashdb.ipgp.fr/stac`
- **Classifier API:** `https://volcashdb.ipgp.fr/classifier`
- **Swagger Docs:** `https://volcashdb.ipgp.fr/api-docs`
- **Static Images:** `https://volcashdb.ipgp.fr/images/`

### Production Setup Steps

**1. Prerequisites:**
```shell
# Ensure Node.js 20.14.0 is installed
nvm install 20.14.0
nvm use 20.14.0
nvm alias default 20.14.0

# Install PM2 globally
npm install -g pm2

# Install uv for Python classifier
curl -LsSf https://astral.sh/uv/install.sh | sh
source $HOME/.local/bin/env
```

**2. Clone repository with submodules:**
```shell
cd /root
git clone --recurse-submodules git@github.com:dbenet-ntu/VolcAshDB_IPGP.git
cd VolcAshDB_IPGP

# If already cloned, initialize submodules:
git submodule init
git submodule update
```

**3. Install dependencies:**
```shell
# Backend dependencies
cd back-end && npm install && cd ..

# Frontend dependencies
cd front-end && npm install && cd ..

# STAC server dependencies
cd stac-server && npm install && cd ..

# Classifier dependencies (if using separate installation)
# See "Classifier Setup" section below
```

**4. Build frontend for production:**
```shell
cd front-end
npm run build
cd ..
```

**5. Configure environment variables:**

Create `.env` files for each service with production credentials. Example for classifier:

```shell
cd volcashclassifier
cat > .env << 'EOF'
ATLAS_URI=mongodb+srv://username:password@cluster.mongodb.net/VolcAshDB?retryWrites=true&w=majority
ENV=production
PORT=5003
SENDER_EMAIL=volcashdb@ipgp.fr
RECEIVER_EMAIL=admin@ipgp.fr
DOI_MODEL=https://doi.org/10.1029/2023GC011224
EOF
cd ..
```

**6. Start services with PM2:**
```shell
# Start all services
pm2 start ecosystem.config.js

# Save PM2 process list for auto-restart on reboot
pm2 save

# Set up PM2 to start on system boot
pm2 startup systemd -u root --hp /root
# Copy and execute the command it outputs
```

**7. Configure nginx (see Nginx Configuration section below)**

### Classifier Setup (Production)

The classifier requires ~1GB of ML model files. For production, use a separate installation:

```shell
# Create main classifier installation (outside git repository)
cd /root
git clone https://github.com/kmigadel-ipgp/volcashclassifier.git
cd volcashclassifier

# Install dependencies with uv
uv sync

# Configure environment
cp .env.example .env
# Edit .env with production MongoDB URI including database name and parameters:
# ATLAS_URI=mongodb+srv://user:pass@cluster.mongodb.net/VolcAshDB?retryWrites=true&w=majority

# Verify model files exist in app/model/ directory
ls -lh app/model/
# Should show pytorch_model.bin (~343MB) and optimizer.pt (~686MB)
```

The `ecosystem.config.js` is configured to use `/root/volcashclassifier` as the working directory for the classifier service, avoiding duplication of the large model files.

### Deployment with PM2

**Start all services:**
```shell
cd /root/VolcAshDB_IPGP
pm2 start ecosystem.config.js
pm2 save
```

**Verify services are running:**
```shell
pm2 list
# Should show 4 services: volcashdb-backend, volcashdb-frontend, 
# volcashdb-stac, volcashdb-classifier all with status "online"

# Test endpoints
curl -k https://volcashdb.ipgp.fr/api/volcanoes?limit=1
curl -k https://volcashdb.ipgp.fr/stac/
curl -k https://volcashdb.ipgp.fr/
```

**Individual service management:**
```shell
# Restart specific service
pm2 restart volcashdb-backend
pm2 restart volcashdb-frontend
pm2 restart volcashdb-stac
pm2 restart volcashdb-classifier

# View logs
pm2 logs volcashdb-backend --lines 50
pm2 logs volcashdb-classifier --lines 50

# Reload all (zero-downtime for Node.js apps)
pm2 reload all
```

### Nginx Configuration (Production)

Production nginx configuration at `/etc/nginx/sites-available/volcashdb_prod.conf`:

```nginx
# Upstream servers
upstream backend {
    server localhost:5001;
}

upstream frontend {
    server localhost:5002;
}

upstream stac {
    server localhost:5004;
}

upstream classifier {
    server localhost:5003;
}

# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name volcashdb.ipgp.fr;
    return 301 https://$server_name$request_uri;
}

# Main HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name volcashdb.ipgp.fr;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/volcashdb.ipgp.fr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/volcashdb.ipgp.fr/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Logging
    access_log /var/log/nginx/volcashdb_access.log;
    error_log /var/log/nginx/volcashdb_error.log;

    # Max upload size for particle images
    client_max_body_size 50M;

    # Static particle images (FAIR compliant URLs)
    location /images/ {
        alias /root/VolcAshDB_IPGP/back-end/images/;
        expires 7d;
        add_header Cache-Control "public, immutable";
        add_header Access-Control-Allow-Origin *;
    }

    # Backend REST API
    location /api/ {
        proxy_pass http://backend/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # STAC Geospatial API
    location /stac/ {
        proxy_pass http://stac/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # ML Classifier API
    location /classifier/ {
        proxy_pass http://classifier/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300s;  # Classifier may take time for ML inference
    }

    # Swagger API Documentation
    location /api-docs {
        proxy_pass http://backend/api-docs;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Internal routes (volcano, eruption, afe, sample, particle details)
    location /back-end/ {
        proxy_pass http://back-end;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Frontend React application (catch-all)
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Enable configuration and restart nginx:**
```shell
# Test configuration
sudo nginx -t

# Enable site (if not already)
sudo ln -sf /etc/nginx/sites-available/volcashdb_prod.conf /etc/nginx/sites-enabled/

# Restart nginx
sudo systemctl restart nginx

# Verify nginx status
sudo systemctl status nginx
```

### Backend Configuration for HTTPS

The backend requires trust proxy configuration for proper HTTPS URL generation. In `back-end/server.js`:

```javascript
// Trust proxy (behind nginx)
app.set('trust proxy', true);
```

And in `back-end/controllers/api/particleController.js`, protocol detection:

```javascript
// Detect protocol from X-Forwarded-Proto header or default to HTTPS
const protocol = req.get('x-forwarded-proto') || req.protocol || 'https';
```

This ensures particle image URLs are generated with HTTPS protocol.

### PM2 Ecosystem Configuration

The production `ecosystem.config.js` uses the following settings:

```javascript
module.exports = {
  apps: [
    {
      name: 'volcashdb-backend',
      script: 'server.js',
      cwd: './back-end',
      instances: 1,
      exec_mode: 'fork',
      env: { NODE_ENV: 'production', PORT: 5001 }
    },
    {
      name: 'volcashdb-frontend',
      script: 'npx',
      args: 'serve -s build -l 5002',
      cwd: './front-end',
      instances: 1,
      exec_mode: 'fork'
    },
    {
      name: 'volcashdb-stac',
      script: 'server.js',
      cwd: './stac-server',
      instances: 1,
      exec_mode: 'fork',
      env: { NODE_ENV: 'production', PORT: 5004 }
    },
    {
      name: 'volcashdb-classifier',
      script: 'uv',
      args: 'run -m app.main',
      cwd: '/root/volcashclassifier',  // Separate installation with models
      interpreter: 'none',
      instances: 1,
      exec_mode: 'fork',
      env: { PORT: 5003 }
    }
  ]
};
```

Key points:
- Frontend uses `npx serve` to serve the production build (not dev server)
- Classifier points to `/root/volcashclassifier` for ML model files
- All services use fork mode with single instance
- Logs are written to separate error/output files

### Docker Deployment

```shell
# Build and run all services
docker-compose up -d
```

## 🔗 Useful Links

- **STAC Specification:** https://stacspec.org/
- **MongoDB Atlas:** https://cloud.mongodb.com/
- **React Documentation:** https://react.dev/
- **Express.js:** https://expressjs.com/

## 📝 License

- **Database:** ODbL-1.0 + CC-BY-4.0
- **Code:** MIT

## 👥 Authors

VolcAshDB Team - IPGP, EOS, NTU

## 🆘 Troubleshooting

### Frontend won't start

**Node.js version issues (SyntaxError: does not provide an export named 'constants'):**

This error indicates you're using an incompatible Node.js version. The frontend requires Node.js 20.14.0.

```shell
# Switch to correct Node version
nvm use 20.14.0

# Verify version
node --version  # Must show v20.14.0

# Clean and reinstall dependencies
cd front-end
rm -rf node_modules package-lock.json
npm install

# Restart the service
pm2 restart volcashdb-frontend
```

**Port already in use:**
```shell
# Check if port 5002 is already in use
lsof -i :5002
# Kill process if needed
kill -9 <PID>
```

**Other issues:**
- Clear npm cache: `npm cache clean --force`
- Check PM2 logs: `pm2 logs volcashdb-frontend`

### Backend connection issues

- Verify MongoDB Atlas credentials in `.env`
- Check network connectivity to MongoDB Atlas
- Ensure IP whitelist in MongoDB Atlas includes your IP

### STAC Server issues

**Module not found errors:**
```shell
# Ensure Node.js 20.14.0 is being used
nvm use 20.14.0

# Reinstall dependencies
cd stac-server
rm -rf node_modules package-lock.json
npm install

# Restart service
pm2 restart volcashdb-stac
```

**Database issues:**
- Run index creation: `node scripts/create-indexes.js`
- Verify MongoDB connection in `.env`
- Check logs: `pm2 logs volcashdb-stac`

### Classifier (Python) issues

**uv not found:**
```shell
# Install uv
curl -LsSf https://astral.sh/uv/install.sh | sh
source $HOME/.local/bin/env

# Add to your shell profile for persistence
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

**Python version errors:**
```shell
# Ensure Python 3.12+ is installed (required for classifier)
python3 --version

# Recreate virtual environment if needed
cd /root/volcashclassifier  # Or volcashdev/volcashclassifier
rm -rf .venv
uv sync
```

**Disk space issues:**
```shell
# Clean uv cache
rm -rf ~/.cache/uv

# Check disk usage
df -h /root

# The classifier requires ~1GB for ML models and ~500MB for dependencies
# Use symlinks for the model directory if needed to save space
```

**Port already in use:**
```shell
# Check what's using port 5003
lsof -i :5003
# Kill process if needed
kill -9 <PID>
```

**PM2 shows classifier in error state:**
```shell
# Check detailed logs
pm2 logs volcashdb-classifier --lines 50

# Restart classifier
pm2 restart volcashdb-classifier

# If Python path issues, update ecosystem.config.js with full path:
# script: '/usr/bin/python3'
```

### Git submodule issues

**Submodule not initialized:**
```shell
git submodule init
git submodule update
```

**Update classifier submodule to latest:**
```shell
cd volcashclassifier
git pull origin main
cd ..
git add volcashclassifier
git commit -m "Update classifier submodule"
```

### File watcher limit (Linux)

If you get "ENOSPC: System limit for number of file watchers reached":

```shell
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```