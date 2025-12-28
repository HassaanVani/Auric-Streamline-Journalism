import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import {
    Save,
    Loader,
    Plus,
    FileText,
    Trash2,
    ChevronDown
} from 'lucide-react';

export function ArticleDraft() {
    const api = useApi();
    const [articles, setArticles] = useState([]);
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [selectedArticle, setSelectedArticle] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedStory, setSelectedStory] = useState('');

    const [showNewForm, setShowNewForm] = useState(false);
    const [newTitle, setNewTitle] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [articlesData, storiesData] = await Promise.all([
                api.get('/articles'),
                api.get('/stories')
            ]);
            setArticles(articlesData);
            setStories(storiesData);

            if (articlesData.length > 0) {
                selectArticle(articlesData[0]);
            }
            if (storiesData.length > 0 && !selectedStory) {
                setSelectedStory(storiesData[0].id);
            }
        } catch (err) {
            console.error('Failed to load data:', err);
        } finally {
            setLoading(false);
        }
    };

    const selectArticle = (article) => {
        setSelectedArticle(article);
        setTitle(article.title);
        setContent(article.content);
    };

    const handleCreateArticle = async () => {
        if (!newTitle.trim() || !selectedStory) return;

        setSaving(true);
        try {
            const article = await api.post('/articles', {
                title: newTitle.trim(),
                content: '',
                storyId: selectedStory
            });
            setArticles([article, ...articles]);
            selectArticle(article);
            setNewTitle('');
            setShowNewForm(false);
        } catch (err) {
            console.error('Failed to create article:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleSave = async () => {
        if (!selectedArticle) return;

        setSaving(true);
        try {
            const updated = await api.put(`/articles/${selectedArticle.id}`, {
                title,
                content
            });
            setArticles(articles.map(a => a.id === updated.id ? updated : a));
            setSelectedArticle(updated);
        } catch (err) {
            console.error('Failed to save:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this article?')) return;

        try {
            await api.del(`/articles/${id}`);
            const remaining = articles.filter(a => a.id !== id);
            setArticles(remaining);
            if (selectedArticle?.id === id) {
                if (remaining.length > 0) {
                    selectArticle(remaining[0]);
                } else {
                    setSelectedArticle(null);
                    setTitle('');
                    setContent('');
                }
            }
        } catch (err) {
            console.error('Failed to delete:', err);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric'
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
        <div className="page-container" style={{ display: 'flex', gap: '2rem', height: 'calc(100vh - 120px)' }}>
            {/* Sidebar - Article List */}
            <div style={{ width: '280px', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 className="text-h3">Drafts</h2>
                    <button onClick={() => setShowNewForm(true)} className="btn-ghost" style={{ padding: '0.5rem' }}>
                        <Plus style={{ width: '18px', height: '18px' }} />
                    </button>
                </div>

                {/* New article form */}
                {showNewForm && (
                    <div className="card" style={{ marginBottom: '1rem', padding: '1rem' }}>
                        <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="Article title"
                            className="input"
                            style={{ marginBottom: '0.75rem', fontSize: '0.875rem' }}
                        />
                        <select
                            value={selectedStory}
                            onChange={(e) => setSelectedStory(e.target.value)}
                            className="input"
                            style={{ marginBottom: '0.75rem', fontSize: '0.875rem' }}
                        >
                            {stories.map(s => (
                                <option key={s.id} value={s.id}>{s.title}</option>
                            ))}
                        </select>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => setShowNewForm(false)} className="btn btn-secondary" style={{ flex: 1, fontSize: '0.75rem' }}>Cancel</button>
                            <button onClick={handleCreateArticle} disabled={!newTitle.trim() || saving} className="btn btn-primary" style={{ flex: 1, fontSize: '0.75rem' }}>Create</button>
                        </div>
                    </div>
                )}

                {/* Article list */}
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {articles.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                            <FileText style={{ width: '32px', height: '32px', color: 'var(--text-dim)', margin: '0 auto 1rem' }} />
                            <p className="text-small">No drafts yet</p>
                        </div>
                    ) : (
                        articles.map(article => (
                            <div
                                key={article.id}
                                onClick={() => selectArticle(article)}
                                className={`card card-interactive ${selectedArticle?.id === article.id ? 'active' : ''}`}
                                style={{
                                    padding: '1rem',
                                    cursor: 'pointer',
                                    borderColor: selectedArticle?.id === article.id ? 'var(--gold)' : undefined
                                }}
                            >
                                <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                                    {article.title}
                                </p>
                                <p className="text-small">
                                    {article.story?.title} • {formatDate(article.updatedAt)}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Editor */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {selectedArticle ? (
                    <>
                        {/* Toolbar */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="input"
                                style={{ fontSize: '1.25rem', fontWeight: 600, maxWidth: '500px' }}
                            />
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button onClick={() => handleDelete(selectedArticle.id)} className="btn btn-secondary">
                                    <Trash2 style={{ width: '16px', height: '16px' }} />
                                </button>
                                <button onClick={handleSave} disabled={saving} className="btn btn-primary">
                                    {saving ? <Loader style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} /> : <Save style={{ width: '16px', height: '16px' }} />}
                                    Save
                                </button>
                            </div>
                        </div>

                        {/* Content area */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Start writing your article..."
                                className="input"
                                style={{
                                    flex: 1,
                                    resize: 'none',
                                    fontFamily: "'Newsreader', Georgia, serif",
                                    fontSize: '1.0625rem',
                                    lineHeight: 1.8
                                }}
                            />
                        </div>
                    </>
                ) : (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ textAlign: 'center' }}>
                            <FileText style={{ width: '48px', height: '48px', color: 'var(--text-dim)', margin: '0 auto 1rem' }} />
                            <p className="text-body">Select a draft or create a new one</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ArticleDraft;
