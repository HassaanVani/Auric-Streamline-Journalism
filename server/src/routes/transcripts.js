import express from 'express';
const router = express.Router();

// POST /api/transcripts/upload - Upload recording for transcription
router.post('/upload', async (req, res) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    res.json({
        transcriptId: `trans_${Date.now()}`,
        status: 'processing',
        estimatedTime: '5 minutes',
    });
});

// GET /api/transcripts - Get all transcripts
router.get('/', (req, res) => {
    res.json({
        transcripts: [
            { id: 1, title: 'Interview with Dr. Sarah Chen', date: '2024-03-10', duration: '28:45', status: 'complete', highlights: 5 },
            { id: 2, title: 'City Council Briefing', date: '2024-03-08', duration: '42:10', status: 'complete', highlights: 3 },
        ],
    });
});

// GET /api/transcripts/:id - Get single transcript
router.get('/:id', (req, res) => {
    res.json({
        id: req.params.id,
        title: 'Interview with Dr. Sarah Chen',
        segments: [
            { time: '00:00', speaker: 'John Doe', text: 'Good morning, Dr. Chen.', highlighted: false },
            { time: '00:15', speaker: 'Dr. Sarah Chen', text: 'Thank you for having me.', highlighted: false },
            { time: '00:35', speaker: 'Dr. Sarah Chen', text: 'The cap-and-trade program has been remarkably successful...', highlighted: true },
        ],
    });
});

// POST /api/transcripts/:id/highlight - Toggle highlight on segment
router.post('/:id/highlight', (req, res) => {
    const { segmentIndex, highlighted } = req.body;
    res.json({ success: true, segmentIndex, highlighted });
});

// GET /api/transcripts/:id/export - Export transcript
router.get('/:id/export', (req, res) => {
    res.json({ downloadUrl: `/downloads/transcript_${req.params.id}.txt` });
});

export default router;
