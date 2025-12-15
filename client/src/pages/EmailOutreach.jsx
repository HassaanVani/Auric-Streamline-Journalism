import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowLeft,
    Send,
    Sparkles,
    RefreshCw,
    Copy,
    Check,
    Paperclip
} from 'lucide-react';

const recipient = {
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@berkeley.edu',
    role: 'Climate Scientist, UC Berkeley',
    initials: 'SC',
};

const tones = [
    { id: 'professional', label: 'Professional', desc: 'Formal and respectful' },
    { id: 'friendly', label: 'Friendly', desc: 'Warm but professional' },
    { id: 'brief', label: 'Brief', desc: 'Concise and direct' },
];

const sampleEmail = {
    subject: 'Interview Request: California Climate Policy Feature',
    body: `Dear Dr. Chen,

I hope this message finds you well. My name is John Doe, and I'm a journalist working on a feature story about California's evolving climate policy landscape.

Your research on the cap-and-trade system has been invaluable to my understanding of this complex topic. Would you be available for a brief 20-30 minute interview within the next two weeks?

Thank you for considering this request.

Best regards,
John Doe`
};

export function EmailOutreach() {
    const [subject, setSubject] = useState(sampleEmail.subject);
    const [body, setBody] = useState(sampleEmail.body);
    const [selectedTone, setSelectedTone] = useState('professional');
    const [isGenerating, setIsGenerating] = useState(false);
    const [copied, setCopied] = useState(false);
    const [purpose, setPurpose] = useState('Request interview for climate policy story');

    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => setIsGenerating(false), 2000);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(body);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="page-container">
            <Link to="/contacts" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.8125rem',
                color: 'var(--gold)',
                textDecoration: 'none',
                marginBottom: '2rem'
            }}>
                <ArrowLeft style={{ width: '16px', height: '16px' }} />
                Back to Sources
            </Link>

            <header className="page-header">
                <h1 className="text-h1" style={{ marginBottom: '0.5rem' }}>Compose Email</h1>
                <p className="text-body">Draft personalized outreach with AI assistance</p>
            </header>

            <div className="grid-main">
                <div>
                    {/* Recipient */}
                    <div className="card" style={{ marginBottom: '1.5rem' }}>
                        <p className="text-label" style={{ marginBottom: '0.75rem' }}>TO</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div className="avatar-lg">{recipient.initials}</div>
                            <div>
                                <p style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.125rem' }}>
                                    {recipient.name}
                                </p>
                                <p className="text-small">{recipient.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Purpose */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <p className="text-label" style={{ marginBottom: '0.625rem' }}>PURPOSE</p>
                        <input
                            type="text"
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                            placeholder="What's the purpose of this email?"
                            className="input"
                        />
                    </div>

                    {/* Tone */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <p className="text-label" style={{ marginBottom: '0.75rem' }}>TONE</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                            {tones.map((tone) => (
                                <button
                                    key={tone.id}
                                    onClick={() => setSelectedTone(tone.id)}
                                    className={`card ${selectedTone === tone.id ? 'card-interactive' : ''}`}
                                    style={{
                                        padding: '1rem',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        border: selectedTone === tone.id ? '1px solid var(--gold)' : '1px solid var(--border-subtle)',
                                        background: selectedTone === tone.id ? 'var(--gold-muted)' : 'var(--bg-secondary)'
                                    }}
                                >
                                    <p style={{
                                        fontSize: '0.875rem',
                                        fontWeight: 500,
                                        color: selectedTone === tone.id ? 'var(--gold)' : 'var(--text-primary)',
                                        marginBottom: '0.25rem'
                                    }}>
                                        {tone.label}
                                    </p>
                                    <p className="text-small">{tone.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Generate */}
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '0.875rem', marginBottom: '1.5rem' }}
                    >
                        {isGenerating ? (
                            <>
                                <RefreshCw style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles style={{ width: '18px', height: '18px' }} />
                                Generate Email
                            </>
                        )}
                    </button>

                    {/* Email Editor */}
                    <div className="panel">
                        <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
                            <p className="text-label" style={{ marginBottom: '0.5rem' }}>Subject</p>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                style={{
                                    width: '100%',
                                    fontSize: '1.125rem',
                                    fontWeight: 500,
                                    color: 'var(--text-primary)',
                                    background: 'transparent',
                                    border: 'none',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            style={{
                                width: '100%',
                                minHeight: '280px',
                                fontSize: '0.9375rem',
                                lineHeight: 1.7,
                                color: 'var(--text-secondary)',
                                background: 'transparent',
                                border: 'none',
                                outline: 'none',
                                resize: 'vertical'
                            }}
                        />
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn btn-ghost"><Paperclip style={{ width: '16px', height: '16px' }} /></button>
                            <button className="btn btn-secondary" onClick={handleCopy}>
                                {copied ? <Check style={{ width: '16px', height: '16px' }} /> : <Copy style={{ width: '16px', height: '16px' }} />}
                                {copied ? 'Copied' : 'Copy'}
                            </button>
                            <button className="btn btn-secondary" onClick={handleGenerate}>
                                <RefreshCw style={{ width: '16px', height: '16px' }} />
                                Regenerate
                            </button>
                        </div>
                        <button className="btn btn-primary">
                            <Send style={{ width: '16px', height: '16px' }} />
                            Send Email
                        </button>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="grid-sidebar">
                    <div className="panel panel-gold">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <Sparkles style={{ width: '16px', height: '16px', color: 'var(--gold)' }} />
                            <p className="text-label text-gold">AI TIPS</p>
                        </div>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                            {[
                                'Mention specific work to show familiarity',
                                'Keep the request clear and concise',
                                'Offer flexible scheduling options'
                            ].map((tip, i) => (
                                <li key={i} style={{ display: 'flex', gap: '0.625rem' }}>
                                    <span style={{ color: 'var(--gold)' }}>•</span>
                                    <span className="text-small" style={{ color: 'var(--text-secondary)' }}>{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="card">
                        <p className="text-label" style={{ marginBottom: '1rem' }}>CONTEXT</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ padding: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                                <p className="text-small text-muted" style={{ marginBottom: '0.25rem' }}>Story</p>
                                <p className="text-small" style={{ color: 'var(--text-primary)' }}>Climate Policy Reform</p>
                            </div>
                            <div style={{ padding: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                                <p className="text-small text-muted" style={{ marginBottom: '0.25rem' }}>Research</p>
                                <p className="text-small" style={{ color: 'var(--text-primary)' }}>AB 32, Cap-and-Trade</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmailOutreach;
