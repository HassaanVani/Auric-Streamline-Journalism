import express from 'express';
const router = express.Router();

// POST /api/emails/generate - Generate outreach email
router.post('/generate', async (req, res) => {
    const { recipientId, purpose, tone } = req.body;
    await new Promise(resolve => setTimeout(resolve, 1500));

    res.json({
        subject: 'Interview Request: California Climate Policy Feature',
        body: `Dear Dr. Chen,\n\nI hope this message finds you well. My name is John Doe, and I'm a journalist working on a feature story about California's evolving climate policy landscape.\n\nYour research on cap-and-trade systems has been invaluable to my understanding. Would you be available for a brief 20-30 minute interview?\n\nBest regards,\nJohn Doe`,
        tone,
        generatedAt: new Date().toISOString(),
    });
});

// POST /api/emails/send - Send email
router.post('/send', async (req, res) => {
    const { to, subject, body } = req.body;
    await new Promise(resolve => setTimeout(resolve, 500));
    res.json({ success: true, messageId: `msg_${Date.now()}`, sentAt: new Date().toISOString() });
});

// GET /api/emails/drafts - Get email drafts
router.get('/drafts', (req, res) => {
    res.json({ drafts: [{ id: 1, to: 'sarah.chen@berkeley.edu', subject: 'Interview Request', createdAt: '2024-03-10' }] });
});

// GET /api/emails/sent - Get sent emails
router.get('/sent', (req, res) => {
    res.json({ sent: [{ id: 1, to: 'mayor@oakland.gov', subject: 'Follow-up Interview', sentAt: '2024-03-08' }] });
});

export default router;
