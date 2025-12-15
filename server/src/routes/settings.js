import { Router } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

// Get user settings
router.get('/', async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                settings: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({ error: 'Failed to get settings' });
    }
});

// Update profile
router.put('/profile', async (req, res) => {
    try {
        const { name, email } = req.body;

        // Check if email is already taken by another user
        if (email) {
            const existing = await prisma.user.findFirst({
                where: {
                    email,
                    NOT: { id: req.user.id }
                }
            });
            if (existing) {
                return res.status(400).json({ error: 'Email already in use' });
            }
        }

        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: {
                ...(name && { name }),
                ...(email && { email })
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true
            }
        });

        res.json(user);
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// Change password
router.put('/password', async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'New password must be at least 6 characters' });
        }

        const user = await prisma.user.findUnique({
            where: { id: req.user.id }
        });

        const validPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: req.user.id },
            data: { password: hashedPassword }
        });

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Failed to change password' });
    }
});

// Update app settings
router.put('/preferences', async (req, res) => {
    try {
        const { theme, notifications } = req.body;

        const settings = await prisma.settings.upsert({
            where: { userId: req.user.id },
            update: {
                ...(theme !== undefined && { theme }),
                ...(notifications !== undefined && { notifications })
            },
            create: {
                userId: req.user.id,
                theme: theme || 'dark',
                notifications: notifications !== undefined ? notifications : true
            }
        });

        res.json(settings);
    } catch (error) {
        console.error('Update preferences error:', error);
        res.status(500).json({ error: 'Failed to update preferences' });
    }
});

export default router;
