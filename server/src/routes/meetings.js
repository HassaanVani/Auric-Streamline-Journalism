import express from 'express';
const router = express.Router();

// POST /api/meetings/schedule - Schedule a meeting
router.post('/schedule', async (req, res) => {
    const { contactId, date, time, duration, platform } = req.body;
    res.json({
        meetingId: `meet_${Date.now()}`,
        link: platform === 'zoom' ? 'https://zoom.us/j/123456789' : 'https://meet.google.com/abc-defg-hij',
        status: 'scheduled',
        date, time, duration,
    });
});

// GET /api/meetings - Get all meetings
router.get('/', (req, res) => {
    res.json({
        upcoming: [
            { id: 1, title: 'Interview with Dr. Sarah Chen', date: '2024-03-15', time: '10:00 AM', platform: 'zoom', status: 'confirmed' },
        ],
        past: [
            { id: 101, title: 'Initial Research Discussion', date: '2024-03-10', hasRecording: true, hasTranscript: true },
        ],
    });
});

// GET /api/meetings/:id - Get single meeting
router.get('/:id', (req, res) => {
    res.json({ id: req.params.id, title: 'Interview with Dr. Sarah Chen', date: '2024-03-15', time: '10:00 AM' });
});

// PUT /api/meetings/:id - Update meeting
router.put('/:id', (req, res) => {
    res.json({ id: req.params.id, ...req.body, updated: true });
});

// DELETE /api/meetings/:id - Cancel meeting
router.delete('/:id', (req, res) => {
    res.json({ success: true, cancelled: true });
});

export default router;
