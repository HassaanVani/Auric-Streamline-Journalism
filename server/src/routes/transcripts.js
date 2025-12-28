import { Router } from 'express';
import prisma from '../lib/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

// Get all user's transcripts
router.get('/', async (req, res) => {
    try {
        const transcripts = await prisma.transcript.findMany({
            where: {
                story: { userId: req.user.id }
            },
            include: {
                story: { select: { id: true, title: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(transcripts);
    } catch (error) {
        console.error('Get transcripts error:', error);
        res.status(500).json({ error: 'Failed to get transcripts' });
    }
});

// Get single transcript
router.get('/:id', async (req, res) => {
    try {
        const transcript = await prisma.transcript.findFirst({
            where: {
                id: req.params.id,
                story: { userId: req.user.id }
            },
            include: {
                story: { select: { id: true, title: true } }
            }
        });

        if (!transcript) {
            return res.status(404).json({ error: 'Transcript not found' });
        }

        res.json(transcript);
    } catch (error) {
        console.error('Get transcript error:', error);
        res.status(500).json({ error: 'Failed to get transcript' });
    }
});

// Create new transcript
router.post('/', async (req, res) => {
    try {
        const { title, content, duration, storyId, source } = req.body;

        if (!title || !storyId) {
            return res.status(400).json({ error: 'Title and storyId are required' });
        }

        // Verify story ownership
        const story = await prisma.story.findFirst({
            where: { id: storyId, userId: req.user.id }
        });

        if (!story) {
            return res.status(404).json({ error: 'Story not found' });
        }

        const transcript = await prisma.transcript.create({
            data: {
                title,
                content: content || '',
                duration,
                storyId,
                source
            },
            include: {
                story: { select: { id: true, title: true } }
            }
        });

        res.status(201).json(transcript);
    } catch (error) {
        console.error('Create transcript error:', error);
        res.status(500).json({ error: 'Failed to create transcript' });
    }
});

// Update transcript
router.put('/:id', async (req, res) => {
    try {
        const { title, content, duration, source } = req.body;

        const existing = await prisma.transcript.findFirst({
            where: {
                id: req.params.id,
                story: { userId: req.user.id }
            }
        });

        if (!existing) {
            return res.status(404).json({ error: 'Transcript not found' });
        }

        const transcript = await prisma.transcript.update({
            where: { id: req.params.id },
            data: {
                ...(title && { title }),
                ...(content !== undefined && { content }),
                ...(duration !== undefined && { duration }),
                ...(source !== undefined && { source })
            },
            include: {
                story: { select: { id: true, title: true } }
            }
        });

        res.json(transcript);
    } catch (error) {
        console.error('Update transcript error:', error);
        res.status(500).json({ error: 'Failed to update transcript' });
    }
});

// Delete transcript
router.delete('/:id', async (req, res) => {
    try {
        const existing = await prisma.transcript.findFirst({
            where: {
                id: req.params.id,
                story: { userId: req.user.id }
            }
        });

        if (!existing) {
            return res.status(404).json({ error: 'Transcript not found' });
        }

        await prisma.transcript.delete({
            where: { id: req.params.id }
        });

        res.json({ message: 'Transcript deleted' });
    } catch (error) {
        console.error('Delete transcript error:', error);
        res.status(500).json({ error: 'Failed to delete transcript' });
    }
});

export default router;
