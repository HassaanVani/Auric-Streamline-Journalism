import express from 'express';
import { generateQuestions, isAIConfigured } from '../lib/ai.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

router.post('/generate', async (req, res) => {
    const { contact, story, researchGaps } = req.body;

    if (!isAIConfigured()) {
        return res.json({
            questions: [
                { id: 1, category: 'Background', question: "Can you walk me through your experience in this area?", followUp: 'What surprised you most?', priority: 'high' },
                { id: 2, category: 'Analysis', question: 'How would you assess the current situation?', followUp: 'What metrics matter most?', priority: 'high' },
                { id: 3, category: 'Impact', question: 'What have been the most significant impacts?', followUp: 'Any unintended consequences?', priority: 'medium' },
                { id: 4, category: 'Follow-up', question: 'What should I be asking that I haven\'t?', followUp: 'Who else should I talk to?', priority: 'medium' },
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
        res.json({
            questions: [
                { id: 1, category: 'Background', question: "Can you walk me through your experience in this area?", followUp: 'What surprised you most?', priority: 'high' },
                { id: 2, category: 'Analysis', question: 'How would you assess the current situation?', followUp: 'What metrics matter most?', priority: 'high' },
            ],
            generatedAt: new Date().toISOString(),
            aiGenerated: false,
            error: 'AI generation failed, using fallback questions'
        });
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
