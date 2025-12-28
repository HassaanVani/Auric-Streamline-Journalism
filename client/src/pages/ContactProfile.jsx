import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import {
    ArrowLeft,
    Mail,
    MapPin,
    Calendar,
    Edit,
    Save,
    Trash2,
    Loader,
    X
} from 'lucide-react';

export function ContactProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const api = useApi();

    const [contact, setContact] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        name: '',
        email: '',
        role: '',
        org: '',
        location: '',
        expertise: '',
        notes: ''
    });

    useEffect(() => {
        loadContact();
    }, [id]);

    const loadContact = async () => {
        try {
            const data = await api.get(`/contacts/${id}`);
            setContact(data);
            setForm({
                name: data.name || '',
                email: data.email || '',
                role: data.role || '',
                org: data.org || '',
                location: data.location || '',
                expertise: data.expertise || '',
                notes: data.notes || ''
            });
        } catch (err) {
            console.error('Failed to load contact:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const updated = await api.put(`/contacts/${id}`, form);
            setContact(updated);
            setEditing(false);
        } catch (err) {
            console.error('Failed to save:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Delete this contact?')) return;

        try {
            await api.del(`/contacts/${id}`);
            navigate('/contacts');
        } catch (err) {
            console.error('Failed to delete:', err);
        }
    };

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    if (loading) {
        return (
            <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
                <Loader style={{ width: '24px', height: '24px', color: 'var(--gold)', animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }

    if (!contact) {
        return (
            <div className="page-container">
                <Link to="/contacts" className="text-gold" style={{ textDecoration: 'none' }}>
                    ← Back to Sources
                </Link>
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <p className="text-body">Contact not found</p>
                </div>
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

            {/* Header Card */}
            <div className="panel" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <div className="avatar-xl">{getInitials(contact.name)}</div>
                        <div>
                            {editing ? (
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="input"
                                    style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}
                                />
                            ) : (
                                <h1 className="text-h2" style={{ marginBottom: '0.5rem' }}>{contact.name}</h1>
                            )}

                            {editing ? (
                                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                    <input
                                        type="text"
                                        value={form.role}
                                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                                        placeholder="Role/Title"
                                        className="input"
                                        style={{ width: '180px' }}
                                    />
                                    <input
                                        type="text"
                                        value={form.org}
                                        onChange={(e) => setForm({ ...form, org: e.target.value })}
                                        placeholder="Organization"
                                        className="input"
                                        style={{ width: '180px' }}
                                    />
                                </div>
                            ) : (
                                <p className="text-body" style={{ marginBottom: '0.75rem' }}>
                                    {[contact.role, contact.org].filter(Boolean).join(' at ') || 'No title'}
                                </p>
                            )}

                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                                {editing ? (
                                    <>
                                        <input
                                            type="text"
                                            value={form.location}
                                            onChange={(e) => setForm({ ...form, location: e.target.value })}
                                            placeholder="Location"
                                            className="input"
                                            style={{ width: '150px' }}
                                        />
                                        <input
                                            type="email"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            placeholder="Email"
                                            className="input"
                                            style={{ width: '200px' }}
                                        />
                                    </>
                                ) : (
                                    <>
                                        {contact.location && (
                                            <span className="text-small" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                                <MapPin style={{ width: '14px', height: '14px' }} /> {contact.location}
                                            </span>
                                        )}
                                        {contact.email && (
                                            <span className="text-small" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                                <Mail style={{ width: '14px', height: '14px' }} /> {contact.email}
                                            </span>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        {editing ? (
                            <>
                                <button onClick={() => setEditing(false)} className="btn btn-secondary">
                                    <X style={{ width: '16px', height: '16px' }} />
                                    Cancel
                                </button>
                                <button onClick={handleSave} disabled={saving} className="btn btn-primary">
                                    {saving ? <Loader style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} /> : <Save style={{ width: '16px', height: '16px' }} />}
                                    Save
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={handleDelete} className="btn btn-secondary" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>
                                    <Trash2 style={{ width: '16px', height: '16px' }} />
                                </button>
                                <button onClick={() => setEditing(true)} className="btn btn-secondary">
                                    <Edit style={{ width: '16px', height: '16px' }} />
                                    Edit
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid-main">
                {/* Main Content */}
                <div>
                    {/* Expertise */}
                    <div className="card" style={{ marginBottom: '1.5rem' }}>
                        <p className="text-label" style={{ marginBottom: '0.75rem' }}>EXPERTISE</p>
                        {editing ? (
                            <input
                                type="text"
                                value={form.expertise}
                                onChange={(e) => setForm({ ...form, expertise: e.target.value })}
                                placeholder="e.g., Climate Policy, Data Analysis"
                                className="input"
                            />
                        ) : (
                            contact.expertise ? (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {contact.expertise.split(',').map((skill, i) => (
                                        <span key={i} className="badge" style={{ padding: '0.5rem 1rem' }}>
                                            {skill.trim()}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-body text-dim">No expertise listed</p>
                            )
                        )}
                    </div>

                    {/* Notes */}
                    <div className="card">
                        <p className="text-label" style={{ marginBottom: '0.75rem' }}>NOTES</p>
                        {editing ? (
                            <textarea
                                value={form.notes}
                                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                placeholder="Add notes about this contact..."
                                className="input"
                                rows={6}
                                style={{ resize: 'vertical' }}
                            />
                        ) : (
                            <p className="text-body">{contact.notes || 'No notes yet'}</p>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="grid-sidebar">
                    <div className="card">
                        <p className="text-label" style={{ marginBottom: '1rem' }}>ACTIONS</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {[
                                { to: '/email', icon: Mail, label: 'Send email' },
                                { to: '/meetings', icon: Calendar, label: 'Schedule meeting' },
                            ].map((action) => (
                                <Link key={action.label} to={action.to} style={{ textDecoration: 'none' }}>
                                    <button className="btn btn-ghost" style={{
                                        width: '100%',
                                        justifyContent: 'flex-start',
                                        padding: '0.75rem'
                                    }}>
                                        <action.icon style={{ width: '16px', height: '16px', color: 'var(--gold)' }} />
                                        <span style={{ color: 'var(--text-secondary)' }}>{action.label}</span>
                                    </button>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Linked Stories */}
                    <LinkedStoriesCard
                        contact={contact}
                        api={api}
                        onUpdate={loadContact}
                    />
                </div>
            </div>
        </div>
    );
}

// Separate component for managing linked stories
function LinkedStoriesCard({ contact, api, onUpdate }) {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        loadStories();
    }, []);

    const loadStories = async () => {
        try {
            const data = await api.get('/stories');
            setStories(data);
        } catch (err) {
            console.error('Failed to load stories:', err);
        } finally {
            setLoading(false);
        }
    };

    const linkedStoryIds = contact.stories?.map(s => s.storyId) || [];

    const handleLink = async (storyId) => {
        setAdding(true);
        try {
            await api.post(`/contacts/${contact.id}/stories`, { storyId });
            onUpdate();
        } catch (err) {
            console.error('Failed to link:', err);
        } finally {
            setAdding(false);
        }
    };

    const handleUnlink = async (storyId) => {
        try {
            await api.del(`/contacts/${contact.id}/stories/${storyId}`);
            onUpdate();
        } catch (err) {
            console.error('Failed to unlink:', err);
        }
    };

    const unlinkedStories = stories.filter(s => !linkedStoryIds.includes(s.id));

    return (
        <div className="card">
            <p className="text-label" style={{ marginBottom: '1rem' }}>LINKED STORIES</p>

            {/* Current links */}
            {contact.stories?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                    {contact.stories.map((s) => (
                        <div key={s.storyId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span className="badge badge-gold">{s.story?.title}</span>
                            <button
                                onClick={() => handleUnlink(s.storyId)}
                                className="btn-ghost"
                                style={{ padding: '0.25rem', fontSize: '0.75rem', color: 'var(--text-dim)' }}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-small" style={{ marginBottom: '1rem', color: 'var(--text-dim)' }}>
                    Not linked to any stories yet
                </p>
            )}

            {/* Add link */}
            {!loading && unlinkedStories.length > 0 && (
                <div>
                    <select
                        onChange={(e) => e.target.value && handleLink(e.target.value)}
                        disabled={adding}
                        className="input"
                        style={{ width: '100%', fontSize: '0.8125rem' }}
                        value=""
                    >
                        <option value="">+ Link to story...</option>
                        {unlinkedStories.map(s => (
                            <option key={s.id} value={s.id}>{s.title}</option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
}

export default ContactProfile;
