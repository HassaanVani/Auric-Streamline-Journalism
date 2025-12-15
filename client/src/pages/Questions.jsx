import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowLeft,
    Sparkles,
    RefreshCw,
    Edit,
    Save,
    Copy,
    Check,
    Plus
} from 'lucide-react';

const context = {
    contact: { name: 'Dr. Sarah Chen', role: 'Climate Scientist, UC Berkeley' },
    story: 'Climate Policy Reform in California',
    topics: ['AB 32', 'Cap-and-Trade', 'Community Impact'],
};

const sampleQuestions = [
    {
        category: 'Background',
        question: "Can you walk me through your research on California's cap-and-trade system?",
        followUp: 'What surprised you most during your research?',
        priority: 'high',
    },
    {
        category: 'Analysis',
        question: 'How would you assess the overall effectiveness of AB 32?',
        followUp: 'What metrics do you consider most important?',
        priority: 'high',
    },
    {
        category: 'Impact',
        question: 'What impacts have you observed on local communities?',
        followUp: 'Have there been unintended consequences?',
        priority: 'medium',
    },
];

export function Questions() {
    const [questions] = useState(sampleQuestions);
    const [isGenerating, setIsGenerating] = useState(false);
    const [copiedIdx, setCopiedIdx] = useState(null);
    const [researchGaps, setResearchGaps] = useState('');

    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => setIsGenerating(false), 2000);
    };

    const handleCopy = (idx, text) => {
        navigator.clipboard.writeText(text);
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 2000);
    };

    return (
        <div className="page-container">
            <Link to="/contacts/1" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.8125rem',
                color: 'var(--gold)',
                textDecoration: 'none',
                marginBottom: '2rem'
            }}>
                <ArrowLeft style={{ width: '16px', height: '16px' }} />
                Back to Contact
            </Link>

            <header className="page-header">
                <h1 className="text-h1" style={{ marginBottom: '0.5rem' }}>Interview Questions</h1>
                <p className="text-body">AI-generated questions for your interview with {context.contact.name}</p>
            </header>

            <div className="grid-main">
                <div>
                    {/* Research Gaps */}
                    <div className="card" style={{ marginBottom: '2rem' }}>
                        <p className="text-label" style={{ marginBottom: '0.625rem' }}>RESEARCH GAPS</p>
                        <textarea
                            value={researchGaps}
                            onChange={(e) => setResearchGaps(e.target.value)}
                            rows={3}
                            placeholder="E.g., Need more data on community-level impacts..."
                            className="input"
                            style={{ resize: 'vertical', marginBottom: '1rem' }}
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                        >
                            {isGenerating ? (
                                <>
                                    <RefreshCw style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles style={{ width: '16px', height: '16px' }} />
                                    Generate Questions
                                </>
                            )}
                        </button>
                    </div>

                    {/* Questions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {questions.map((q, idx) => (
                            <div key={idx} className="card">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem' }}>
                                    <span className="text-mono text-muted">{String(idx + 1).padStart(2, '0')}</span>
                                    <span className="badge">{q.category}</span>
                                    <span className={`badge ${q.priority === 'high' ? 'badge-gold' : ''}`}>{q.priority}</span>
                                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.25rem' }}>
                                        <button
                                            className="btn-ghost"
                                            onClick={() => handleCopy(idx, q.question)}
                                            style={{ padding: '0.375rem' }}
                                        >
                                            {copiedIdx === idx
                                                ? <Check style={{ width: '16px', height: '16px', color: 'var(--success)' }} />
                                                : <Copy style={{ width: '16px', height: '16px' }} />
                                            }
                                        </button>
                                        <button className="btn-ghost" style={{ padding: '0.375rem' }}>
                                            <Edit style={{ width: '16px', height: '16px' }} />
                                        </button>
                                    </div>
                                </div>

                                <p style={{ fontSize: '1.0625rem', color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                                    {q.question}
                                </p>

                                {q.followUp && (
                                    <div style={{ paddingLeft: '1rem', borderLeft: '2px solid var(--gold)', opacity: 0.9 }}>
                                        <p className="text-small text-gold" style={{ marginBottom: '0.25rem' }}>Follow-up</p>
                                        <p className="text-small" style={{ color: 'var(--text-secondary)' }}>{q.followUp}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Add Question */}
                    <button style={{
                        width: '100%',
                        padding: '1.25rem',
                        marginTop: '1rem',
                        border: '1px dashed var(--border-default)',
                        borderRadius: '12px',
                        background: 'transparent',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem'
                    }}>
                        <Plus style={{ width: '16px', height: '16px' }} />
                        Add custom question
                    </button>
                </div>

                {/* Sidebar */}
                <div className="grid-sidebar">
                    <div className="card">
                        <p className="text-label" style={{ marginBottom: '1rem' }}>INTERVIEW CONTEXT</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <p className="text-small text-muted" style={{ marginBottom: '0.25rem' }}>Source</p>
                                <p style={{ fontSize: '0.9375rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                                    {context.contact.name}
                                </p>
                                <p className="text-small">{context.contact.role}</p>
                            </div>
                            <div>
                                <p className="text-small text-muted" style={{ marginBottom: '0.25rem' }}>Story</p>
                                <p className="text-small" style={{ color: 'var(--text-primary)' }}>{context.story}</p>
                            </div>
                            <div>
                                <p className="text-small text-muted" style={{ marginBottom: '0.5rem' }}>Topics</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                                    {context.topics.map((t) => <span key={t} className="badge">{t}</span>)}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <button className="btn btn-secondary" style={{ width: '100%' }}>
                            <Save style={{ width: '16px', height: '16px' }} />
                            Save Questions
                        </button>
                        <button className="btn btn-secondary" style={{ width: '100%' }}>
                            <Copy style={{ width: '16px', height: '16px' }} />
                            Copy All
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Questions;
