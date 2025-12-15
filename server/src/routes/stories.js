import { Router } from 'express';
import prisma from '../lib/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get all stories for current user
router.get('/', async (req, res) => {
    try {
        const stories = await prisma.story.findMany({
            where: { userId: req.user.id },
            include: {
                _count: {
                    select: {
                        contacts: true,
                        research: true,
                        articles: true
                    }
                }
            },
            orderBy: { updatedAt: 'desc' }
        });
        res.json(stories);
    } catch (error) {
        console.error('Get stories error:', error);
        res.status(500).json({ error: 'Failed to get stories' });
    }
});

// Get single story
router.get('/:id', async (req, res) => {
    try {
        const story = await prisma.story.findFirst({
            where: {
                id: req.params.id,
                userId: req.user.id
            },
            include: {
                contacts: {
                    include: { contact: true }
                },
                research: true,
                articles: true,
                meetings: true,
                transcripts: true
            }
        });

        if (!story) {
            return res.status(404).json({ error: 'Story not found' });
        }

        res.json(story);
    } catch (error) {
        console.error('Get story error:', error);
        res.status(500).json({ error: 'Failed to get story' });
    }
});

// Create story
router.post('/', async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const story = await prisma.story.create({
            data: {
                title,
                description: description || '',
                userId: req.user.id
            }
        });

        res.status(201).json(story);
    } catch (error) {
        console.error('Create story error:', error);
        res.status(500).json({ error: 'Failed to create story' });
    }
});

// Update story
router.put('/:id', async (req, res) => {
    try {
        const { title, description, status, progress } = req.body;

        // Verify ownership
        const existing = await prisma.story.findFirst({
            where: { id: req.params.id, userId: req.user.id }
        });

        if (!existing) {
            return res.status(404).json({ error: 'Story not found' });
        }

        const story = await prisma.story.update({
            where: { id: req.params.id },
            data: {
                ...(title && { title }),
                ...(description !== undefined && { description }),
                ...(status && { status }),
                ...(progress !== undefined && { progress })
            }
        });

        res.json(story);
    } catch (error) {
        console.error('Update story error:', error);
        res.status(500).json({ error: 'Failed to update story' });
    }
});

// Delete story
router.delete('/:id', async (req, res) => {
    try {
        // Verify ownership
        const existing = await prisma.story.findFirst({
            where: { id: req.params.id, userId: req.user.id }
        });

        if (!existing) {
            return res.status(404).json({ error: 'Story not found' });
        }

        await prisma.story.delete({
            where: { id: req.params.id }
        });

        res.json({ message: 'Story deleted' });
    } catch (error) {
        console.error('Delete story error:', error);
        res.status(500).json({ error: 'Failed to delete story' });
    }
});

// Add contact to story
router.post('/:id/contacts', async (req, res) => {
    try {
        const { contactId, status } = req.body;

        // Verify story ownership
        const story = await prisma.story.findFirst({
            where: { id: req.params.id, userId: req.user.id }
        });

        if (!story) {
            return res.status(404).json({ error: 'Story not found' });
        }

        const storyContact = await prisma.storyContact.create({
            data: {
                storyId: req.params.id,
                contactId,
                status: status || 'identified'
            },
            include: { contact: true }
        });

        res.status(201).json(storyContact);
    } catch (error) {
        console.error('Add contact to story error:', error);
        res.status(500).json({ error: 'Failed to add contact to story' });
    }
});

export default router;
