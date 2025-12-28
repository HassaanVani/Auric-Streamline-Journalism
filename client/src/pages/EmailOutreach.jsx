import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import {
    ArrowLeft,
    Send,
    Sparkles,
    Copy,
    Check,
    Loader,
    User
} from 'lucide-react';

export function EmailOutreach() {
    const api = useApi();
    const [contacts, setContacts] = useState([]);
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedContact, setSelectedContact] = useState(null);
    const [selectedStory, setSelectedStory] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [contactsData, storiesData] = await Promise.all([
                api.get('/contacts'),
                api.get('/stories')
            ]);
            setContacts(contactsData);
            setStories(storiesData);
        } catch (err) {
            console.error('Failed to load:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectContact = (contactId) => {
        const contact = contacts.find(c => c.id === contactId);
        setSelectedContact(contact);
    };

    const handleCopy = () => {
        const emailText = `Subject: ${subject}\n\n${body}`;
        navigator.clipboard.writeText(emailText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleOpenMailClient = () => {
        if (!selectedContact?.email) return;
        const mailtoLink = `mailto:${selectedContact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(mailtoLink);
    };

    if (loading) {
        return (
            <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
                <Loader style={{ width: '24px', height: '24px', color: 'var(--gold)', animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }

    return (
        <div className="page-container">
            <Link to="/contacts" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.8125rem',
                color: 'var(--gold)',
                textDecoration: 'none',
                marginBottom: '2rem'
            }}>
                <ArrowLeft style={{ width: '16px', height: '16px' }} />
                Back to Sources
            </Link>

            <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 className="text-h1" style={{ marginBottom: '0.5rem' }}>Email Outreach</h1>
                    <p className="text-body">Draft outreach emails to your sources.</p>
                </div>
                {/* AI button in header */}
                <Link to="/settings" style={{ textDecoration: 'none' }}>
                    <button className="btn btn-secondary" title="Enable AI email drafting in Settings">
                        <Sparkles style={{ width: '16px', height: '16px', color: 'var(--gold)' }} />
                        AI Draft
                    </button>
                </Link>
            </header>

            {contacts.length === 0 ? (
                <div className="panel" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                    <User style={{ width: '40px', height: '40px', color: 'var(--gold)', margin: '0 auto 1rem' }} />
                    <h2 className="text-h3" style={{ marginBottom: '0.5rem' }}>No contacts yet</h2>
                    <p className="text-body" style={{ maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                        Add contacts to your source list before drafting outreach emails.
                    </p>
                    <Link to="/contacts">
                        <button className="btn btn-primary">
                            Go to Sources
                        </button>
                    </Link>
                </div>
            ) : (
                <div style={{ maxWidth: '700px' }}>
                    {/* Recipient + Story selectors in one row */}
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: 2, minWidth: '200px' }}>
                            <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>To</label>
                            <select
                                value={selectedContact?.id || ''}
                                onChange={(e) => handleSelectContact(e.target.value)}
                                className="input"
                            >
                                <option value="">Select a contact</option>
                                {contacts.map(c => (
                                    <option key={c.id} value={c.id}>
                                        {c.name} {c.email ? `(${c.email})` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div style={{ flex: 1, minWidth: '160px' }}>
                            <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Story</label>
                            <select
                                value={selectedStory}
                                onChange={(e) => setSelectedStory(e.target.value)}
                                className="input"
                            >
                                <option value="">Select a story</option>
                                {stories.map(s => (
                                    <option key={s.id} value={s.id}>{s.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Selected contact info inline */}
                    {selectedContact && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem 1rem',
                            background: 'var(--bg-secondary)',
                            borderRadius: '8px',
                            marginBottom: '1.5rem'
                        }}>
                            <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>
                                {selectedContact.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                                <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{selectedContact.name}</span>
                                {selectedContact.role && (
                                    <span className="text-small" style={{ marginLeft: '0.5rem' }}>
                                        • {selectedContact.role} {selectedContact.org ? `at ${selectedContact.org}` : ''}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Subject */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Subject</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Interview request regarding..."
                            className="input"
                        />
                    </div>

                    {/* Body */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Message</label>
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="Write your email here..."
                            className="input"
                            rows={10}
                            style={{ resize: 'vertical' }}
                        />
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button onClick={handleCopy} className="btn btn-secondary">
                            {copied ? <Check style={{ width: '16px', height: '16px' }} /> : <Copy style={{ width: '16px', height: '16px' }} />}
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                        <button
                            onClick={handleOpenMailClient}
                            disabled={!selectedContact?.email}
                            className="btn btn-primary"
                        >
                            <Send style={{ width: '16px', height: '16px' }} />
                            Open in Mail Client
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EmailOutreach;
