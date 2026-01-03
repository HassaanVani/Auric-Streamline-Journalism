import express from 'express';
import { reviewArticle, factCheck, isAIConfigured } from '../lib/ai.js';

const router = express.Router();

router.post('/suggestions', async (req, res) => {
    const { content } = req.body;

    if (!isAIConfigured()) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return res.json({
            suggestions: [
                { id: 1, type: 'clarity', original: 'Example phrase', suggestion: 'Improved phrase', reason: 'More concise' },
            ],
            readability: { grade: 'B+', readingLevel: '10th Grade', avgSentenceLength: 18, passiveVoice: '8%' },
            aiGenerated: false
        });
    }

    try {
        const result = await reviewArticle(content);
        res.json({ ...result, aiGenerated: true });
    } catch (error) {
        console.error('Review error:', error);
        res.status(500).json({ error: 'Failed to review article', details: error.message });
    }
});

router.post('/fact-check', async (req, res) => {
    const { claims } = req.body;

    if (!isAIConfigured()) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return res.json({
            factChecks: claims?.map(claim => ({ claim, status: 'unverified', source: 'AI not configured' })) || [],
            aiGenerated: false
        });
    }

    try {
        const factChecks = await factCheck(claims);
        res.json({ factChecks, aiGenerated: true });
    } catch (error) {
        console.error('Fact-check error:', error);
        res.status(500).json({ error: 'Failed to fact-check', details: error.message });
    }
});

router.get('/readability', (req, res) => {
    res.json({ grade: 'B+', readingLevel: '10th Grade', avgSentenceLength: 18, passiveVoice: '8%', wordCount: 0 });
});

router.post('/export', (req, res) => {
    const { format, articleId } = req.body;
    res.json({ downloadUrl: `/downloads/article_${articleId}.${format}`, format });
});

export default router;
