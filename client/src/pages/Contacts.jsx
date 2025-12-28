import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import {
    Search,
    Plus,
    MapPin,
    ChevronRight,
    Sparkles,
    X,
    AlertCircle,
    Filter,
    Tag
} from 'lucide-react';

export function Contacts() {
    const api = useApi();
    const [contacts, setContacts] = useState([]);
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStory, setFilterStory] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);

    // New contact form
    const [newContact, setNewContact] = useState({ name: '', email: '', role: '', org: '', location: '', expertise: '' });
    const [newContactStories, setNewContactStories] = useState([]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

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

    const handleAddContact = async (e) => {
        e.preventDefault();
        if (!newContact.name.trim()) {
            setError('Name is required');
            return;
        }

        setSaving(true);
        setError('');

        try {
            const created = await api.post('/contacts', newContact);

            // Link to selected stories
            for (const storyId of newContactStories) {
                await api.post(`/contacts/${created.id}/stories`, { storyId });
            }

            // Reload to get updated stories
            const updated = await api.get(`/contacts/${created.id}`);
            setContacts([updated, ...contacts]);
            setNewContact({ name: '', email: '', role: '', org: '', location: '', expertise: '' });
            setNewContactStories([]);
            setShowAddForm(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const toggleStoryForNewContact = (storyId) => {
        if (newContactStories.includes(storyId)) {
            setNewContactStories(newContactStories.filter(id => id !== storyId));
        } else {
            setNewContactStories([...newContactStories, storyId]);
        }
    };

    const filteredContacts = contacts.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.org?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.expertise?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStory = !filterStory || c.stories?.some(s => s.storyId === filterStory);

        return matchesSearch && matchesStory;
    });

    const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    if (loading) {
        return (
            <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
                <p className="text-body">Loading contacts...</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            {/* Header */}
            <header className="page-header">
                <h1 className="text-h1" style={{ marginBottom: '0.5rem' }}>Sources & Contacts</h1>
                <p className="text-body" style={{ maxWidth: '480px' }}>
                    Manage your network of sources, experts, and key contacts.
                </p>
            </header>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '200px', maxWidth: '300px' }}>
                    <Search style={{
                        position: 'absolute',
                        left: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '18px',
                        height: '18px',
                        color: 'var(--text-dim)'
                    }} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search sources..."
                        className="input"
                        style={{ paddingLeft: '3rem' }}
                    />
                </div>

                {/* Story Filter */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Filter style={{ width: '16px', height: '16px', color: 'var(--text-dim)' }} />
                    <select
                        value={filterStory}
                        onChange={(e) => setFilterStory(e.target.value)}
                        className="input"
                        style={{ minWidth: '180px' }}
                    >
                        <option value="">All stories</option>
                        {stories.map(s => (
                            <option key={s.id} value={s.id}>{s.title}</option>
                        ))}
                    </select>
                </div>

                <div style={{ marginLeft: 'auto' }}>
                    <button onClick={() => setShowAddForm(true)} className="btn btn-primary">
                        <Plus style={{ width: '16px', height: '16px' }} />
                        Add Contact
                    </button>
                </div>
            </div>

            {/* Add Contact Form */}
            {showAddForm && (
                <div className="panel" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 className="text-h3">Add New Contact</h2>
                        <button onClick={() => setShowAddForm(false)} className="btn-ghost" style={{ padding: '0.5rem' }}>
                            <X style={{ width: '20px', height: '20px' }} />
                        </button>
                    </div>

                    {error && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', marginBottom: '1rem', background: 'rgba(248, 113, 113, 0.1)', borderRadius: '8px' }}>
                            <AlertCircle style={{ width: '16px', height: '16px', color: 'var(--danger)' }} />
                            <span className="text-small" style={{ color: 'var(--danger)' }}>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleAddContact}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                                <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Name *</label>
                                <input
                                    type="text"
                                    value={newContact.name}
                                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                                    className="input"
                                    placeholder="Full name"
                                />
                            </div>
                            <div>
                                <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
                                <input
                                    type="email"
                                    value={newContact.email}
                                    onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                                    className="input"
                                    placeholder="email@example.com"
                                />
                            </div>
                            <div>
                                <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Role/Title</label>
                                <input
                                    type="text"
                                    value={newContact.role}
                                    onChange={(e) => setNewContact({ ...newContact, role: e.target.value })}
                                    className="input"
                                    placeholder="e.g., Climate Scientist"
                                />
                            </div>
                            <div>
                                <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Organization</label>
                                <input
                                    type="text"
                                    value={newContact.org}
                                    onChange={(e) => setNewContact({ ...newContact, org: e.target.value })}
                                    className="input"
                                    placeholder="e.g., UC Berkeley"
                                />
                            </div>
                            <div>
                                <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Location</label>
                                <input
                                    type="text"
                                    value={newContact.location}
                                    onChange={(e) => setNewContact({ ...newContact, location: e.target.value })}
                                    className="input"
                                    placeholder="e.g., Berkeley, CA"
                                />
                            </div>
                            <div>
                                <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Expertise / Topics</label>
                                <input
                                    type="text"
                                    value={newContact.expertise}
                                    onChange={(e) => setNewContact({ ...newContact, expertise: e.target.value })}
                                    className="input"
                                    placeholder="e.g., Climate Policy, Data Analysis"
                                />
                            </div>
                        </div>

                        {/* Link to Stories */}
                        {stories.length > 0 && (
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label className="text-label" style={{ display: 'block', marginBottom: '0.75rem' }}>
                                    <Tag style={{ width: '14px', height: '14px', display: 'inline', marginRight: '0.5rem' }} />
                                    Link to Stories
                                </label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {stories.map(story => (
                                        <button
                                            key={story.id}
                                            type="button"
                                            onClick={() => toggleStoryForNewContact(story.id)}
                                            className={newContactStories.includes(story.id) ? 'badge badge-gold' : 'badge'}
                                            style={{
                                                cursor: 'pointer',
                                                padding: '0.5rem 1rem',
                                                border: newContactStories.includes(story.id) ? '1px solid var(--gold)' : '1px solid var(--border-subtle)'
                                            }}
                                        >
                                            {story.title}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                            <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-secondary">Cancel</button>
                            <button type="submit" disabled={saving} className="btn btn-primary">
                                {saving ? 'Adding...' : 'Add Contact'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Empty state */}
            {contacts.length === 0 && !showAddForm && (
                <div className="panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <Sparkles style={{ width: '48px', height: '48px', color: 'var(--gold)', margin: '0 auto 1.5rem' }} />
                    <h2 className="text-h2" style={{ marginBottom: '0.75rem' }}>No contacts yet</h2>
                    <p className="text-body" style={{ maxWidth: '400px', margin: '0 auto 2rem' }}>
                        Add your first source or contact to start building your network.
                    </p>
                    <button onClick={() => setShowAddForm(true)} className="btn btn-primary">
                        <Plus style={{ width: '16px', height: '16px' }} />
                        Add Your First Contact
                    </button>
                </div>
            )}

            {/* Contacts List */}
            {filteredContacts.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {filteredContacts.map((contact) => (
                        <Link key={contact.id} to={`/contacts/${contact.id}`} style={{ textDecoration: 'none' }}>
                            <div className="list-item card-interactive">
                                <div className="avatar-lg">{getInitials(contact.name)}</div>

                                <div className="list-item-content">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem', flexWrap: 'wrap' }}>
                                        <span className="list-item-title">{contact.name}</span>
                                        {contact.stories?.map(s => (
                                            <span key={s.storyId} className="badge badge-gold" style={{ fontSize: '0.6875rem' }}>
                                                {s.story?.title}
                                            </span>
                                        ))}
                                    </div>

                                    {(contact.role || contact.org) && (
                                        <p className="text-small" style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                                            {[contact.role, contact.org].filter(Boolean).join(' at ')}
                                        </p>
                                    )}

                                    <div className="list-item-meta">
                                        {contact.location && (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                                <MapPin style={{ width: '14px', height: '14px' }} />
                                                {contact.location}
                                            </span>
                                        )}
                                        {contact.expertise && (
                                            <span className="badge">{contact.expertise}</span>
                                        )}
                                    </div>
                                </div>

                                <ChevronRight style={{ width: '20px', height: '20px', color: 'var(--text-dim)', flexShrink: 0 }} />
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* No results */}
            {contacts.length > 0 && filteredContacts.length === 0 && (
                <div className="panel" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                    <p className="text-body">No contacts match your filters</p>
                    {filterStory && (
                        <button
                            onClick={() => setFilterStory('')}
                            className="btn btn-secondary"
                            style={{ marginTop: '1rem' }}
                        >
                            Clear story filter
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default Contacts;
