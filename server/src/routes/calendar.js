import { Router } from 'express';
import prisma from '../lib/db.js';
import { authenticateToken } from '../middleware/auth.js';
import {
    getAuthUrl,
    getTokensFromCode,
    listEvents,
    createEvent,
    deleteEvent,
    isCalendarConfigured
} from '../lib/calendar.js';

const router = Router();
router.use(authenticateToken);

router.get('/status', async (req, res) => {
    const configured = isCalendarConfigured();
    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { googleCalendarTokens: true }
    });

    res.json({
        configured,
        connected: !!(user?.googleCalendarTokens)
    });
});

router.get('/connect', (req, res) => {
    if (!isCalendarConfigured()) {
        return res.status(503).json({ error: 'Google Calendar not configured on server' });
    }

    const authUrl = getAuthUrl(req.user.id);
    res.json({ authUrl });
});

router.get('/callback', async (req, res) => {
    const { code, state: userId } = req.query;

    if (!code || !userId) {
        return res.redirect('/settings?calendar=error');
    }

    try {
        const tokens = await getTokensFromCode(code);

        await prisma.user.update({
            where: { id: userId },
            data: { googleCalendarTokens: JSON.stringify(tokens) }
        });

        res.redirect('/settings?calendar=success');
    } catch (error) {
        console.error('Calendar OAuth error:', error);
        res.redirect('/settings?calendar=error');
    }
});

router.post('/disconnect', async (req, res) => {
    try {
        await prisma.user.update({
            where: { id: req.user.id },
            data: { googleCalendarTokens: null }
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to disconnect' });
    }
});

router.get('/events', async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { googleCalendarTokens: true }
        });

        if (!user?.googleCalendarTokens) {
            return res.status(401).json({ error: 'Calendar not connected' });
        }

        const tokens = JSON.parse(user.googleCalendarTokens);
        const events = await listEvents(tokens, req.query.timeMin, req.query.timeMax);

        res.json(events);
    } catch (error) {
        console.error('List events error:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

router.post('/events', async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { googleCalendarTokens: true }
        });

        if (!user?.googleCalendarTokens) {
            return res.status(401).json({ error: 'Calendar not connected' });
        }

        const tokens = JSON.parse(user.googleCalendarTokens);
        const event = await createEvent(tokens, req.body);

        res.json(event);
    } catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({ error: 'Failed to create event' });
    }
});

router.delete('/events/:eventId', async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { googleCalendarTokens: true }
        });

        if (!user?.googleCalendarTokens) {
            return res.status(401).json({ error: 'Calendar not connected' });
        }

        const tokens = JSON.parse(user.googleCalendarTokens);
        await deleteEvent(tokens, req.params.eventId);

        res.json({ success: true });
    } catch (error) {
        console.error('Delete event error:', error);
        res.status(500).json({ error: 'Failed to delete event' });
    }
});

export default router;
