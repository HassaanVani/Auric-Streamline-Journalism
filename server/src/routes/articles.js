import express from 'express';
const router = express.Router();

// POST /api/articles/draft - Generate article draft
router.post('/draft', async (req, res) => {
    const { storyId, sources } = req.body;
    await new Promise(resolve => setTimeout(resolve, 2000));

    res.json({
        draftId: `draft_${Date.now()}`,
        title: "California's Bold Climate Agenda: A Deep Dive into Policy Reform",
        content: `California has long positioned itself as a leader in environmental policy...`,
        outline: [
            { section: 'Introduction', status: 'complete' },
            { section: 'Cap-and-Trade Analysis', status: 'complete' },
            { section: 'Community Impact', status: 'in_progress' },
        ],
        wordCount: 1247,
        generatedAt: new Date().toISOString(),
    });
});

// GET /api/articles - Get all articles
router.get('/', (req, res) => {
    res.json({
        articles: [
            { id: 1, title: 'Climate Policy Reform', status: 'draft', progress: 65, lastUpdated: '2024-03-10' },
            { id: 2, title: 'Tech Industry Analysis', status: 'outline', progress: 25, lastUpdated: '2024-03-08' },
        ],
    });
});

// GET /api/articles/:id - Get single article
router.get('/:id', (req, res) => {
    res.json({ id: req.params.id, title: 'Climate Policy Reform', content: '...', status: 'draft' });
});

// PUT /api/articles/:id - Update article
router.put('/:id', (req, res) => {
    res.json({ id: req.params.id, ...req.body, updated: true });
});

// POST /api/articles/:id/regenerate - Regenerate section
router.post('/:id/regenerate', async (req, res) => {
    const { section } = req.body;
    await new Promise(resolve => setTimeout(resolve, 1500));
    res.json({ success: true, section, regeneratedContent: '...' });
});

export default router;
