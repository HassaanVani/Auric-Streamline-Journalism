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
    Tag,
    Loader,
    UserPlus
} from 'lucide-react';

export function Contacts() {
    const api = useApi();
    const [contacts, setContacts] = useState([]);
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStory, setFilterStory] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [showFindSources, setShowFindSources] = useState(false);
    const [findSourcesTopic, setFindSourcesTopic] = useState('');
    const [findSourcesContext, setFindSourcesContext] = useState('');
    const [findingSources, setFindingSources] = useState(false);
    const [foundSources, setFoundSources] = useState([]);
    const [addingSource, setAddingSource] = useState(null);

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

    const handleFindSources = async () => {
        if (!findSourcesTopic.trim()) return;

        setFindingSources(true);
        setFoundSources([]);
        try {
            const sources = await api.post('/contacts/find-sources', {
                topic: findSourcesTopic.trim(),
                context: findSourcesContext.trim()
            });
            setFoundSources(sources);
        } catch (err) {
            console.error('Find sources failed:', err);
            setError(err.message || 'Failed to find sources');
        } finally {
            setFindingSources(false);
        }
    };

    const handleAddFoundSource = async (source) => {
        setAddingSource(source.name);
        try {
            const created = await api.post('/contacts', {
                name: source.name,
                role: source.role,
                org: source.org,
                expertise: source.relevance
            });
            setContacts([created, ...contacts]);
            setFoundSources(foundSources.filter(s => s.name !== source.name));
        } catch (err) {
            console.error('Add source failed:', err);
        } finally {
            setAddingSource(null);
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

                <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem' }}>
                    <button onClick={() => setShowFindSources(true)} className="btn btn-secondary">
                        <Sparkles style={{ width: '16px', height: '16px' }} />
                        Find Sources
                    </button>
                    <button onClick={() => setShowAddForm(true)} className="btn btn-primary">
                        <Plus style={{ width: '16px', height: '16px' }} />
                        Add Contact
                    </button>
                </div>
            </div>

            {showFindSources && (
                <div className="panel panel-gold" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Sparkles style={{ width: '18px', height: '18px', color: 'var(--gold)' }} />
                            <h2 className="text-h3" style={{ margin: 0 }}>AI Source Finder</h2>
                        </div>
                        <button onClick={() => { setShowFindSources(false); setFoundSources([]); }} className="btn-ghost" style={{ padding: '0.5rem' }}>
                            <X style={{ width: '20px', height: '20px' }} />
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div>
                            <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Topic *</label>
                            <input
                                type="text"
                                value={findSourcesTopic}
                                onChange={(e) => setFindSourcesTopic(e.target.value)}
                                placeholder="e.g., Climate change policy, Local housing crisis"
                                className="input"
                                disabled={findingSources}
                            />
                        </div>
                        <div>
                            <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Context (optional)</label>
                            <input
                                type="text"
                                value={findSourcesContext}
                                onChange={(e) => setFindSourcesContext(e.target.value)}
                                placeholder="Additional context about your investigation"
                                className="input"
                                disabled={findingSources}
                            />
                        </div>
                        <button
                            onClick={handleFindSources}
                            disabled={!findSourcesTopic.trim() || findingSources}
                            className="btn btn-primary"
                            style={{ alignSelf: 'flex-start' }}
                        >
                            {findingSources ? (
                                <>
                                    <Loader style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                                    Finding Sources...
                                </>
                            ) : (
                                <>
                                    <Search style={{ width: '16px', height: '16px' }} />
                                    Find Sources
                                </>
                            )}
                        </button>
                    </div>

                    {foundSources.length > 0 && (
                        <div>
                            <p className="text-label" style={{ marginBottom: '1rem' }}>Found {foundSources.length} potential sources</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {foundSources.map((source, i) => (
                                    <div key={i} className="card" style={{ background: 'var(--bg-tertiary)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                                            <div style={{ flex: 1 }}>
                                                <h4 style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '0.25rem' }}>{source.name}</h4>
                                                <p className="text-small" style={{ marginBottom: '0.5rem' }}>
                                                    {[source.role, source.org].filter(Boolean).join(' at ')}
                                                </p>
                                                <p className="text-small" style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{source.relevance}</p>
                                                {source.approach && (
                                                    <p className="text-small" style={{ color: 'var(--gold)', fontStyle: 'italic' }}>
                                                        💡 {source.approach}
                                                    </p>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => handleAddFoundSource(source)}
                                                disabled={addingSource === source.name}
                                                className="btn btn-primary"
                                                style={{ flexShrink: 0 }}
                                            >
                                                {addingSource === source.name ? (
                                                    <Loader style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} />
                                                ) : (
                                                    <UserPlus style={{ width: '14px', height: '14px' }} />
                                                )}
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

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
