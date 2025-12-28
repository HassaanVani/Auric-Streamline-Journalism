import { Router } from 'express';
import prisma from '../lib/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

// Get all user's meetings
router.get('/', async (req, res) => {
    try {
        const meetings = await prisma.meeting.findMany({
            where: {
                story: { userId: req.user.id }
            },
            include: {
                story: { select: { id: true, title: true } }
            },
            orderBy: { date: 'desc' }
        });
        res.json(meetings);
    } catch (error) {
        console.error('Get meetings error:', error);
        res.status(500).json({ error: 'Failed to get meetings' });
    }
});

// Create new meeting
router.post('/', async (req, res) => {
    try {
        const { title, date, duration, platform, storyId, contactName, notes } = req.body;

        if (!title || !date || !storyId) {
            return res.status(400).json({ error: 'Title, date, and storyId are required' });
        }

        // Verify story ownership
        const story = await prisma.story.findFirst({
            where: { id: storyId, userId: req.user.id }
        });

        if (!story) {
            return res.status(404).json({ error: 'Story not found' });
        }

        const meeting = await prisma.meeting.create({
            data: {
                title,
                date: new Date(date),
                duration: duration || 30,
                platform: platform || 'zoom',
                storyId,
                contactName,
                notes
            },
            include: {
                story: { select: { id: true, title: true } }
            }
        });

        res.status(201).json(meeting);
    } catch (error) {
        console.error('Create meeting error:', error);
        res.status(500).json({ error: 'Failed to create meeting' });
    }
});

// Update meeting
router.put('/:id', async (req, res) => {
    try {
        const { title, date, duration, platform, status, contactName, notes } = req.body;

        const existing = await prisma.meeting.findFirst({
            where: {
                id: req.params.id,
                story: { userId: req.user.id }
            }
        });

        if (!existing) {
            return res.status(404).json({ error: 'Meeting not found' });
        }

        const meeting = await prisma.meeting.update({
            where: { id: req.params.id },
            data: {
                ...(title && { title }),
                ...(date && { date: new Date(date) }),
                ...(duration && { duration }),
                ...(platform && { platform }),
                ...(status && { status }),
                ...(contactName !== undefined && { contactName }),
                ...(notes !== undefined && { notes })
            },
            include: {
                story: { select: { id: true, title: true } }
            }
        });

        res.json(meeting);
    } catch (error) {
        console.error('Update meeting error:', error);
        res.status(500).json({ error: 'Failed to update meeting' });
    }
});

// Delete meeting
router.delete('/:id', async (req, res) => {
    try {
        const existing = await prisma.meeting.findFirst({
            where: {
                id: req.params.id,
                story: { userId: req.user.id }
            }
        });

        if (!existing) {
            return res.status(404).json({ error: 'Meeting not found' });
        }

        await prisma.meeting.delete({
            where: { id: req.params.id }
        });

        res.json({ message: 'Meeting deleted' });
    } catch (error) {
        console.error('Delete meeting error:', error);
        res.status(500).json({ error: 'Failed to delete meeting' });
    }
});

export default router;
