import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import ReactMarkdown from 'react-markdown';
import {
    Search,
    Sparkles,
    Trash2,
    Folder,
    Loader,
    ExternalLink,
    ChevronDown,
    ChevronUp,
    Globe,
    Bookmark,
    Plus,
    X
} from 'lucide-react';

export function Research() {
    const api = useApi();
    const [research, setResearch] = useState([]);
    const [stories, setStories] = useState([]);
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [selectedStory, setSelectedStory] = useState('');
    const [searching, setSearching] = useState(false);
    const [currentResults, setCurrentResults] = useState(null);
    const [expandedResearch, setExpandedResearch] = useState({});
    const [showBookmarkForm, setShowBookmarkForm] = useState(false);
    const [bookmarkForm, setBookmarkForm] = useState({ url: '', title: '', quote: '' });
    const [savingBookmark, setSavingBookmark] = useState(false);
    const [findingWebsites, setFindingWebsites] = useState(false);
    const [websiteResults, setWebsiteResults] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [researchData, storiesData, bookmarksData] = await Promise.all([
                api.get('/research'),
                api.get('/stories'),
                api.get('/bookmarks').catch(() => [])
            ]);
            setResearch(researchData);
            setStories(storiesData);
            setBookmarks(bookmarksData);
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

    const handleFindWebsites = async () => {
        if (!query.trim()) return;

        setFindingWebsites(true);
        setWebsiteResults(null);
        try {
            const story = stories.find(s => s.id === selectedStory);
            const websites = await api.post('/research/find-websites', {
                topic: query.trim(),
                storyContext: story?.description || story?.title || null
            });
            setWebsiteResults(websites);
        } catch (err) {
            console.error('Find websites failed:', err);
        } finally {
            setFindingWebsites(false);
        }
    };

    const handleAddBookmark = async () => {
        if (!bookmarkForm.url.trim() || !bookmarkForm.title.trim()) return;

        setSavingBookmark(true);
        try {
            const bookmark = await api.post('/bookmarks', {
                url: bookmarkForm.url.trim(),
                title: bookmarkForm.title.trim(),
                quote: bookmarkForm.quote.trim() || null,
                storyId: selectedStory || null
            });
            setBookmarks([bookmark, ...bookmarks]);
            setBookmarkForm({ url: '', title: '', quote: '' });
            setShowBookmarkForm(false);
        } catch (err) {
            console.error('Add bookmark failed:', err);
        } finally {
            setSavingBookmark(false);
        }
    };

    const handleDeleteBookmark = async (id) => {
        try {
            await api.del(`/bookmarks/${id}`);
            setBookmarks(bookmarks.filter(b => b.id !== id));
        } catch (err) {
            console.error('Delete bookmark failed:', err);
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
                <p className="text-body">AI-powered research for your investigations.</p>
            </header>

            <div className="panel panel-gold" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Sparkles style={{ width: '18px', height: '18px', color: 'var(--gold)' }} />
                    <span className="text-label text-gold">AURIC AI RESEARCH</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                            style={{ paddingLeft: '3rem', fontSize: '1rem', width: '100%' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <select
                            value={selectedStory}
                            onChange={(e) => setSelectedStory(e.target.value)}
                            className="input"
                            style={{ flex: '1 1 150px', minWidth: '150px' }}
                        >
                            <option value="">No story</option>
                            {stories.map(s => (
                                <option key={s.id} value={s.id}>{s.title}</option>
                            ))}
                        </select>

                        <button
                            onClick={handleSearch}
                            disabled={!query.trim() || searching}
                            className="btn btn-primary"
                            style={{ flex: '0 0 auto', minHeight: '44px', padding: '0 1.5rem' }}
                        >
                            {searching ? (
                                <>
                                    <Loader style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />
                                    <span className="hide-mobile">Searching...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles style={{ width: '18px', height: '18px' }} />
                                    <span>Search</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {currentResults && (
                <div className="panel" style={{
                    padding: '1.5rem',
                    marginBottom: '2rem',
                    background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, var(--bg-secondary) 100%)',
                    borderLeft: '3px solid var(--gold)',
                    borderRadius: '0 12px 12px 0'
                }}>
                    {currentResults.error ? (
                        <p className="text-body" style={{ color: 'var(--error)' }}>{currentResults.error}</p>
                    ) : (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                                <Sparkles style={{ width: '16px', height: '16px', color: 'var(--gold)' }} />
                                <h3 className="text-label" style={{ color: 'var(--gold)', margin: 0 }}>
                                    AI Research Results
                                </h3>
                            </div>
                            <div className="ai-content" style={{
                                lineHeight: 1.8,
                                fontSize: '1rem',
                                color: 'var(--text-primary)'
                            }}>
                                <ReactMarkdown
                                    components={{
                                        h1: ({ children }) => <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '1.5rem', marginBottom: '0.75rem', color: 'var(--gold)' }}>{children}</h2>,
                                        h2: ({ children }) => <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginTop: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{children}</h3>,
                                        h3: ({ children }) => <h4 style={{ fontSize: '1rem', fontWeight: 600, marginTop: '1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{children}</h4>,
                                        p: ({ children }) => <p style={{ marginBottom: '1rem' }}>{children}</p>,
                                        ul: ({ children }) => <ul style={{ marginBottom: '1rem', paddingLeft: '1.5rem' }}>{children}</ul>,
                                        ol: ({ children }) => <ol style={{ marginBottom: '1rem', paddingLeft: '1.5rem' }}>{children}</ol>,
                                        li: ({ children }) => <li style={{ marginBottom: '0.5rem' }}>{children}</li>,
                                        strong: ({ children }) => <strong style={{ color: 'var(--gold)', fontWeight: 600 }}>{children}</strong>,
                                        em: ({ children }) => <em style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>{children}</em>,
                                        blockquote: ({ children }) => <blockquote style={{ borderLeft: '2px solid var(--gold)', paddingLeft: '1rem', marginLeft: 0, marginBottom: '1rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>{children}</blockquote>,
                                        code: ({ children }) => <code style={{ background: 'var(--bg-tertiary)', padding: '0.125rem 0.375rem', borderRadius: '4px', fontSize: '0.875rem' }}>{children}</code>
                                    }}
                                >
                                    {currentResults.summary}
                                </ReactMarkdown>
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
                    <div className="panel" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                        <Folder style={{ width: '48px', height: '48px', color: 'var(--gold)', margin: '0 auto 1.5rem' }} />
                        <h3 className="text-h2" style={{ marginBottom: '0.75rem' }}>No research saved yet</h3>
                        <p className="text-body" style={{ maxWidth: '400px', margin: '0 auto' }}>
                            Use the AI search above to start researching.
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {research.map((item) => {
                            const isExpanded = expandedResearch[item.id];
                            const parsedResults = item.results ? (() => {
                                try { return JSON.parse(item.results); }
                                catch { return null; }
                            })() : null;

                            return (
                                <div key={item.id} className="card" style={{ overflow: 'hidden' }}>
                                    <div
                                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', cursor: parsedResults ? 'pointer' : 'default' }}
                                        onClick={() => parsedResults && setExpandedResearch(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                                    >
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                <h3 style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)', wordBreak: 'break-word', margin: 0 }}>
                                                    {item.query}
                                                </h3>
                                                {parsedResults && (
                                                    isExpanded ?
                                                        <ChevronUp style={{ width: '16px', height: '16px', color: 'var(--text-dim)', flexShrink: 0 }} /> :
                                                        <ChevronDown style={{ width: '16px', height: '16px', color: 'var(--text-dim)', flexShrink: 0 }} />
                                                )}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                                                <span className="text-small">{formatDate(item.createdAt)}</span>
                                                {item.story && (
                                                    <span className="badge badge-gold">{item.story.title}</span>
                                                )}
                                                {parsedResults && (
                                                    <span className="badge" style={{ background: 'var(--gold-dim)', color: 'var(--gold)' }}>
                                                        <Sparkles style={{ width: '12px', height: '12px' }} /> AI
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                                            {parsedResults && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setQuery(item.query);
                                                        setCurrentResults(parsedResults);
                                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                                    }}
                                                    className="btn-ghost"
                                                    style={{ padding: '0.5rem', color: 'var(--gold)' }}
                                                    title="Continue Research"
                                                >
                                                    <Search style={{ width: '16px', height: '16px' }} />
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteResearch(item.id);
                                                }}
                                                className="btn-ghost"
                                                style={{ padding: '0.5rem', color: 'var(--text-dim)' }}
                                            >
                                                <Trash2 style={{ width: '16px', height: '16px' }} />
                                            </button>
                                        </div>
                                    </div>

                                    {isExpanded && parsedResults && (
                                        <div style={{
                                            marginTop: '1rem',
                                            paddingTop: '1rem',
                                            borderTop: '1px solid var(--border)',
                                            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, transparent 100%)',
                                            margin: '1rem -1.25rem -1.25rem',
                                            padding: '1rem 1.25rem 1.25rem'
                                        }}>
                                            <div className="ai-content" style={{ lineHeight: 1.7, fontSize: '0.9375rem' }}>
                                                <ReactMarkdown
                                                    components={{
                                                        h1: ({ children }) => <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginTop: '1rem', marginBottom: '0.5rem', color: 'var(--gold)' }}>{children}</h2>,
                                                        h2: ({ children }) => <h3 style={{ fontSize: '1rem', fontWeight: 600, marginTop: '0.75rem', marginBottom: '0.5rem' }}>{children}</h3>,
                                                        h3: ({ children }) => <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, marginTop: '0.5rem', marginBottom: '0.375rem' }}>{children}</h4>,
                                                        p: ({ children }) => <p style={{ marginBottom: '0.75rem' }}>{children}</p>,
                                                        ul: ({ children }) => <ul style={{ marginBottom: '0.75rem', paddingLeft: '1.25rem' }}>{children}</ul>,
                                                        ol: ({ children }) => <ol style={{ marginBottom: '0.75rem', paddingLeft: '1.25rem' }}>{children}</ol>,
                                                        li: ({ children }) => <li style={{ marginBottom: '0.375rem' }}>{children}</li>,
                                                        strong: ({ children }) => <strong style={{ color: 'var(--gold)', fontWeight: 600 }}>{children}</strong>,
                                                        em: ({ children }) => <em style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>{children}</em>
                                                    }}
                                                >
                                                    {parsedResults.summary}
                                                </ReactMarkdown>
                                            </div>
                                            {parsedResults.sources?.length > 0 && (
                                                <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                                                    <p className="text-label" style={{ marginBottom: '0.5rem', fontSize: '0.75rem' }}>Sources</p>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                                                        {parsedResults.sources.map((src, i) => (
                                                            <a key={i} href={src.url} target="_blank" rel="noopener noreferrer"
                                                                className="badge" style={{
                                                                    background: 'var(--bg-tertiary)',
                                                                    color: 'var(--text-primary)',
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    gap: '0.25rem',
                                                                    textDecoration: 'none',
                                                                    fontSize: '0.75rem'
                                                                }}
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                {src.title}
                                                                <ExternalLink style={{ width: '10px', height: '10px' }} />
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Website Finder */}
            <div style={{ marginTop: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Globe style={{ width: '20px', height: '20px', color: 'var(--gold)' }} />
                        <h2 className="text-h2" style={{ margin: 0 }}>Website Finder</h2>
                    </div>
                    <button
                        onClick={handleFindWebsites}
                        disabled={!query.trim() || findingWebsites}
                        className="btn btn-secondary"
                    >
                        {findingWebsites ? (
                            <><Loader style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} /> Finding...</>
                        ) : (
                            <><Sparkles style={{ width: '14px', height: '14px' }} /> Find Websites</>
                        )}
                    </button>
                </div>
                <p className="text-small" style={{ marginBottom: '1rem', color: 'var(--text-dim)' }}>
                    Enter a topic above and click "Find Websites" to discover relevant resources for your research.
                </p>
                {websiteResults && websiteResults.length > 0 && (
                    <div className="card" style={{ background: 'var(--bg-secondary)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {websiteResults.map((site, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                    <ExternalLink style={{ width: '16px', height: '16px', color: 'var(--gold)', flexShrink: 0, marginTop: '0.25rem' }} />
                                    <div style={{ flex: 1 }}>
                                        <a href={site.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-primary)', fontWeight: 500, textDecoration: 'none' }}>
                                            {site.title}
                                        </a>
                                        <p className="text-small" style={{ marginTop: '0.25rem', color: 'var(--text-secondary)' }}>{site.description}</p>
                                        <p className="text-small" style={{ marginTop: '0.25rem', color: 'var(--text-dim)' }}>{site.url}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setBookmarkForm({ url: site.url, title: site.title, quote: '' });
                                            setShowBookmarkForm(true);
                                        }}
                                        className="btn-ghost"
                                        style={{ padding: '0.375rem', color: 'var(--gold)' }}
                                        title="Save as Bookmark"
                                    >
                                        <Bookmark style={{ width: '14px', height: '14px' }} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Bookmarks */}
            <div style={{ marginTop: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Bookmark style={{ width: '20px', height: '20px', color: 'var(--gold)' }} />
                        <h2 className="text-h2" style={{ margin: 0 }}>Bookmarks</h2>
                    </div>
                    <button onClick={() => setShowBookmarkForm(true)} className="btn btn-secondary">
                        <Plus style={{ width: '14px', height: '14px' }} />
                        Add Bookmark
                    </button>
                </div>

                {showBookmarkForm && (
                    <div className="card" style={{ marginBottom: '1rem', background: 'var(--bg-secondary)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <span className="text-label">New Bookmark</span>
                            <button onClick={() => setShowBookmarkForm(false)} className="btn-ghost" style={{ padding: '0.25rem' }}>
                                <X style={{ width: '16px', height: '16px' }} />
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <input
                                type="url"
                                value={bookmarkForm.url}
                                onChange={(e) => setBookmarkForm({ ...bookmarkForm, url: e.target.value })}
                                placeholder="https://example.com"
                                className="input"
                            />
                            <input
                                type="text"
                                value={bookmarkForm.title}
                                onChange={(e) => setBookmarkForm({ ...bookmarkForm, title: e.target.value })}
                                placeholder="Website title"
                                className="input"
                            />
                            <textarea
                                value={bookmarkForm.quote}
                                onChange={(e) => setBookmarkForm({ ...bookmarkForm, quote: e.target.value })}
                                placeholder="Optional quote or note..."
                                className="input"
                                rows={2}
                                style={{ resize: 'vertical' }}
                            />
                            <button
                                onClick={handleAddBookmark}
                                disabled={!bookmarkForm.url.trim() || !bookmarkForm.title.trim() || savingBookmark}
                                className="btn btn-primary"
                                style={{ alignSelf: 'flex-start' }}
                            >
                                {savingBookmark ? (
                                    <><Loader style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} /> Saving...</>
                                ) : (
                                    'Save Bookmark'
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {bookmarks.length === 0 ? (
                    <div className="panel" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
                        <Bookmark style={{ width: '36px', height: '36px', color: 'var(--text-dim)', margin: '0 auto 1rem' }} />
                        <p className="text-body">No bookmarks yet. Save useful websites for your research.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {bookmarks.map((bookmark) => (
                            <div key={bookmark.id} className="card" style={{ padding: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                            <a href={bookmark.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-primary)', fontWeight: 500, textDecoration: 'none' }}>
                                                {bookmark.title}
                                            </a>
                                            <ExternalLink style={{ width: '12px', height: '12px', color: 'var(--text-dim)' }} />
                                        </div>
                                        <p className="text-small" style={{ color: 'var(--text-dim)', marginBottom: bookmark.quote ? '0.5rem' : 0 }}>{bookmark.url}</p>
                                        {bookmark.quote && (
                                            <blockquote style={{
                                                borderLeft: '2px solid var(--gold)',
                                                paddingLeft: '0.75rem',
                                                margin: 0,
                                                fontStyle: 'italic',
                                                color: 'var(--text-secondary)',
                                                fontSize: '0.875rem'
                                            }}>
                                                "{bookmark.quote}"
                                            </blockquote>
                                        )}
                                        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <span className="text-small">{formatDate(bookmark.createdAt)}</span>
                                            {bookmark.story && (
                                                <span className="badge badge-gold" style={{ fontSize: '0.6875rem' }}>{bookmark.story.title}</span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteBookmark(bookmark.id)}
                                        className="btn-ghost"
                                        style={{ padding: '0.375rem', color: 'var(--text-dim)' }}
                                    >
                                        <Trash2 style={{ width: '14px', height: '14px' }} />
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
