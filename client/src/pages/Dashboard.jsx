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
    FolderOpen
} from 'lucide-react';

export function Dashboard() {
    const api = useApi();
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNewStory, setShowNewStory] = useState(false);
    const [currentStory, setCurrentStory] = useState(null);

    useEffect(() => {
        loadStories();
    }, []);

    const loadStories = async () => {
        try {
            const data = await api.get('/stories');
            setStories(data);
            // Set the most recent story as current
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

    // Empty state - no stories yet
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
            {/* Page Header */}
            <header className="page-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <p className="text-label" style={{ marginBottom: '1rem' }}>CURRENT STORY</p>
                        <h1 className="text-display" style={{ marginBottom: '0.75rem' }}>{currentStory?.title}</h1>
                        {currentStory?.description && (
                            <p className="text-body" style={{ marginBottom: '1.5rem', maxWidth: '600px' }}>{currentStory.description}</p>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <span className="badge badge-gold" style={{ textTransform: 'capitalize' }}>{currentStory?.status}</span>
                            <span className="text-small" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Clock style={{ width: '14px', height: '14px' }} />
                                Updated {formatDate(currentStory?.updatedAt)}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowNewStory(true)}
                        className="btn btn-primary"
                    >
                        <Plus style={{ width: '16px', height: '16px' }} />
                        New Story
                    </button>
                </div>

                {/* Progress */}
                <div style={{ maxWidth: '500px', marginTop: '2rem' }}>
                    <div className="progress-bar" style={{ marginBottom: '0.5rem' }}>
                        <div className="progress-fill" style={{ width: `${currentStory?.progress || 0}%` }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span className="text-small">Research</span>
                        <span className="text-small text-gold" style={{ fontWeight: 600 }}>{currentStory?.progress || 0}%</span>
                        <span className="text-small">Published</span>
                    </div>
                </div>
            </header>

            {/* Main Grid */}
            <div className="grid-main">
                {/* Left Content */}
                <div>
                    {/* Quick Actions */}
                    <section className="section">
                        <h2 className="text-h3" style={{ marginBottom: '1.5rem' }}>Quick Actions</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                            {[
                                { to: '/research', icon: Search, label: 'Research', desc: 'Find sources & data' },
                                { to: '/contacts', icon: Users, label: 'Sources', desc: 'Manage contacts' },
                                { to: '/drafts', icon: FileText, label: 'Draft', desc: 'Write article' },
                            ].map((action) => (
                                <Link key={action.to} to={action.to} style={{ textDecoration: 'none' }}>
                                    <div className="card card-interactive" style={{ padding: '1.5rem' }}>
                                        <action.icon style={{ width: '24px', height: '24px', color: 'var(--gold)', marginBottom: '1rem' }} />
                                        <p style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                                            {action.label}
                                        </p>
                                        <p className="text-small">{action.desc}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Story Stats */}
                    <section className="section">
                        <h2 className="text-h3" style={{ marginBottom: '1.5rem' }}>Story Overview</h2>
                        <div className="card">
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <p className="text-display" style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>
                                        {currentStory?._count?.contacts || 0}
                                    </p>
                                    <p className="text-small">Sources</p>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <p className="text-display" style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>
                                        {currentStory?._count?.research || 0}
                                    </p>
                                    <p className="text-small">Research</p>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <p className="text-display" style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>
                                        {currentStory?._count?.articles || 0}
                                    </p>
                                    <p className="text-small">Drafts</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Sidebar */}
                <div className="grid-sidebar">
                    {/* Other Stories */}
                    {stories.length > 1 && (
                        <div>
                            <p className="text-label" style={{ marginBottom: '1rem' }}>OTHER STORIES</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {stories.filter(s => s.id !== currentStory?.id).slice(0, 3).map((story) => (
                                    <button
                                        key={story.id}
                                        onClick={() => setCurrentStory(story)}
                                        className="card card-interactive"
                                        style={{ padding: '1rem', textAlign: 'left', width: '100%', cursor: 'pointer' }}
                                    >
                                        <p style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                                            {story.title}
                                        </p>
                                        <p className="text-small">{formatDate(story.updatedAt)}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* AI Insights */}
                    <div className="panel panel-gold">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <Sparkles style={{ width: '16px', height: '16px', color: 'var(--gold)' }} />
                            <p className="text-label text-gold">AI INSIGHTS</p>
                        </div>

                        <p className="text-body" style={{ marginBottom: '1rem' }}>
                            Get AI-powered suggestions for your story based on your research and sources.
                        </p>

                        <Link to="/research" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontSize: '0.875rem',
                            color: 'var(--gold)',
                            textDecoration: 'none'
                        }}>
                            Start researching <ArrowRight style={{ width: '14px', height: '14px' }} />
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
