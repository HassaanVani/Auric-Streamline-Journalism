import { Router } from 'express';
import prisma from '../lib/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.get('/', async (req, res) => {
    try {
        const bookmarks = await prisma.bookmark.findMany({
            where: { userId: req.user.id },
            include: {
                story: { select: { id: true, title: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(bookmarks);
    } catch (error) {
        console.error('Get bookmarks error:', error);
        res.status(500).json({ error: 'Failed to get bookmarks' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { url, title, quote, storyId } = req.body;

        if (!url || !title) {
            return res.status(400).json({ error: 'URL and title are required' });
        }

        if (storyId) {
            const story = await prisma.story.findFirst({
                where: { id: storyId, userId: req.user.id }
            });
            if (!story) {
                return res.status(404).json({ error: 'Story not found' });
            }
        }

        const bookmark = await prisma.bookmark.create({
            data: {
                url,
                title,
                quote: quote || null,
                storyId: storyId || null,
                userId: req.user.id
            },
            include: {
                story: { select: { id: true, title: true } }
            }
        });

        res.status(201).json(bookmark);
    } catch (error) {
        console.error('Create bookmark error:', error);
        res.status(500).json({ error: 'Failed to create bookmark' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const bookmark = await prisma.bookmark.findFirst({
            where: { id: req.params.id, userId: req.user.id }
        });

        if (!bookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }

        await prisma.bookmark.delete({
            where: { id: req.params.id }
        });

        res.json({ message: 'Bookmark deleted' });
    } catch (error) {
        console.error('Delete bookmark error:', error);
        res.status(500).json({ error: 'Failed to delete bookmark' });
    }
});

export default router;
