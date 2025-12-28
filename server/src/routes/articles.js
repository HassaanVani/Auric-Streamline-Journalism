import { Router } from 'express';
import prisma from '../lib/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

// Get all user's articles
router.get('/', async (req, res) => {
    try {
        const articles = await prisma.article.findMany({
            where: {
                story: { userId: req.user.id }
            },
            include: {
                story: { select: { id: true, title: true } }
            },
            orderBy: { updatedAt: 'desc' }
        });
        res.json(articles);
    } catch (error) {
        console.error('Get articles error:', error);
        res.status(500).json({ error: 'Failed to get articles' });
    }
});

// Get single article
router.get('/:id', async (req, res) => {
    try {
        const article = await prisma.article.findFirst({
            where: {
                id: req.params.id,
                story: { userId: req.user.id }
            },
            include: {
                story: { select: { id: true, title: true } }
            }
        });

        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }

        res.json(article);
    } catch (error) {
        console.error('Get article error:', error);
        res.status(500).json({ error: 'Failed to get article' });
    }
});

// Create new article
router.post('/', async (req, res) => {
    try {
        const { title, content, storyId } = req.body;

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

        const article = await prisma.article.create({
            data: {
                title,
                content: content || '',
                storyId
            },
            include: {
                story: { select: { id: true, title: true } }
            }
        });

        res.status(201).json(article);
    } catch (error) {
        console.error('Create article error:', error);
        res.status(500).json({ error: 'Failed to create article' });
    }
});

// Update article
router.put('/:id', async (req, res) => {
    try {
        const { title, content, status } = req.body;

        // Verify ownership
        const existing = await prisma.article.findFirst({
            where: {
                id: req.params.id,
                story: { userId: req.user.id }
            }
        });

        if (!existing) {
            return res.status(404).json({ error: 'Article not found' });
        }

        const article = await prisma.article.update({
            where: { id: req.params.id },
            data: {
                ...(title && { title }),
                ...(content !== undefined && { content }),
                ...(status && { status })
            },
            include: {
                story: { select: { id: true, title: true } }
            }
        });

        res.json(article);
    } catch (error) {
        console.error('Update article error:', error);
        res.status(500).json({ error: 'Failed to update article' });
    }
});

// Delete article
router.delete('/:id', async (req, res) => {
    try {
        const existing = await prisma.article.findFirst({
            where: {
                id: req.params.id,
                story: { userId: req.user.id }
            }
        });

        if (!existing) {
            return res.status(404).json({ error: 'Article not found' });
        }

        await prisma.article.delete({
            where: { id: req.params.id }
        });

        res.json({ message: 'Article deleted' });
    } catch (error) {
        console.error('Delete article error:', error);
        res.status(500).json({ error: 'Failed to delete article' });
    }
});

export default router;
