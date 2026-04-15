const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { logRequest } = require('./controllers/requestController');
const cronJobs = require('./utils/cronJobs'); // Initialize cron jobs
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
require('dotenv').config();

// Import internal routes
const volcanoesRouter = require('./routes/volcano');
const usersRouter = require('./routes/user');
const eruptionsRouter = require('./routes/eruption');
const afesRouter = require('./routes/afe');
const samplesRouter = require('./routes/sample');
const particlesRouter = require('./routes/particle');
const opinionsRouter = require('./routes/opinion');
const statsRouter = require('./routes/request');
const classifyRouter = require('./routes/classify');
const ssoRouter = require('./routes/sso');
const preprocessingRouter = require('./routes/preprocessing');
const oodRouter = require('./routes/ood');

// Import API routes
const apiRouter = require('./routes/api');

// Create an Express application
const app = express();

// Middleware setup
app.use(cookieParser()); // Parse cookies
// Enable CORS with credentials and expose Authorization header so Swagger UI can "Try it out"
app.use(cors({
  origin: process.env.CORS_ORIGIN || true,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Authorization']
}));
app.use(express.json({ limit: '50mb' })); // Parse JSON bodies with a size limit of 50mb
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // Parse URL-encoded bodies with a size limit of 50mb

// Serve static files with security measures
if (process.env.NODE_ENV !== 'test') {
  // Rate limiting for static images to prevent abuse
  const imageLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // Limit each IP to 500 image requests per 15 minutes
    message: 'Too many image requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/images', imageLimiter);
}

// Add security headers for static files
app.use('/images', (req, res, next) => {
  // Prevent directory listing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Allow cross-origin access for images (needed for API consumers)
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Set cache control for better performance
  res.setHeader('Cache-Control', 'public, max-age=86400'); // 24 hours
  next();
});

app.use('/images', express.static('images', {
  dotfiles: 'deny', // Deny access to dotfiles
  index: false, // Disable directory indexing
  redirect: false, // Disable automatic redirects
})); // Serve static files from the "images" directory

app.use('/uploads', express.static('uploads', {
  dotfiles: 'deny',
  index: false,
  redirect: false,
})); // Serve static files from the "uploads" directory

// ✅ Request logging
app.use(logRequest);

app.use('/api', cors());
// ✅ Rate limiting for API routes only (not internal ones)
if (process.env.NODE_ENV !== 'test') {
  const apiLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 20,
    message: 'Too many requests from this IP, please try again later.',
  });
  app.use('/api', apiLimiter);
}

// ✅ Internal (authenticated) routes
app.use('/volcano', volcanoesRouter);
app.use('/user', usersRouter);
app.use('/eruption', eruptionsRouter);
app.use('/afe', afesRouter);
app.use('/sample', samplesRouter);
app.use('/particle', particlesRouter);
app.use('/opinion', opinionsRouter);
app.use('/stats', statsRouter);
app.use('/classify', classifyRouter);
app.use('/sso', ssoRouter);
app.use('/preprocessing', preprocessingRouter);
app.use('/ood', oodRouter);

// ✅ Public API routes
app.use('/api', apiRouter);


// Serve generated Swagger/OpenAPI JSON and Swagger UI so the front-end can access API docs
const docsPath = path.join(__dirname, 'docs', 'api-documentation.json');
if (fs.existsSync(path.join(__dirname, 'docs'))) {
  // Serve the docs folder statically (so front-end can fetch the JSON directly if needed)
  app.use('/api/docs', express.static(path.join(__dirname, 'docs')));

  // Serve Swagger UI at /api-docs using the combined JSON
  try {
    const swaggerDocument = require(docsPath);
    const swaggerUiOptions = {
      swaggerOptions: {
        supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
        persistAuthorization: true,
        defaultModelsExpandDepth: 1,
      },
      customSiteTitle: 'VolcAshDB API Documentation',
    };
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerUiOptions));
    console.log(`✅ Swagger UI available at /api-docs`);
  } catch (err) {
    console.warn('⚠️ Could not load swagger JSON to serve UI:', err.message);
  }
} else {
  console.warn('⚠️ Swagger docs directory not found; run the docs generator to create docs/api-combined.json');
}

// ✅ Export app immediately (important for test files)
module.exports = app;


// ✅ Start server + DB only if not in test mode
if (process.env.NODE_ENV !== 'test') {
  const port = process.env.PORT || 3000;
  const uri = process.env.ATLAS_URI;

  mongoose.set('strictQuery', false);
  mongoose.connect(uri)
    .then(() => {
      console.log('MongoDB connected successfully');
      app.listen(port, () => {
        console.log(`Server is running on port: ${port}`);
      });
    })
    .catch(err => {
      console.error('MongoDB connection error:', err);
    });
}