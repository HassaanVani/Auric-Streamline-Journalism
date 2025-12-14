import express from 'express';
const router = express.Router();

const sampleContacts = [
    { id: 1, name: 'Dr. Sarah Chen', title: 'Climate Scientist', organization: 'UC Berkeley', email: 'sarah.chen@berkeley.edu', relevance: 95, expertise: ['Climate Policy', 'Environmental Science'] },
    { id: 2, name: 'Mayor James Wilson', title: 'City Mayor', organization: 'City of Oakland', email: 'mayor@oakland.gov', relevance: 88, expertise: ['Local Government', 'Urban Policy'] },
];

// POST /api/contacts/discover - AI-powered contact discovery
router.post('/discover', async (req, res) => {
    const { topic, location, expertise } = req.body;
    await new Promise(resolve => setTimeout(resolve, 1000));
    res.json({ contacts: sampleContacts, totalFound: sampleContacts.length });
});

// GET /api/contacts - Get all contacts
router.get('/', (req, res) => {
    res.json({ contacts: sampleContacts });
});

// GET /api/contacts/:id - Get single contact
router.get('/:id', (req, res) => {
    const contact = sampleContacts.find(c => c.id === parseInt(req.params.id));
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    res.json(contact);
});

// POST /api/contacts - Create contact
router.post('/', (req, res) => {
    const newContact = { id: Date.now(), ...req.body };
    res.status(201).json(newContact);
});

// PUT /api/contacts/:id - Update contact
router.put('/:id', (req, res) => {
    res.json({ id: req.params.id, ...req.body, updated: true });
});

// POST /api/contacts/:id/notes - Add note to contact
router.post('/:id/notes', (req, res) => {
    res.json({ success: true, noteId: Date.now(), contactId: req.params.id });
});

export default router;
