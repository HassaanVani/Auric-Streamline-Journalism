import { Router } from 'express';
import prisma from '../lib/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

// Get user's saved research
router.get('/', async (req, res) => {
    try {
        const research = await prisma.research.findMany({
            where: {
                story: { userId: req.user.id }
            },
            include: {
                story: { select: { id: true, title: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(research);
    } catch (error) {
        console.error('Get research error:', error);
        res.status(500).json({ error: 'Failed to get research' });
    }
});

// Save research item
router.post('/', async (req, res) => {
    try {
        const { query, results, storyId } = req.body;

        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }

        // Verify story ownership if storyId provided
        if (storyId) {
            const story = await prisma.story.findFirst({
                where: { id: storyId, userId: req.user.id }
            });
            if (!story) {
                return res.status(404).json({ error: 'Story not found' });
            }
        }

        const research = await prisma.research.create({
            data: {
                query,
                results: results ? JSON.stringify(results) : null,
                storyId: storyId || null
            }
        });

        res.status(201).json(research);
    } catch (error) {
        console.error('Save research error:', error);
        res.status(500).json({ error: 'Failed to save research' });
    }
});

// Delete research item
router.delete('/:id', async (req, res) => {
    try {
        const research = await prisma.research.findFirst({
            where: { id: req.params.id },
            include: { story: true }
        });

        if (!research || (research.story && research.story.userId !== req.user.id)) {
            return res.status(404).json({ error: 'Research not found' });
        }

        await prisma.research.delete({
            where: { id: req.params.id }
        });

        res.json({ message: 'Research deleted' });
    } catch (error) {
        console.error('Delete research error:', error);
        res.status(500).json({ error: 'Failed to delete research' });
    }
});

export default router;
