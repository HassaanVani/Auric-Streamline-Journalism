import { useState } from 'react';
import {
    Edit,
    CheckCircle,
    Lightbulb,
    Download,
    Share2,
    Eye,
    Type,
    FileText,
    Send
} from 'lucide-react';

const styleSuggestions = [
    { id: 1, type: 'clarity', original: 'The policy has been implemented in a manner that is quite effective.', suggestion: 'The policy has been effectively implemented.', reason: 'More concise' },
    { id: 2, type: 'tone', original: 'Officials claim the results are good.', suggestion: 'Officials report positive results.', reason: 'More neutral' },
];

const readabilityMetrics = { grade: 'B+', readingLevel: '10th Grade', avgSentenceLength: 18, passiveVoice: '8%', wordCount: 1247 };

const articleContent = `California's Bold Climate Agenda

California has long positioned itself as a leader in environmental policy.

The Cap-and-Trade Success Story

According to Dr. Sarah Chen, "The cap-and-trade program has been remarkably successful."

Community Impact

But success at the policy level doesn't always translate to success on the ground.`;

export function EditorialReview() {
    const [activeTab, setActiveTab] = useState('edit');
    const [content, setContent] = useState(articleContent);
    const [appliedIds, setAppliedIds] = useState([]);

    const applySuggestion = (id, original, suggestion) => {
        setContent(content.replace(original, suggestion));
        setAppliedIds([...appliedIds, id]);
    };

    return (
        <div className="page-container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                <div>
                    <h1 className="text-h1" style={{ marginBottom: '0.5rem' }}>Editorial Review</h1>
                    <p className="text-body">Final editing with AI-assisted suggestions</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="btn btn-secondary">
                        <Share2 style={{ width: '16px', height: '16px' }} />
                        Share
                    </button>
                    <button className="btn btn-secondary">
                        <Download style={{ width: '16px', height: '16px' }} />
                        Export
                    </button>
                    <button className="btn btn-primary">
                        <Send style={{ width: '16px', height: '16px' }} />
                        Publish
                    </button>
                </div>
            </header>

            <div className="grid-main">
                <div>
                    {/* Tabs */}
                    <div className="tabs" style={{ marginBottom: '1rem' }}>
                        {[
                            { id: 'edit', label: 'Edit', icon: Edit },
                            { id: 'preview', label: 'Preview', icon: Eye },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
                            >
                                <tab.icon style={{ width: '14px', height: '14px' }} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Editor */}
                    <div className="panel" style={{ marginBottom: '2rem', minHeight: '320px' }}>
                        {activeTab === 'edit' && (
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                style={{
                                    width: '100%',
                                    height: '320px',
                                    fontSize: '0.9375rem',
                                    lineHeight: 1.7,
                                    color: 'var(--text-secondary)',
                                    background: 'transparent',
                                    border: 'none',
                                    outline: 'none',
                                    resize: 'none'
                                }}
                            />
                        )}

                        {activeTab === 'preview' && (
                            <div style={{ padding: '2rem', background: '#fafafa', borderRadius: '12px' }}>
                                <article style={{ maxWidth: '560px', margin: '0 auto' }}>
                                    {content.split('\n\n').map((para, i) => {
                                        if (i === 0) return <h1 key={i} style={{ fontFamily: "'Newsreader', serif", fontSize: '2rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '1.5rem' }}>{para}</h1>;
                                        if (para.length < 40) return <h2 key={i} style={{ fontFamily: "'Newsreader', serif", fontSize: '1.25rem', fontWeight: 600, color: '#333', marginTop: '2rem', marginBottom: '1rem' }}>{para}</h2>;
                                        return <p key={i} style={{ color: '#444', marginBottom: '1rem', lineHeight: 1.7 }}>{para}</p>;
                                    })}
                                </article>
                            </div>
                        )}
                    </div>

                    {/* Suggestions */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Lightbulb style={{ width: '16px', height: '16px', color: 'var(--gold)' }} />
                                <span className="text-h3">Style Suggestions</span>
                            </div>
                            <span className="badge badge-gold">{styleSuggestions.length - appliedIds.length} remaining</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {styleSuggestions.filter(s => !appliedIds.includes(s.id)).map((s) => (
                                <div key={s.id} className="card" style={{ background: 'var(--bg-tertiary)' }}>
                                    <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>{s.type}</span>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1rem' }}>
                                        <div>
                                            <p className="text-small text-muted" style={{ marginBottom: '0.375rem' }}>Original</p>
                                            <p className="text-small" style={{ textDecoration: 'line-through', color: 'var(--text-muted)' }}>{s.original}</p>
                                        </div>
                                        <div>
                                            <p className="text-small text-muted" style={{ marginBottom: '0.375rem' }}>Suggestion</p>
                                            <p className="text-small text-gold">{s.suggestion}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span className="text-small text-muted">{s.reason}</span>
                                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                                            <button style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                                Dismiss
                                            </button>
                                            <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }} onClick={() => applySuggestion(s.id, s.original, s.suggestion)}>
                                                Apply
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {appliedIds.length === styleSuggestions.length && (
                                <div style={{ textAlign: 'center', padding: '2.5rem' }}>
                                    <CheckCircle style={{ width: '48px', height: '48px', color: 'var(--success)', margin: '0 auto 1rem' }} />
                                    <p className="text-h3">All suggestions reviewed!</p>
                                    <p className="text-small">Your article is ready for publication</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="grid-sidebar">
                    <div className="card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <Type style={{ width: '16px', height: '16px', color: 'var(--gold)' }} />
                            <p className="text-label">READABILITY</p>
                        </div>
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '72px',
                                height: '72px',
                                borderRadius: '16px',
                                background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)',
                                fontSize: '1.75rem',
                                fontWeight: 700,
                                color: 'var(--bg-primary)'
                            }}>
                                {readabilityMetrics.grade}
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {Object.entries(readabilityMetrics).filter(([k]) => k !== 'grade').map(([key, val]) => (
                                <div key={key} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span className="text-small" style={{ textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</span>
                                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>{val}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card">
                        <p className="text-label" style={{ marginBottom: '1rem' }}>EXPORT OPTIONS</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {['Word Document', 'PDF', 'Plain Text', 'HTML'].map((fmt) => (
                                <button
                                    key={fmt}
                                    className="btn-ghost"
                                    style={{ width: '100%', justifyContent: 'flex-start', padding: '0.75rem' }}
                                >
                                    <FileText style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                                    {fmt}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditorialReview;
