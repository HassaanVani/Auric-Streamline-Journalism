import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import {
    CheckCircle,
    FileText,
    Send,
    Loader,
    Sparkles,
    Clock
} from 'lucide-react';

export function EditorialReview() {
    const api = useApi();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedArticle, setSelectedArticle] = useState(null);

    useEffect(() => {
        loadArticles();
    }, []);

    const loadArticles = async () => {
        try {
            const data = await api.get('/articles');
            setArticles(data);
            // Auto-select first article if any
            if (data.length > 0) {
                setSelectedArticle(data[0]);
            }
        } catch (err) {
            console.error('Failed to load articles:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (articleId, newStatus) => {
        try {
            const updated = await api.put(`/articles/${articleId}`, { status: newStatus });
            setArticles(articles.map(a => a.id === articleId ? updated : a));
            if (selectedArticle?.id === articleId) {
                setSelectedArticle(updated);
            }
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            draft: { bg: 'var(--bg-tertiary)', color: 'var(--text-dim)' },
            review: { bg: 'var(--gold-muted)', color: 'var(--gold)' },
            approved: { bg: 'rgba(46, 160, 67, 0.2)', color: 'var(--success)' },
            published: { bg: 'rgba(46, 160, 67, 0.3)', color: 'var(--success)' }
        };
        const style = styles[status] || styles.draft;
        return (
            <span style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 500,
                background: style.bg,
                color: style.color,
                textTransform: 'capitalize'
            }}>
                {status}
            </span>
        );
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
                <h1 className="text-h1" style={{ marginBottom: '0.5rem' }}>Editorial Review</h1>
                <p className="text-body">Review and approve article drafts before publishing.</p>
            </header>

            {articles.length === 0 ? (
                <div className="panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <FileText style={{ width: '48px', height: '48px', color: 'var(--gold)', margin: '0 auto 1.5rem' }} />
                    <h2 className="text-h2" style={{ marginBottom: '0.75rem' }}>No articles to review</h2>
                    <p className="text-body" style={{ maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                        Create article drafts first, then submit them for editorial review.
                    </p>
                </div>
            ) : (
                <div className="grid-main">
                    {/* Article List */}
                    <div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {articles.map(article => (
                                <div
                                    key={article.id}
                                    onClick={() => setSelectedArticle(article)}
                                    className="card card-interactive"
                                    style={{
                                        cursor: 'pointer',
                                        borderColor: selectedArticle?.id === article.id ? 'var(--gold)' : undefined
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                                                {article.title}
                                            </h3>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <span className="text-small">{article.story?.title}</span>
                                                <span className="text-small" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    <Clock style={{ width: '12px', height: '12px' }} />
                                                    {formatDate(article.updatedAt)}
                                                </span>
                                            </div>
                                        </div>
                                        {getStatusBadge(article.status)}
                                    </div>
                                    {article.content && (
                                        <p className="text-small" style={{ marginTop: '0.75rem', opacity: 0.7 }}>
                                            {article.content.substring(0, 150)}...
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar - Article Actions */}
                    <div className="grid-sidebar">
                        {selectedArticle && (
                            <div className="card">
                                <p className="text-label" style={{ marginBottom: '1rem' }}>ARTICLE STATUS</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {['draft', 'review', 'approved', 'published'].map(status => (
                                        <button
                                            key={status}
                                            onClick={() => handleStatusChange(selectedArticle.id, status)}
                                            className={`btn ${selectedArticle.status === status ? 'btn-primary' : 'btn-secondary'}`}
                                            style={{ justifyContent: 'flex-start', textTransform: 'capitalize' }}
                                        >
                                            {status === 'approved' && <CheckCircle style={{ width: '16px', height: '16px' }} />}
                                            {status === 'published' && <Send style={{ width: '16px', height: '16px' }} />}
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="panel panel-gold">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                <Sparkles style={{ width: '16px', height: '16px', color: 'var(--gold)' }} />
                                <span className="text-label text-gold">AI REVIEW ASSISTANT</span>
                            </div>
                            <p className="text-body" style={{ marginBottom: '1rem' }}>
                                Get AI-powered suggestions for style, clarity, and factual consistency.
                            </p>
                            <p className="text-small" style={{ opacity: 0.8 }}>
                                Requires OpenAI API key. Configure in Settings → API Keys.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EditorialReview;
