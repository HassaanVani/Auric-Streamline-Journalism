import express from 'express';
import { generateEmail, isAIConfigured } from '../lib/ai.js';

const router = express.Router();

router.post('/generate', async (req, res) => {
    const { recipient, purpose, tone, senderName } = req.body;

    if (!isAIConfigured()) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return res.json({
            subject: 'Interview Request',
            body: `Dear ${recipient?.name || 'Contact'},\n\nI hope this message finds you well. I'm a journalist working on a story and would greatly appreciate the opportunity to speak with you.\n\nWould you be available for a brief interview?\n\nBest regards`,
            tone,
            generatedAt: new Date().toISOString(),
            aiGenerated: false
        });
    }

    try {
        const email = await generateEmail(recipient, purpose, tone, senderName);
        res.json({
            ...email,
            tone,
            generatedAt: new Date().toISOString(),
            aiGenerated: true
        });
    } catch (error) {
        console.error('Email generation error:', error);
        res.status(500).json({ error: 'Failed to generate email', details: error.message });
    }
});

router.post('/send', async (req, res) => {
    const { to, subject, body } = req.body;
    await new Promise(resolve => setTimeout(resolve, 500));
    res.json({ success: true, messageId: `msg_${Date.now()}`, sentAt: new Date().toISOString() });
});

router.get('/drafts', (req, res) => {
    res.json({ drafts: [] });
});

router.get('/sent', (req, res) => {
    res.json({ sent: [] });
});

export default router;
