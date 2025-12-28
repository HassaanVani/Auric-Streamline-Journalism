import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.js';
import storiesRoutes from './routes/stories.js';
import contactsRoutes from './routes/contacts.js';
import researchRoutes from './routes/research.js';
import settingsRoutes from './routes/settings.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const allowedOrigins = process.env.CLIENT_URL
    ? [process.env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:3000']
    : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.some(allowed => origin.startsWith(allowed.replace(/\/$/, '')))) {
            return callback(null, true);
        }
        // In production, allow any Netlify subdomain
        if (origin.includes('.netlify.app')) {
            return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));
app.use(express.json());

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/stories', storiesRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/settings', settingsRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        name: 'Auric API',
        version: '1.0.0',
        description: 'AI-powered journalism platform API',
        endpoints: {
            auth: '/api/auth',
            stories: '/api/stories',
            contacts: '/api/contacts',
            research: '/api/research',
            settings: '/api/settings',
        },
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Auric API server running on http://localhost:${PORT}`);
});
