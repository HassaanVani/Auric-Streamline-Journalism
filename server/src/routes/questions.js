import express from 'express';
const router = express.Router();

// POST /api/questions/generate - Generate interview questions
router.post('/generate', async (req, res) => {
    const { contactId, storyId, researchGaps } = req.body;
    await new Promise(resolve => setTimeout(resolve, 1500));

    res.json({
        questions: [
            { id: 1, category: 'Background', question: "Can you walk me through your research on California's cap-and-trade system?", followUp: 'What surprised you most?', priority: 'high' },
            { id: 2, category: 'Analysis', question: 'How would you assess the effectiveness of AB 32?', followUp: 'What metrics matter most?', priority: 'high' },
            { id: 3, category: 'Impact', question: 'What have been the most significant impacts on communities?', followUp: 'Any unintended consequences?', priority: 'medium' },
        ],
        generatedAt: new Date().toISOString(),
    });
});

// POST /api/questions/save - Save question set
router.post('/save', (req, res) => {
    const { name, questions } = req.body;
    res.json({ success: true, setId: Date.now(), name });
});

// GET /api/questions/sets - Get saved question sets
router.get('/sets', (req, res) => {
    res.json({ sets: [{ id: 1, name: 'Climate Expert Questions', questionCount: 5 }] });
});

export default router;
