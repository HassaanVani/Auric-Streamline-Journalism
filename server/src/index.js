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
import articlesRoutes from './routes/articles.js';
import meetingsRoutes from './routes/meetings.js';
import transcriptsRoutes from './routes/transcripts.js';
import questionsRoutes from './routes/questions.js';
import emailsRoutes from './routes/emails.js';
import reviewRoutes from './routes/review.js';
import calendarRoutes from './routes/calendar.js';
import bookmarksRoutes from './routes/bookmarks.js';

const app = express();
const PORT = process.env.PORT || 3001;
// Middleware - CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
}));
app.options('*', cors()); // Enable pre-flight for all routes explicitly
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
app.use('/api/articles', articlesRoutes);
app.use('/api/meetings', meetingsRoutes);
app.use('/api/transcripts', transcriptsRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api/emails', emailsRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/bookmarks', bookmarksRoutes);

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
// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Auric API server running on port ${PORT}`);
});
