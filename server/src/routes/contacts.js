import { Router } from 'express';
import prisma from '../lib/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

// Get all contacts for current user
router.get('/', async (req, res) => {
    try {
        const contacts = await prisma.contact.findMany({
            where: { userId: req.user.id },
            include: {
                stories: {
                    include: { story: { select: { id: true, title: true } } }
                }
            },
            orderBy: { updatedAt: 'desc' }
        });
        res.json(contacts);
    } catch (error) {
        console.error('Get contacts error:', error);
        res.status(500).json({ error: 'Failed to get contacts' });
    }
});

// Get single contact
router.get('/:id', async (req, res) => {
    try {
        const contact = await prisma.contact.findFirst({
            where: { id: req.params.id, userId: req.user.id },
            include: {
                stories: {
                    include: { story: true }
                }
            }
        });

        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        res.json(contact);
    } catch (error) {
        console.error('Get contact error:', error);
        res.status(500).json({ error: 'Failed to get contact' });
    }
});

// Create contact
router.post('/', async (req, res) => {
    try {
        const { name, email, role, org, location, expertise, notes } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        const contact = await prisma.contact.create({
            data: {
                name,
                email: email || null,
                role: role || null,
                org: org || null,
                location: location || null,
                expertise: expertise || null,
                notes: notes || null,
                userId: req.user.id
            }
        });

        res.status(201).json(contact);
    } catch (error) {
        console.error('Create contact error:', error);
        res.status(500).json({ error: 'Failed to create contact' });
    }
});

// Update contact
router.put('/:id', async (req, res) => {
    try {
        const existing = await prisma.contact.findFirst({
            where: { id: req.params.id, userId: req.user.id }
        });

        if (!existing) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        const { name, email, role, org, location, expertise, notes } = req.body;

        const contact = await prisma.contact.update({
            where: { id: req.params.id },
            data: {
                ...(name && { name }),
                ...(email !== undefined && { email }),
                ...(role !== undefined && { role }),
                ...(org !== undefined && { org }),
                ...(location !== undefined && { location }),
                ...(expertise !== undefined && { expertise }),
                ...(notes !== undefined && { notes })
            }
        });

        res.json(contact);
    } catch (error) {
        console.error('Update contact error:', error);
        res.status(500).json({ error: 'Failed to update contact' });
    }
});

// Delete contact
router.delete('/:id', async (req, res) => {
    try {
        const existing = await prisma.contact.findFirst({
            where: { id: req.params.id, userId: req.user.id }
        });

        if (!existing) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        await prisma.contact.delete({
            where: { id: req.params.id }
        });

        res.json({ message: 'Contact deleted' });
    } catch (error) {
        console.error('Delete contact error:', error);
        res.status(500).json({ error: 'Failed to delete contact' });
    }
});

// Link contact to story
router.post('/:id/stories', async (req, res) => {
    try {
        const { storyId } = req.body;

        // Verify contact ownership
        const contact = await prisma.contact.findFirst({
            where: { id: req.params.id, userId: req.user.id }
        });
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        // Verify story ownership
        const story = await prisma.story.findFirst({
            where: { id: storyId, userId: req.user.id }
        });
        if (!story) {
            return res.status(404).json({ error: 'Story not found' });
        }

        // Create link (ignore if already exists)
        const link = await prisma.storyContact.upsert({
            where: {
                storyId_contactId: { storyId, contactId: req.params.id }
            },
            create: {
                storyId,
                contactId: req.params.id
            },
            update: {},
            include: {
                story: { select: { id: true, title: true } }
            }
        });

        res.status(201).json(link);
    } catch (error) {
        console.error('Link contact error:', error);
        res.status(500).json({ error: 'Failed to link contact' });
    }
});

// Unlink contact from story
router.delete('/:id/stories/:storyId', async (req, res) => {
    try {
        // Verify contact ownership
        const contact = await prisma.contact.findFirst({
            where: { id: req.params.id, userId: req.user.id }
        });
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        await prisma.storyContact.deleteMany({
            where: {
                storyId: req.params.storyId,
                contactId: req.params.id
            }
        });

        res.json({ message: 'Contact unlinked from story' });
    } catch (error) {
        console.error('Unlink contact error:', error);
        res.status(500).json({ error: 'Failed to unlink contact' });
    }
});

export default router;
