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
    const [purpose, setPurpose] = useState('Interview request');
    const [tone, setTone] = useState('professional');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [copied, setCopied] = useState(false);
    const [generating, setGenerating] = useState(false);

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

    const handleGenerateEmail = async () => {
        if (!selectedContact) return;

        setGenerating(true);
        try {
            const result = await api.post('/emails/generate', {
                recipient: {
                    name: selectedContact.name,
                    role: selectedContact.role,
                    affiliation: selectedContact.org
                },
                purpose,
                tone
            });
            setSubject(result.subject || '');
            setBody(result.body || '');
        } catch (err) {
            console.error('Failed to generate:', err);
        } finally {
            setGenerating(false);
        }
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

            <header className="page-header">
                <h1 className="text-h1" style={{ marginBottom: '0.5rem' }}>Email Outreach</h1>
                <p className="text-body">Draft outreach emails to your sources with AI assistance.</p>
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
                            <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Purpose</label>
                            <select
                                value={purpose}
                                onChange={(e) => setPurpose(e.target.value)}
                                className="input"
                            >
                                <option value="Interview request">Interview Request</option>
                                <option value="Cold email">Cold Email (New Source)</option>
                                <option value="Follow-up">Follow-up</option>
                                <option value="Document request">Document Request</option>
                                <option value="Clarification">Clarification</option>
                            </select>
                        </div>
                        <div style={{ flex: 1, minWidth: '120px' }}>
                            <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Tone</label>
                            <select
                                value={tone}
                                onChange={(e) => setTone(e.target.value)}
                                className="input"
                            >
                                <option value="professional">Professional</option>
                                <option value="friendly">Friendly</option>
                                <option value="formal">Formal</option>
                            </select>
                        </div>
                    </div>

                    {selectedContact && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.75rem 1rem',
                            background: 'var(--bg-secondary)',
                            borderRadius: '8px',
                            marginBottom: '1.5rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
                            <button
                                onClick={handleGenerateEmail}
                                disabled={generating}
                                className="btn btn-primary"
                            >
                                {generating ? (
                                    <Loader style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                                ) : (
                                    <Sparkles style={{ width: '16px', height: '16px' }} />
                                )}
                                {generating ? 'Generating...' : 'AI Draft'}
                            </button>
                        </div>
                    )}

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
