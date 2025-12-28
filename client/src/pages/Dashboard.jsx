import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { NewStoryModal } from '../components/NewStoryModal';
import {
    Plus,
    Clock,
    FileText,
    Users,
    Search,
    Sparkles,
    ArrowRight,
    FolderOpen,
    Edit,
    Check,
    X
} from 'lucide-react';

export function Dashboard() {
    const api = useApi();
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNewStory, setShowNewStory] = useState(false);
    const [currentStory, setCurrentStory] = useState(null);

    // Edit mode
    const [editing, setEditing] = useState(false);
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
            if (data.length > 0) {
                setCurrentStory(data[0]);
            }
        } catch (err) {
            console.error('Failed to load stories:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateStory = async (storyData) => {
        const newStory = await api.post('/stories', storyData);
        setStories([newStory, ...stories]);
        setCurrentStory(newStory);
    };

    const startEditing = () => {
        setEditTitle(currentStory?.title || '');
        setEditDescription(currentStory?.description || '');
        setEditing(true);
    };

    const cancelEditing = () => {
        setEditing(false);
    };

    const saveEdits = async () => {
        if (!currentStory) return;
        setSaving(true);
        try {
            const updated = await api.put(`/stories/${currentStory.id}`, {
                title: editTitle,
                description: editDescription
            });
            setStories(stories.map(s => s.id === updated.id ? updated : s));
            setCurrentStory(updated);
            setEditing(false);
        } catch (err) {
            console.error('Failed to save:', err);
        } finally {
            setSaving(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffHours = Math.floor((now - date) / (1000 * 60 * 60));

        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffHours < 48) return 'Yesterday';
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    if (loading) {
        return (
            <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
                <p className="text-body">Loading your stories...</p>
            </div>
        );
    }

    // Empty state
    if (stories.length === 0) {
        return (
            <div className="page-container">
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '60vh',
                    textAlign: 'center'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '20px',
                        background: 'var(--gold-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1.5rem'
                    }}>
                        <FolderOpen style={{ width: '40px', height: '40px', color: 'var(--gold)' }} />
                    </div>

                    <h1 className="text-h1" style={{ marginBottom: '0.75rem' }}>Welcome to Auric</h1>
                    <p className="text-body" style={{ maxWidth: '400px', marginBottom: '2rem' }}>
                        Start your first investigation. Create a story to organize your research, sources, and drafts.
                    </p>

                    <button
                        onClick={() => setShowNewStory(true)}
                        className="btn btn-primary"
                        style={{ padding: '1rem 2rem', fontSize: '1rem' }}
                    >
                        <Plus style={{ width: '20px', height: '20px' }} />
                        Create Your First Story
                    </button>
                </div>

                <NewStoryModal
                    isOpen={showNewStory}
                    onClose={() => setShowNewStory(false)}
                    onCreate={handleCreateStory}
                />
            </div>
        );
    }

    return (
        <div className="page-container">
            {/* Page Header - Full Width */}
            <header style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div style={{ flex: 1 }}>
                        <p className="text-label" style={{ marginBottom: '0.75rem' }}>CURRENT STORY</p>

                        {editing ? (
                            <div style={{ maxWidth: '600px' }}>
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="input"
                                    style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '0.75rem' }}
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
                                    <button onClick={cancelEditing} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                                        <X style={{ width: '16px', height: '16px' }} /> Cancel
                                    </button>
                                    <button onClick={saveEdits} disabled={saving} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                                        <Check style={{ width: '16px', height: '16px' }} /> Save
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                    <h1 className="text-display">{currentStory?.title}</h1>
                                    <button onClick={startEditing} className="btn-ghost" style={{ padding: '0.5rem' }}>
                                        <Edit style={{ width: '18px', height: '18px' }} />
                                    </button>
                                </div>
                                {currentStory?.description && (
                                    <p className="text-body" style={{ marginBottom: '1rem', maxWidth: '600px' }}>{currentStory.description}</p>
                                )}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                    <span className="badge badge-gold" style={{ textTransform: 'capitalize' }}>{currentStory?.status}</span>
                                    <span className="text-small" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Clock style={{ width: '14px', height: '14px' }} />
                                        Updated {formatDate(currentStory?.updatedAt)}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>

                    <button onClick={() => setShowNewStory(true)} className="btn btn-primary">
                        <Plus style={{ width: '16px', height: '16px' }} />
                        New Story
                    </button>
                </div>

                {/* Progress Bar - Full Width */}
                <div style={{ marginTop: '1.5rem' }}>
                    <div className="progress-bar" style={{ marginBottom: '0.5rem', height: '8px' }}>
                        <div className="progress-fill" style={{ width: `${currentStory?.progress || 0}%` }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span className="text-small">Research</span>
                        <span className="text-small text-gold" style={{ fontWeight: 600 }}>{currentStory?.progress || 0}%</span>
                        <span className="text-small">Published</span>
                    </div>
                </div>
            </header>

            {/* Quick Actions - Full Width Row */}
            <section style={{ marginBottom: '2rem' }}>
                <h2 className="text-h3" style={{ marginBottom: '1rem' }}>Quick Actions</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                    {[
                        { to: '/research', icon: Search, label: 'Research', desc: 'Find sources & data' },
                        { to: '/contacts', icon: Users, label: 'Sources', desc: 'Manage contacts' },
                        { to: '/drafts', icon: FileText, label: 'Draft', desc: 'Write article' },
                        { to: '/meetings', icon: Clock, label: 'Interviews', desc: 'Schedule meetings' },
                    ].map((action) => (
                        <Link key={action.to} to={action.to} style={{ textDecoration: 'none' }}>
                            <div className="card card-interactive" style={{ padding: '1.25rem' }}>
                                <action.icon style={{ width: '24px', height: '24px', color: 'var(--gold)', marginBottom: '0.75rem' }} />
                                <p style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                                    {action.label}
                                </p>
                                <p className="text-small">{action.desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Story Overview + Other Stories Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Story Stats */}
                <section>
                    <h2 className="text-h3" style={{ marginBottom: '1rem' }}>Story Overview</h2>
                    <div className="card">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                            <div style={{ textAlign: 'center' }}>
                                <p className="text-display" style={{ fontSize: '2.25rem', marginBottom: '0.25rem' }}>
                                    {currentStory?._count?.contacts || 0}
                                </p>
                                <p className="text-small">Sources</p>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <p className="text-display" style={{ fontSize: '2.25rem', marginBottom: '0.25rem' }}>
                                    {currentStory?._count?.research || 0}
                                </p>
                                <p className="text-small">Research</p>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <p className="text-display" style={{ fontSize: '2.25rem', marginBottom: '0.25rem' }}>
                                    {currentStory?._count?.articles || 0}
                                </p>
                                <p className="text-small">Drafts</p>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <p className="text-display" style={{ fontSize: '2.25rem', marginBottom: '0.25rem' }}>
                                    {currentStory?._count?.meetings || 0}
                                </p>
                                <p className="text-small">Interviews</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Right Column: Other Stories + AI */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Other Stories */}
                    {stories.length > 1 && (
                        <div>
                            <p className="text-label" style={{ marginBottom: '0.75rem' }}>OTHER STORIES</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {stories.filter(s => s.id !== currentStory?.id).slice(0, 3).map((story) => (
                                    <button
                                        key={story.id}
                                        onClick={() => setCurrentStory(story)}
                                        className="card card-interactive"
                                        style={{ padding: '0.875rem', textAlign: 'left', width: '100%', cursor: 'pointer' }}
                                    >
                                        <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.125rem' }}>
                                            {story.title}
                                        </p>
                                        <p className="text-small">{formatDate(story.updatedAt)}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* AI Insights - Compact */}
                    <div className="panel panel-gold" style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <Sparkles style={{ width: '14px', height: '14px', color: 'var(--gold)' }} />
                            <span className="text-label text-gold" style={{ fontSize: '0.6875rem' }}>AI INSIGHTS</span>
                        </div>
                        <p className="text-small" style={{ marginBottom: '0.75rem' }}>
                            Get suggestions based on your research.
                        </p>
                        <Link to="/research" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontSize: '0.8125rem',
                            color: 'var(--gold)',
                            textDecoration: 'none'
                        }}>
                            Start researching <ArrowRight style={{ width: '12px', height: '12px' }} />
                        </Link>
                    </div>
                </div>
            </div>

            <NewStoryModal
                isOpen={showNewStory}
                onClose={() => setShowNewStory(false)}
                onCreate={handleCreateStory}
            />
        </div>
    );
}

export default Dashboard;
