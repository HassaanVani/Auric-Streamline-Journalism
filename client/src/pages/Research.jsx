import { useState } from 'react';
import {
    Search,
    Sparkles,
    ExternalLink,
    Send,
    Folder,
    ChevronRight,
    Plus
} from 'lucide-react';

const results = [
    {
        id: 1,
        title: 'The New Era of Central Bank Policy and Global Markets',
        excerpt: 'Analysis of recent rate adjustments and their long-term impact on international trade agreements and emerging economies.',
        source: 'The Financial Times',
        date: 'Oct 26, 2023',
    },
    {
        id: 2,
        title: 'California Cap-and-Trade: A Decade of Results',
        excerpt: 'Comprehensive review of the state\'s emissions trading system, examining economic impacts across industrial sectors.',
        source: 'Environmental Research Institute',
        date: 'Nov 12, 2023',
    },
    {
        id: 3,
        title: 'Community Perspectives on Climate Action',
        excerpt: 'Grassroots movements and local government initiatives pushing for more aggressive climate policies.',
        source: 'Bay Area Monitor',
        date: 'Dec 3, 2023',
    },
];

const savedItems = [
    { title: 'Report: Green Energy Transition', type: 'PDF' },
    { title: 'Data: Q3 GDP Growth', type: 'Chart' },
    { title: 'Article: The Future of Work', type: 'Analysis' },
];

const aiMessages = [
    { role: 'user', content: 'Summarize the key takeaways on current inflation trends.' },
    {
        role: 'assistant', content: `Here's a synthesis of the latest research:

1. **Persistent Core Inflation**: Core services inflation remains sticky in major economies.

2. **Energy Volatility**: Geopolitical tensions creating uncertainty in energy markets.

3. **Wage-Price Concerns**: Central banks monitoring wage growth data closely.` },
];

const breadcrumbs = ['Home', 'Topics', 'Global Economics', 'Current Analysis'];

export function Research() {
    const [query, setQuery] = useState('');
    const [aiInput, setAiInput] = useState('');

    return (
        <div className="page-container">
            {/* Search Bar */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ position: 'relative', maxWidth: '720px' }}>
                    <Search style={{
                        position: 'absolute',
                        left: '1.25rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '20px',
                        height: '20px',
                        color: query ? 'var(--gold)' : 'var(--text-dim)'
                    }} />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Research Auric: Ask anything, explore threads..."
                        className="input-lg"
                        style={{ width: '100%', paddingLeft: '3.5rem' }}
                    />
                </div>
            </div>

            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                {breadcrumbs.map((item, i) => (
                    <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {i > 0 && <ChevronRight style={{ width: '12px', height: '12px', color: 'var(--text-dim)' }} />}
                        <span style={{
                            fontSize: '0.8125rem',
                            color: i === breadcrumbs.length - 1 ? 'var(--text-primary)' : 'var(--gold)',
                            cursor: i < breadcrumbs.length - 1 ? 'pointer' : 'default'
                        }}>
                            {item}
                        </span>
                    </span>
                ))}
            </div>

            <div className="grid-main">
                {/* Results */}
                <div>
                    {results.map((result, i) => (
                        <article key={result.id} style={{ marginBottom: '2.5rem' }}>
                            <h2 className="text-h2" style={{ marginBottom: '0.75rem', cursor: 'pointer' }}>
                                {result.title}
                            </h2>

                            <p className="text-body" style={{ marginBottom: '1rem', maxWidth: '640px' }}>
                                {result.excerpt}
                            </p>

                            <p className="text-small">
                                Source: <span style={{ color: 'var(--gold)' }}>{result.source}</span>, {result.date}
                            </p>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1rem' }}>
                                <div className="progress-bar" style={{ flex: 1, maxWidth: '300px' }}>
                                    <div className="progress-fill" style={{ width: '60%' }} />
                                </div>
                                <span className="badge badge-gold">Relevant</span>
                            </div>

                            {i < results.length - 1 && <div className="divider" style={{ marginTop: '2.5rem' }} />}
                        </article>
                    ))}

                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <button className="btn btn-secondary">
                            <Plus style={{ width: '16px', height: '16px' }} />
                            New Research Thread
                        </button>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="grid-sidebar">
                    {/* Saved Items */}
                    <div className="card">
                        <p className="text-label" style={{ marginBottom: '1rem' }}>SAVED ITEMS</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {savedItems.map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                    <Folder style={{ width: '16px', height: '16px', color: 'var(--gold)' }} />
                                    <span className="text-small" style={{ color: 'var(--text-secondary)', flex: 1 }}>{item.title}</span>
                                    <span className="text-small text-dim">({item.type})</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AI Chat */}
                    <div className="panel panel-gold" style={{ display: 'flex', flexDirection: 'column', height: '420px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <Sparkles style={{ width: '16px', height: '16px', color: 'var(--gold)' }} />
                            <p className="text-label text-gold">AURIC AI ASSISTANT</p>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
                            {aiMessages.map((msg, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                                    <div style={{
                                        maxWidth: '90%',
                                        padding: '0.875rem 1rem',
                                        borderRadius: '12px',
                                        background: msg.role === 'user' ? 'var(--gold-muted)' : 'var(--bg-tertiary)',
                                        border: msg.role === 'user' ? 'none' : '1px solid var(--border-subtle)'
                                    }}>
                                        <p style={{
                                            fontSize: '0.8125rem',
                                            lineHeight: 1.6,
                                            color: 'var(--text-secondary)',
                                            whiteSpace: 'pre-wrap'
                                        }}>
                                            {msg.content}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                value={aiInput}
                                onChange={(e) => setAiInput(e.target.value)}
                                placeholder="Ask Auric AI..."
                                className="input"
                                style={{ paddingRight: '3rem' }}
                            />
                            <button style={{
                                position: 'absolute',
                                right: '0.75rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--gold)'
                            }}>
                                <Send style={{ width: '16px', height: '16px' }} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Research;
