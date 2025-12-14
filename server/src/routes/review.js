import express from 'express';
const router = express.Router();

// POST /api/review/suggestions - Get style suggestions
router.post('/suggestions', async (req, res) => {
    const { content } = req.body;
    await new Promise(resolve => setTimeout(resolve, 1000));

    res.json({
        suggestions: [
            { id: 1, type: 'clarity', original: 'implemented in a manner that is quite effective', suggestion: 'effectively implemented', reason: 'More concise' },
            { id: 2, type: 'tone', original: 'Officials claim', suggestion: 'Officials report', reason: 'More neutral' },
            { id: 3, type: 'grammar', original: 'data shows that emissions has', suggestion: 'data show that emissions have', reason: 'Subject-verb agreement' },
        ],
        readability: { grade: 'B+', readingLevel: '10th Grade', avgSentenceLength: 18, passiveVoice: '8%' },
    });
});

// POST /api/review/fact-check - Check facts in article
router.post('/fact-check', async (req, res) => {
    const { claims } = req.body;
    await new Promise(resolve => setTimeout(resolve, 1500));

    res.json({
        factChecks: [
            { claim: '20% reduction in emissions since 2013', status: 'verified', source: 'CARB 2023 Report' },
            { claim: '$15 billion in revenue', status: 'needs_review', source: 'Pending verification' },
        ],
    });
});

// GET /api/review/readability - Get readability metrics
router.get('/readability', (req, res) => {
    res.json({ grade: 'B+', readingLevel: '10th Grade', avgSentenceLength: 18, passiveVoice: '8%', wordCount: 1247 });
});

// POST /api/review/export - Export final article
router.post('/export', (req, res) => {
    const { format, articleId } = req.body;
    res.json({ downloadUrl: `/downloads/article_${articleId}.${format}`, format });
});

export default router;
