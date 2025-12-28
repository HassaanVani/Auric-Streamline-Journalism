import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { NewStoryModal } from '../components/NewStoryModal';
import {
    Plus,
    Trash2,
    Edit,
    Check,
    X,
    Loader,
    FolderOpen,
    Clock,
    MoreVertical
} from 'lucide-react';

export function Stories() {
    const api = useApi();
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNewStory, setShowNewStory] = useState(false);

    // Selection for batch operations
    const [selected, setSelected] = useState(new Set());

    // Editing
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [saving, setSaving] = useState(false);

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

    const handleCreateStory = async (storyData) => {
        const newStory = await api.post('/stories', storyData);
        setStories([newStory, ...stories]);
    };

    const toggleSelect = (id) => {
        const newSelected = new Set(selected);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelected(newSelected);
    };

    const selectAll = () => {
        if (selected.size === stories.length) {
            setSelected(new Set());
        } else {
            setSelected(new Set(stories.map(s => s.id)));
        }
    };

    const startEditing = (story) => {
        setEditingId(story.id);
        setEditTitle(story.title);
        setEditDescription(story.description || '');
    };

    const cancelEditing = () => {
        setEditingId(null);
    };

    const saveEdit = async (id) => {
        setSaving(true);
        try {
            const updated = await api.put(`/stories/${id}`, {
                title: editTitle,
                description: editDescription
            });
            setStories(stories.map(s => s.id === id ? updated : s));
            setEditingId(null);
        } catch (err) {
            console.error('Failed to save:', err);
        } finally {
            setSaving(false);
        }
    };

    const deleteStory = async (id) => {
        if (!confirm('Delete this story and all associated content?')) return;
        try {
            await api.del(`/stories/${id}`);
            setStories(stories.filter(s => s.id !== id));
            selected.delete(id);
            setSelected(new Set(selected));
        } catch (err) {
            console.error('Failed to delete:', err);
        }
    };

    const deleteSelected = async () => {
        if (selected.size === 0) return;
        if (!confirm(`Delete ${selected.size} stories and all associated content?`)) return;

        try {
            await Promise.all([...selected].map(id => api.del(`/stories/${id}`)));
            setStories(stories.filter(s => !selected.has(s.id)));
            setSelected(new Set());
        } catch (err) {
            console.error('Failed to delete:', err);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
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
            <header className="page-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 className="text-h1" style={{ marginBottom: '0.5rem' }}>Stories</h1>
                        <p className="text-body">Manage all your stories in one place.</p>
                    </div>
                    <button onClick={() => setShowNewStory(true)} className="btn btn-primary">
                        <Plus style={{ width: '16px', height: '16px' }} />
                        New Story
                    </button>
                </div>
            </header>

            {stories.length === 0 ? (
                <div className="panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <FolderOpen style={{ width: '48px', height: '48px', color: 'var(--gold)', margin: '0 auto 1.5rem' }} />
                    <h2 className="text-h2" style={{ marginBottom: '0.75rem' }}>No stories yet</h2>
                    <p className="text-body" style={{ maxWidth: '400px', margin: '0 auto 2rem' }}>
                        Create your first story to get started.
                    </p>
                    <button onClick={() => setShowNewStory(true)} className="btn btn-primary">
                        <Plus style={{ width: '16px', height: '16px' }} />
                        Create Story
                    </button>
                </div>
            ) : (
                <>
                    {/* Toolbar */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1rem',
                        padding: '0.75rem 1rem',
                        background: 'var(--bg-secondary)',
                        borderRadius: '8px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={selected.size === stories.length && stories.length > 0}
                                    onChange={selectAll}
                                    style={{ width: '16px', height: '16px', accentColor: 'var(--gold)' }}
                                />
                                <span className="text-small">Select All</span>
                            </label>
                            {selected.size > 0 && (
                                <span className="text-small text-gold">{selected.size} selected</span>
                            )}
                        </div>

                        {selected.size > 0 && (
                            <button
                                onClick={deleteSelected}
                                className="btn btn-secondary"
                                style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
                            >
                                <Trash2 style={{ width: '16px', height: '16px' }} />
                                Delete Selected
                            </button>
                        )}
                    </div>

                    {/* Stories List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {stories.map(story => (
                            <div
                                key={story.id}
                                className="card"
                                style={{
                                    borderColor: selected.has(story.id) ? 'var(--gold)' : undefined
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                    {/* Checkbox */}
                                    <input
                                        type="checkbox"
                                        checked={selected.has(story.id)}
                                        onChange={() => toggleSelect(story.id)}
                                        style={{ marginTop: '0.25rem', width: '16px', height: '16px', accentColor: 'var(--gold)' }}
                                    />

                                    {/* Content */}
                                    <div style={{ flex: 1 }}>
                                        {editingId === story.id ? (
                                            <div>
                                                <input
                                                    type="text"
                                                    value={editTitle}
                                                    onChange={(e) => setEditTitle(e.target.value)}
                                                    className="input"
                                                    style={{ marginBottom: '0.5rem', fontWeight: 500 }}
                                                />
                                                <textarea
                                                    value={editDescription}
                                                    onChange={(e) => setEditDescription(e.target.value)}
                                                    placeholder="Add a description..."
                                                    className="input"
                                                    rows={2}
                                                    style={{ resize: 'none', marginBottom: '0.75rem' }}
                                                />
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button onClick={cancelEditing} className="btn btn-secondary" style={{ padding: '0.375rem 0.75rem' }}>
                                                        <X style={{ width: '14px', height: '14px' }} /> Cancel
                                                    </button>
                                                    <button onClick={() => saveEdit(story.id)} disabled={saving} className="btn btn-primary" style={{ padding: '0.375rem 0.75rem' }}>
                                                        <Check style={{ width: '14px', height: '14px' }} /> Save
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                                                    <Link
                                                        to="/"
                                                        style={{
                                                            fontSize: '1rem',
                                                            fontWeight: 500,
                                                            color: 'var(--text-primary)',
                                                            textDecoration: 'none'
                                                        }}
                                                    >
                                                        {story.title}
                                                    </Link>
                                                    <span className="badge badge-gold" style={{ textTransform: 'capitalize' }}>
                                                        {story.status}
                                                    </span>
                                                </div>
                                                {story.description && (
                                                    <p className="text-small" style={{ marginBottom: '0.5rem' }}>{story.description}</p>
                                                )}
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <span className="text-small" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                        <Clock style={{ width: '12px', height: '12px' }} />
                                                        {formatDate(story.updatedAt)}
                                                    </span>
                                                    <span className="text-small">
                                                        {story._count?.contacts || 0} sources • {story._count?.articles || 0} drafts
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    {editingId !== story.id && (
                                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                                            <button
                                                onClick={() => startEditing(story)}
                                                className="btn-ghost"
                                                style={{ padding: '0.5rem' }}
                                            >
                                                <Edit style={{ width: '16px', height: '16px' }} />
                                            </button>
                                            <button
                                                onClick={() => deleteStory(story.id)}
                                                className="btn-ghost"
                                                style={{ padding: '0.5rem', color: 'var(--danger)' }}
                                            >
                                                <Trash2 style={{ width: '16px', height: '16px' }} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            <NewStoryModal
                isOpen={showNewStory}
                onClose={() => setShowNewStory(false)}
                onCreate={handleCreateStory}
            />
        </div>
    );
}

export default Stories;
