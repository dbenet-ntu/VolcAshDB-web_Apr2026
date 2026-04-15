/**
 * PM2 Ecosystem Configuration for VolcAshDB
 * 
 * This file manages all services:
 * - Back-end (Express.js REST API)
 * - Front-end (React dev server)
 * - STAC Server (Geospatial API)
 * - Classifier (Python FastAPI service)
 * 
 * Usage:
 *   pm2 start ecosystem.config.js           # Start all services
 *   pm2 start ecosystem.config.js --only back-end  # Start specific service
 *   pm2 stop all                            # Stop all services
 *   pm2 restart all                         # Restart all services
 *   pm2 logs                                # View logs
 */

module.exports = {
  apps: [
    {
      name: 'volcashdb-backend',
      cwd: './back-end',
      script: 'server.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      env: {
        NODE_ENV: 'development',
        PORT: 5001
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5001
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s'
    },
    {
      name: 'volcashdb-frontend',
      cwd: './front-end',
      script: 'npx',
      args: 'serve -s build -l 5002',
      interpreter: 'none',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 5002
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5002
      },
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s'
    },
    {
      name: 'volcashdb-stac',
      cwd: './stac-server',
      script: 'server.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      env: {
        NODE_ENV: 'development',
        PORT: 5004
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5004
      },
      error_file: './logs/stac-error.log',
      out_file: './logs/stac-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s'
    },
    {
      name: 'volcashdb-classifier',
      cwd: './volcashclassifier',  // Use submodule within volcashdev
      script: '/root/.local/bin/uv',
      args: 'run -m app.main',
      interpreter: 'none',  // Don't use Node.js interpreter
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      env: {
        PYTHONUNBUFFERED: '1',
        PORT: 5003,
        DOI_MODEL: 'https://doi.org/10.1029/2023GC011224'  // Model DOI for citation
      },
      error_file: './logs/classifier-error.log',
      out_file: './logs/classifier-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ]
};
