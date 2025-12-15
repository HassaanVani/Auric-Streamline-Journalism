import { useState } from 'react';
import {
    Sparkles,
    RefreshCw,
    Save,
    Download,
    Eye,
    Edit,
    CheckCircle,
    AlertTriangle,
    List,
    BookOpen
} from 'lucide-react';

const stories = [
    { id: 1, title: 'Climate Policy Reform', status: 'draft', progress: 65 },
    { id: 2, title: 'Tech Layoffs Analysis', status: 'outline', progress: 25 },
];

const sampleDraft = `# California's Bold Climate Agenda

California has long positioned itself as a leader in environmental policy.

## The Cap-and-Trade Success Story

According to Dr. Sarah Chen, "The cap-and-trade program has been remarkably successful. We've seen a 20% reduction in covered emissions since 2013."

## Community Impact

But success at the policy level doesn't always translate to success on the ground.`;

const factChecks = [
    { claim: '20% reduction since 2013', status: 'verified', source: 'CARB Report' },
    { claim: '$15 billion in revenue', status: 'pending', source: 'Pending verification' },
];

const outline = [
    { section: 'Introduction', status: 'complete' },
    { section: 'Cap-and-Trade', status: 'complete' },
    { section: 'Community Impact', status: 'in_progress' },
    { section: 'Conclusion', status: 'pending' },
];

export function ArticleDraft() {
    const [activeTab, setActiveTab] = useState('editor');
    const [content, setContent] = useState(sampleDraft);
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedStory, setSelectedStory] = useState(stories[0]);

    return (
        <div className="page-container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                <div>
                    <h1 className="text-h1" style={{ marginBottom: '0.5rem' }}>Article Drafting</h1>
                    <p className="text-body">AI-assisted drafting from research and interviews</p>
                </div>
                <button className="btn btn-primary">
                    <Sparkles style={{ width: '16px', height: '16px' }} />
                    New Draft
                </button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr 280px', gap: '2rem' }}>
                {/* Stories */}
                <div>
                    <p className="text-label" style={{ marginBottom: '1rem' }}>STORIES</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {stories.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => setSelectedStory(s)}
                                className="card"
                                style={{
                                    padding: '1rem',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    borderColor: selectedStory.id === s.id ? 'var(--gold)' : 'var(--border-subtle)',
                                    background: selectedStory.id === s.id ? 'var(--gold-muted)' : 'var(--bg-secondary)'
                                }}
                            >
                                <p style={{ fontSize: '0.875rem', fontWeight: 500, color: selectedStory.id === s.id ? 'var(--gold)' : 'var(--text-primary)', marginBottom: '0.5rem' }}>
                                    {s.title}
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span className={`badge ${s.status === 'draft' ? 'badge-gold' : ''}`}>{s.status}</span>
                                    <span className="text-small">{s.progress}%</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Editor */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div className="tabs">
                            {[
                                { id: 'editor', label: 'Editor', icon: Edit },
                                { id: 'preview', label: 'Preview', icon: Eye },
                                { id: 'outline', label: 'Outline', icon: List },
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
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                            <button className="btn-ghost" style={{ padding: '0.5rem' }}>
                                <RefreshCw style={{ width: '16px', height: '16px' }} />
                            </button>
                            <button className="btn-ghost" style={{ padding: '0.5rem' }}>
                                <Save style={{ width: '16px', height: '16px' }} />
                            </button>
                            <button className="btn-ghost" style={{ padding: '0.5rem' }}>
                                <Download style={{ width: '16px', height: '16px' }} />
                            </button>
                        </div>
                    </div>

                    <div className="panel" style={{ minHeight: '400px' }}>
                        {activeTab === 'editor' && (
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                style={{
                                    width: '100%',
                                    height: '400px',
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: '0.875rem',
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
                            <div style={{ padding: '1rem' }}>
                                {content.split('\n').map((line, i) => {
                                    if (line.startsWith('# ')) return <h1 key={i} className="text-h2" style={{ marginBottom: '1rem' }}>{line.slice(2)}</h1>;
                                    if (line.startsWith('## ')) return <h2 key={i} className="text-h3" style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>{line.slice(3)}</h2>;
                                    if (line.trim()) return <p key={i} className="text-body" style={{ marginBottom: '0.75rem' }}>{line}</p>;
                                    return null;
                                })}
                            </div>
                        )}

                        {activeTab === 'outline' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {outline.map((item, i) => (
                                    <div key={i} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            {item.status === 'complete' && <CheckCircle style={{ width: '18px', height: '18px', color: 'var(--success)' }} />}
                                            {item.status === 'in_progress' && <RefreshCw style={{ width: '18px', height: '18px', color: 'var(--gold)', animation: 'spin 2s linear infinite' }} />}
                                            {item.status === 'pending' && <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid var(--text-dim)' }} />}
                                            <span style={{ color: 'var(--text-primary)' }}>{item.section}</span>
                                        </div>
                                        <span className={`badge ${item.status === 'complete' ? 'badge-success' : item.status === 'in_progress' ? 'badge-gold' : ''}`}>
                                            {item.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="grid-sidebar">
                    <div className="panel panel-gold">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <AlertTriangle style={{ width: '16px', height: '16px', color: 'var(--gold)' }} />
                            <p className="text-label text-gold">FACT CHECKS</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {factChecks.map((f, i) => (
                                <div
                                    key={i}
                                    className="card"
                                    style={{
                                        padding: '0.75rem',
                                        background: f.status === 'verified' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(251, 191, 36, 0.1)',
                                        borderColor: f.status === 'verified' ? 'rgba(74, 222, 128, 0.3)' : 'rgba(251, 191, 36, 0.3)'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                                        {f.status === 'verified'
                                            ? <CheckCircle style={{ width: '14px', height: '14px', color: 'var(--success)', marginTop: '2px' }} />
                                            : <AlertTriangle style={{ width: '14px', height: '14px', color: 'var(--warning)', marginTop: '2px' }} />
                                        }
                                        <div>
                                            <p className="text-small" style={{ color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{f.claim}</p>
                                            <p className="text-small text-muted">{f.source}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <BookOpen style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                            <p className="text-label">SOURCES</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {['Dr. Sarah Chen Interview', 'CARB 2023 Report', 'AB 32 Documentation'].map((s) => (
                                <div key={s} style={{ padding: '0.625rem', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                                    <span className="text-small">{s}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ArticleDraft;
