import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import {
    Search,
    Sparkles,
    Trash2,
    Send,
    Folder,
    Plus,
    Loader
} from 'lucide-react';

export function Research() {
    const api = useApi();
    const [research, setResearch] = useState([]);
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [selectedStory, setSelectedStory] = useState('');
    const [saving, setSaving] = useState(false);
    const [aiQuery, setAiQuery] = useState('');
    const [aiSearching, setAiSearching] = useState(false);
    const [aiResults, setAiResults] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [researchData, storiesData] = await Promise.all([
                api.get('/research'),
                api.get('/stories')
            ]);
            setResearch(researchData);
            setStories(storiesData);
            if (storiesData.length > 0 && !selectedStory) {
                setSelectedStory(storiesData[0].id);
            }
        } catch (err) {
            console.error('Failed to load data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveResearch = async () => {
        if (!query.trim()) return;

        setSaving(true);
        try {
            const newResearch = await api.post('/research', {
                query: query.trim(),
                storyId: selectedStory || null,
                results: null
            });
            setResearch([newResearch, ...research]);
            setQuery('');
        } catch (err) {
            console.error('Failed to save research:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleAiSearch = async () => {
        if (!aiQuery.trim()) return;

        setAiSearching(true);
        setAiResults(null);
        try {
            const results = await api.post('/research/search', {
                query: aiQuery.trim(),
                storyId: selectedStory || null
            });
            setAiResults(results);
            await loadData();
        } catch (err) {
            console.error('AI search failed:', err);
            setAiResults({ error: err.message || 'AI search failed' });
        } finally {
            setAiSearching(false);
        }
    };

    const handleDeleteResearch = async (id) => {
        try {
            await api.del(`/research/${id}`);
            setResearch(research.filter(r => r.id !== id));
        } catch (err) {
            console.error('Failed to delete research:', err);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
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
                <h1 className="text-h1" style={{ marginBottom: '0.5rem' }}>Research</h1>
                <p className="text-body">Save research queries and notes for your stories.</p>
            </header>

            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                        <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Research Query</label>
                        <div style={{ position: 'relative' }}>
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
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSaveResearch()}
                                placeholder="What are you researching?"
                                className="input"
                                style={{ paddingLeft: '3rem' }}
                            />
                        </div>
                    </div>

                    <div style={{ minWidth: '200px' }}>
                        <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Link to Story</label>
                        <select
                            value={selectedStory}
                            onChange={(e) => setSelectedStory(e.target.value)}
                            className="input"
                        >
                            <option value="">No story</option>
                            {stories.map(s => (
                                <option key={s.id} value={s.id}>{s.title}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={handleSaveResearch}
                        disabled={!query.trim() || saving}
                        className="btn btn-primary"
                    >
                        {saving ? <Loader style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} /> : <Plus style={{ width: '16px', height: '16px' }} />}
                        Save
                    </button>
                </div>
            </div>

            <div className="grid-main">
                <div>
                    {research.length === 0 ? (
                        <div className="panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                            <Folder style={{ width: '48px', height: '48px', color: 'var(--gold)', margin: '0 auto 1.5rem' }} />
                            <h2 className="text-h2" style={{ marginBottom: '0.75rem' }}>No research saved yet</h2>
                            <p className="text-body" style={{ maxWidth: '400px', margin: '0 auto' }}>
                                Start saving your research queries above. You can link them to specific stories.
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {research.map((item) => (
                                <div key={item.id} className="card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                                                {item.query}
                                            </h3>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <span className="text-small">{formatDate(item.createdAt)}</span>
                                                {item.story && (
                                                    <span className="badge badge-gold">{item.story.title}</span>
                                                )}
                                                {item.results && (
                                                    <span className="badge" style={{ background: 'var(--gold-dim)', color: 'var(--gold)' }}>
                                                        <Sparkles style={{ width: '12px', height: '12px' }} /> AI
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteResearch(item.id)}
                                            className="btn-ghost"
                                            style={{ padding: '0.5rem', color: 'var(--text-dim)' }}
                                        >
                                            <Trash2 style={{ width: '16px', height: '16px' }} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="grid-sidebar">
                    <div className="panel panel-gold">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <Sparkles style={{ width: '16px', height: '16px', color: 'var(--gold)' }} />
                            <p className="text-label text-gold">AURIC AI ASSISTANT</p>
                        </div>

                        <p className="text-body" style={{ marginBottom: '1rem' }}>
                            Search the web with AI-powered research. Results are automatically saved to your story.
                        </p>

                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                placeholder="Ask Auric AI..."
                                className="input"
                                value={aiQuery}
                                onChange={(e) => setAiQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
                                disabled={aiSearching}
                                style={{ paddingRight: '3rem' }}
                            />
                            <button
                                onClick={handleAiSearch}
                                disabled={aiSearching || !aiQuery.trim()}
                                style={{
                                    position: 'absolute',
                                    right: '0.75rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    color: aiSearching ? 'var(--text-dim)' : 'var(--gold)',
                                    cursor: aiSearching ? 'wait' : 'pointer'
                                }}
                            >
                                {aiSearching
                                    ? <Loader style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                                    : <Send style={{ width: '16px', height: '16px' }} />
                                }
                            </button>
                        </div>

                        {aiResults && (
                            <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px', maxHeight: '300px', overflow: 'auto' }}>
                                {aiResults.error ? (
                                    <p className="text-small" style={{ color: 'var(--error)' }}>{aiResults.error}</p>
                                ) : (
                                    <>
                                        <p className="text-body" style={{ whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}>
                                            {aiResults.summary}
                                        </p>
                                        {aiResults.sources?.length > 0 && (
                                            <div style={{ marginTop: '0.75rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                                                <p className="text-label" style={{ marginBottom: '0.5rem' }}>Sources</p>
                                                {aiResults.sources.map((src, i) => (
                                                    <a key={i} href={src.url} target="_blank" rel="noopener noreferrer"
                                                        className="text-small" style={{ display: 'block', color: 'var(--gold)', marginBottom: '0.25rem' }}>
                                                        {src.title}
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Research;
