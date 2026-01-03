import { Router } from 'express';
import prisma from '../lib/db.js';
import { authenticateToken } from '../middleware/auth.js';
import { searchResearch, isAIConfigured } from '../lib/ai.js';

const router = Router();

router.use(authenticateToken);

router.get('/', async (req, res) => {
    try {
        const userStories = await prisma.story.findMany({
            where: { userId: req.user.id },
            select: { id: true }
        });
        const storyIds = userStories.map(s => s.id);

        const research = await prisma.research.findMany({
            where: {
                OR: [
                    { storyId: { in: storyIds } },
                    { storyId: null }
                ]
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

router.post('/', async (req, res) => {
    try {
        const { query, results, storyId } = req.body;

        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }

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

router.post('/search', async (req, res) => {
    try {
        const { query, storyId } = req.body;

        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }

        if (!isAIConfigured()) {
            return res.status(503).json({ error: 'AI not configured. Add GEMINI_API_KEY to enable search.' });
        }

        const searchResults = await searchResearch(query);

        if (storyId) {
            const story = await prisma.story.findFirst({
                where: { id: storyId, userId: req.user.id }
            });
            if (story) {
                await prisma.research.create({
                    data: {
                        query,
                        results: JSON.stringify(searchResults),
                        storyId
                    }
                });
            }
        }

        res.json(searchResults);
    } catch (error) {
        console.error('AI search error:', error);
        res.status(500).json({ error: 'AI search failed', details: error.message });
    }
});

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
