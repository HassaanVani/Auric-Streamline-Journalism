import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { email: rawEmail, password, name } = req.body;

        if (!rawEmail || !password || !name) {
            return res.status(400).json({ error: 'Email, password, and name are required' });
        }

        // Normalize email to lowercase
        const email = rawEmail.toLowerCase().trim();

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                settings: {
                    create: {} // Create default settings
                }
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true
            }
        });

        // Generate token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({ user, token });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Failed to create account' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email: rawEmail, password } = req.body;

        if (!rawEmail || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Normalize email to lowercase
        const email = rawEmail.toLowerCase().trim();

        // Find user - try lowercase first, then case-insensitive search for legacy accounts
        let user = await prisma.user.findUnique({ where: { email } });

        // If not found, search case-insensitively (for accounts created before normalization)
        if (!user) {
            user = await prisma.user.findFirst({
                where: {
                    email: {
                        equals: email,
                        mode: 'insensitive'
                    }
                }
            });
        }

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                createdAt: user.createdAt
            },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
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
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to get user' });
    }
});

export default router;
