import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    FileText,
    Search,
    Play,
    Pause,
    Clock,
    Quote,
    Download,
    Sparkles,
    ArrowLeft,
    Flag,
    Copy,
    Check,
    User
} from 'lucide-react';

const transcripts = [
    { id: 1, title: 'Interview with Dr. Sarah Chen', date: 'Dec 10, 2024', duration: '28:45', source: 'Dr. Sarah Chen', highlights: 5 },
    { id: 2, title: 'City Council Press Briefing', date: 'Dec 8, 2024', duration: '42:10', source: 'Mayor Wilson', highlights: 3 },
];

const sampleTranscript = [
    { time: '00:00', speaker: 'John Doe', text: "Good morning, Dr. Chen. Thank you for speaking with me today." },
    { time: '00:15', speaker: 'Dr. Sarah Chen', text: "Thank you for having me. I'm happy to share my perspective." },
    { time: '00:25', speaker: 'John Doe', text: "Let's start with cap-and-trade. How would you assess its effectiveness?" },
    { time: '00:35', speaker: 'Dr. Sarah Chen', text: "The cap-and-trade program has been remarkably successful. We've seen a 20% reduction in covered emissions since 2013.", highlighted: true },
    { time: '01:15', speaker: 'John Doe', text: "That's significant. What do you see as the main challenges?" },
    { time: '01:25', speaker: 'Dr. Sarah Chen', text: "The biggest challenge is extending these policies to harder sectors like heavy industry.", highlighted: true },
];

export function Transcripts() {
    const [selected, setSelected] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [copiedIdx, setCopiedIdx] = useState(null);

    const handleCopy = (idx, text) => {
        navigator.clipboard.writeText(text);
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 2000);
    };

    if (selected) {
        return (
            <div className="page-container">
                <button
                    onClick={() => setSelected(null)}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.8125rem',
                        color: 'var(--gold)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        marginBottom: '2rem'
                    }}
                >
                    <ArrowLeft style={{ width: '16px', height: '16px' }} />
                    Back to Transcripts
                </button>

                <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <div>
                        <h1 className="text-h2" style={{ marginBottom: '0.375rem' }}>{selected.title}</h1>
                        <p className="text-small">{selected.date} • {selected.duration}</p>
                    </div>
                    <button className="btn btn-secondary">
                        <Download style={{ width: '16px', height: '16px' }} />
                        Export
                    </button>
                </header>

                {/* Player */}
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                background: 'var(--gold)',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {isPlaying
                                ? <Pause style={{ width: '20px', height: '20px', color: 'var(--bg-primary)' }} />
                                : <Play style={{ width: '20px', height: '20px', color: 'var(--bg-primary)', marginLeft: '2px' }} />
                            }
                        </button>
                        <div style={{ flex: 1 }}>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: '33%' }} />
                            </div>
                        </div>
                        <span className="text-mono text-muted">09:15 / 28:45</span>
                    </div>
                </div>

                {/* Transcript */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {sampleTranscript.map((seg, idx) => (
                        <div
                            key={idx}
                            className="card"
                            style={{
                                background: seg.highlighted ? 'var(--gold-muted)' : 'var(--bg-secondary)',
                                borderColor: seg.highlighted ? 'rgba(212, 168, 83, 0.3)' : 'var(--border-subtle)'
                            }}
                        >
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div className="avatar" style={{ width: '40px', height: '40px', fontSize: '0.75rem' }}>
                                    {seg.speaker.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                        <span style={{ fontWeight: 500, color: seg.highlighted ? 'var(--gold)' : 'var(--text-primary)' }}>
                                            {seg.speaker}
                                        </span>
                                        <span className="text-mono text-muted">{seg.time}</span>
                                        {seg.highlighted && <span className="badge badge-gold">Key Quote</span>}
                                    </div>
                                    <p className="text-body">{seg.text}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.25rem' }}>
                                    <button className="btn-ghost" onClick={() => handleCopy(idx, seg.text)} style={{ padding: '0.375rem' }}>
                                        {copiedIdx === idx
                                            ? <Check style={{ width: '16px', height: '16px', color: 'var(--success)' }} />
                                            : <Copy style={{ width: '16px', height: '16px' }} />
                                        }
                                    </button>
                                    <button className="btn-ghost" style={{ padding: '0.375rem' }}>
                                        <Flag style={{ width: '16px', height: '16px' }} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                <div>
                    <h1 className="text-h1" style={{ marginBottom: '0.5rem' }}>Transcripts</h1>
                    <p className="text-body" style={{ maxWidth: '400px' }}>AI-powered transcription with quote highlighting</p>
                </div>
                <button className="btn btn-primary">
                    <Sparkles style={{ width: '16px', height: '16px' }} />
                    Upload Recording
                </button>
            </header>

            <div style={{ position: 'relative', maxWidth: '400px', marginBottom: '2rem' }}>
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search transcripts..."
                    className="input"
                    style={{ paddingLeft: '3rem' }}
                />
            </div>

            <div className="grid-main">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {transcripts.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setSelected(t)}
                            className="card card-interactive"
                            style={{ display: 'flex', gap: '1.25rem', textAlign: 'left', cursor: 'pointer' }}
                        >
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '12px',
                                background: 'var(--bg-tertiary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                <FileText style={{ width: '24px', height: '24px', color: 'var(--text-muted)' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
                                    {t.title}
                                </h3>
                                <div style={{ display: 'flex', gap: '1.25rem' }}>
                                    <span className="text-small" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                        <User style={{ width: '14px', height: '14px' }} /> {t.source}
                                    </span>
                                    <span className="text-small" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                        <Clock style={{ width: '14px', height: '14px' }} /> {t.duration}
                                    </span>
                                    <span className="text-small">{t.date}</span>
                                </div>
                            </div>
                            {t.highlights > 0 && <span className="badge badge-gold">{t.highlights} highlights</span>}
                        </button>
                    ))}
                </div>

                <div className="grid-sidebar">
                    <div className="panel panel-gold">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <Quote style={{ width: '16px', height: '16px', color: 'var(--gold)' }} />
                            <p className="text-label text-gold">RECENT KEY QUOTES</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {sampleTranscript.filter(s => s.highlighted).map((s, i) => (
                                <div key={i} style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '8px', borderLeft: '2px solid var(--gold)' }}>
                                    <p className="text-small" style={{ fontStyle: 'italic', marginBottom: '0.375rem' }}>
                                        "{s.text.slice(0, 60)}..."
                                    </p>
                                    <p className="text-small text-muted">— {s.speaker}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card">
                        <p className="text-label" style={{ marginBottom: '1rem' }}>STATISTICS</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {[
                                { label: 'Total transcripts', value: '8' },
                                { label: 'Total duration', value: '4h 32m' },
                                { label: 'Key quotes', value: '24', color: 'var(--gold)' },
                            ].map((stat) => (
                                <div key={stat.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span className="text-small">{stat.label}</span>
                                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: stat.color || 'var(--text-primary)' }}>
                                        {stat.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Transcripts;
