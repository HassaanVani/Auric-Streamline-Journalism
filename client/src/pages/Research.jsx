import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import {
    Search,
    Sparkles,
    Trash2,
    Folder,
    Loader,
    ExternalLink
} from 'lucide-react';

export function Research() {
    const api = useApi();
    const [research, setResearch] = useState([]);
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [selectedStory, setSelectedStory] = useState('');
    const [searching, setSearching] = useState(false);
    const [currentResults, setCurrentResults] = useState(null);

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

    const handleSearch = async () => {
        if (!query.trim()) return;

        setSearching(true);
        setCurrentResults(null);
        try {
            const results = await api.post('/research/search', {
                query: query.trim(),
                storyId: selectedStory || null
            });
            setCurrentResults(results);
            await loadData();
        } catch (err) {
            console.error('Search failed:', err);
            setCurrentResults({ error: err.message || 'Search failed. Check API configuration.' });
        } finally {
            setSearching(false);
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
                <p className="text-body">AI-powered research for your investigations. Results are saved to your story.</p>
            </header>

            <div className="panel panel-gold" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Sparkles style={{ width: '18px', height: '18px', color: 'var(--gold)' }} />
                    <span className="text-label text-gold">AURIC AI RESEARCH</span>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
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
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="What would you like to research?"
                                className="input"
                                disabled={searching}
                                style={{ paddingLeft: '3rem', fontSize: '1rem' }}
                            />
                        </div>
                    </div>

                    <div style={{ minWidth: '180px' }}>
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
                        onClick={handleSearch}
                        disabled={!query.trim() || searching}
                        className="btn btn-primary"
                        style={{ minWidth: '120px' }}
                    >
                        {searching ? (
                            <>
                                <Loader style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                                Searching
                            </>
                        ) : (
                            <>
                                <Sparkles style={{ width: '16px', height: '16px' }} />
                                Search
                            </>
                        )}
                    </button>
                </div>
            </div>

            {currentResults && (
                <div className="panel" style={{ padding: '1.5rem', marginBottom: '2rem', background: 'var(--bg-secondary)' }}>
                    {currentResults.error ? (
                        <p className="text-body" style={{ color: 'var(--error)' }}>{currentResults.error}</p>
                    ) : (
                        <>
                            <h3 className="text-label" style={{ marginBottom: '1rem', color: 'var(--gold)' }}>
                                Search Results
                            </h3>
                            <div className="text-body" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                                {currentResults.summary}
                            </div>
                            {currentResults.sources?.length > 0 && (
                                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                                    <p className="text-label" style={{ marginBottom: '0.75rem' }}>Sources</p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        {currentResults.sources.map((src, i) => (
                                            <a key={i} href={src.url} target="_blank" rel="noopener noreferrer"
                                                className="badge" style={{
                                                    background: 'var(--bg-tertiary)',
                                                    color: 'var(--text-primary)',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.25rem',
                                                    textDecoration: 'none'
                                                }}>
                                                {src.title}
                                                <ExternalLink style={{ width: '12px', height: '12px' }} />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            <div>
                <h2 className="text-h2" style={{ marginBottom: '1rem' }}>Saved Research</h2>
                {research.length === 0 ? (
                    <div className="panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                        <Folder style={{ width: '48px', height: '48px', color: 'var(--gold)', margin: '0 auto 1.5rem' }} />
                        <h3 className="text-h2" style={{ marginBottom: '0.75rem' }}>No research saved yet</h3>
                        <p className="text-body" style={{ maxWidth: '400px', margin: '0 auto' }}>
                            Use the AI search above to start researching. Results will be saved automatically.
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
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
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
        </div>
    );
}

export default Research;
