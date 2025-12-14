import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import researchRoutes from './routes/research.js';
import contactsRoutes from './routes/contacts.js';
import emailsRoutes from './routes/emails.js';
import questionsRoutes from './routes/questions.js';
import meetingsRoutes from './routes/meetings.js';
import transcriptsRoutes from './routes/transcripts.js';
import articlesRoutes from './routes/articles.js';
import reviewRoutes from './routes/review.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// API Routes
app.use('/api/research', researchRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/emails', emailsRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api/meetings', meetingsRoutes);
app.use('/api/transcripts', transcriptsRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/review', reviewRoutes);

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
            research: '/api/research',
            contacts: '/api/contacts',
            emails: '/api/emails',
            questions: '/api/questions',
            meetings: '/api/meetings',
            transcripts: '/api/transcripts',
            articles: '/api/articles',
            review: '/api/review',
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
