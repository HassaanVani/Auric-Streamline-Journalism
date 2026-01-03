import express from 'express';
import { generateQuestions, isAIConfigured } from '../lib/ai.js';

const router = express.Router();

router.post('/generate', async (req, res) => {
    const { contact, story, researchGaps } = req.body;

    if (!isAIConfigured()) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return res.json({
            questions: [
                { id: 1, category: 'Background', question: "Can you walk me through your experience in this area?", followUp: 'What surprised you most?', priority: 'high' },
                { id: 2, category: 'Analysis', question: 'How would you assess the current situation?', followUp: 'What metrics matter most?', priority: 'high' },
                { id: 3, category: 'Impact', question: 'What have been the most significant impacts?', followUp: 'Any unintended consequences?', priority: 'medium' },
            ],
            generatedAt: new Date().toISOString(),
            aiGenerated: false
        });
    }

    try {
        const questions = await generateQuestions(contact, story, researchGaps);
        res.json({
            questions,
            generatedAt: new Date().toISOString(),
            aiGenerated: true
        });
    } catch (error) {
        console.error('Question generation error:', error);
        res.status(500).json({ error: 'Failed to generate questions', details: error.message });
    }
});

router.post('/save', (req, res) => {
    const { name, questions } = req.body;
    res.json({ success: true, setId: Date.now(), name });
});

router.get('/sets', (req, res) => {
    res.json({ sets: [{ id: 1, name: 'Saved Questions', questionCount: 5 }] });
});

export default router;
