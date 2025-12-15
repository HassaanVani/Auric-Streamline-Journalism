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
    Check,
    AlertCircle
} from 'lucide-react';

export function Contacts() {
    const api = useApi();
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);

    // New contact form
    const [newContact, setNewContact] = useState({ name: '', email: '', role: '', org: '', location: '', expertise: '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadContacts();
    }, []);

    const loadContacts = async () => {
        try {
            const data = await api.get('/contacts');
            setContacts(data);
        } catch (err) {
            console.error('Failed to load contacts:', err);
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
            setContacts([created, ...contacts]);
            setNewContact({ name: '', email: '', role: '', org: '', location: '', expertise: '' });
            setShowAddForm(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const filteredContacts = contacts.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.org?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.role?.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
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

                <button onClick={() => setShowAddForm(true)} className="btn btn-primary">
                    <Plus style={{ width: '16px', height: '16px' }} />
                    Add Contact
                </button>
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
                                <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Expertise</label>
                                <input
                                    type="text"
                                    value={newContact.expertise}
                                    onChange={(e) => setNewContact({ ...newContact, expertise: e.target.value })}
                                    className="input"
                                    placeholder="e.g., Climate Policy, Data Analysis"
                                />
                            </div>
                        </div>
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
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem' }}>
                                        <span className="list-item-title">{contact.name}</span>
                                        {contact.stories?.length > 0 && (
                                            <span className="badge badge-gold">{contact.stories.length} stories</span>
                                        )}
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
                    <p className="text-body">No contacts match "{searchQuery}"</p>
                </div>
            )}
        </div>
    );
}

export default Contacts;
