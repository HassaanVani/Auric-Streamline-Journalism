import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Plus,
    Clock,
    FileText,
    Calendar,
    Sparkles,
    ArrowRight,
    Edit,
    Upload,
    MessageSquare
} from 'lucide-react';

const currentStory = {
    title: 'Climate Policy Reform in California',
    subtitle: 'Investigating the impact of AB 32 on local communities and industries',
    status: 'In Progress',
    progress: 65,
    lastUpdated: '2 hours ago',
};

const storyElements = [
    { title: 'Background Research', status: 'complete', count: 12 },
    { title: 'Sources Identified', status: 'active', count: 4 },
    { title: 'Interviews Scheduled', status: 'pending', count: 2 },
    { title: 'Article Draft', status: 'pending', count: 0 },
];

const sources = [
    { name: 'Dr. Sarah Chen', role: 'Climate Scientist', org: 'UC Berkeley', initials: 'SC' },
    { name: 'Mayor James Wilson', role: 'Mayor', org: 'City of Oakland', initials: 'JW' },
    { name: 'Lisa Martinez', role: 'Community Organizer', org: 'Bay Area Coalition', initials: 'LM' },
];

const aiSuggestions = [
    'Consider reaching out to state legislators for policy perspective',
    'EPA released new report yesterday that may be relevant',
];

const quickActions = [
    { icon: Edit, label: 'Add Note' },
    { icon: Upload, label: 'Import' },
    { icon: Calendar, label: 'Schedule' },
    { icon: FileText, label: 'Report' },
];

export function Dashboard() {
    return (
        <div className="page-container">
            {/* Page Header */}
            <header className="page-header">
                <p className="text-label" style={{ marginBottom: '1rem' }}>CURRENT STORY</p>
                <h1 className="text-display" style={{ marginBottom: '0.75rem' }}>{currentStory.title}</h1>
                <p className="text-body" style={{ marginBottom: '2rem', maxWidth: '600px' }}>{currentStory.subtitle}</p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <span className="badge badge-gold">{currentStory.status}</span>
                    <span className="text-small" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock style={{ width: '14px', height: '14px' }} />
                        Updated {currentStory.lastUpdated}
                    </span>
                </div>

                <div style={{ maxWidth: '500px' }}>
                    <div className="progress-bar" style={{ marginBottom: '0.5rem' }}>
                        <div className="progress-fill" style={{ width: `${currentStory.progress}%` }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span className="text-small">Research</span>
                        <span className="text-small text-gold" style={{ fontWeight: 600 }}>{currentStory.progress}%</span>
                        <span className="text-small">Published</span>
                    </div>
                </div>
            </header>

            {/* Main Grid */}
            <div className="grid-main">
                {/* Left Content */}
                <div>
                    {/* Story Elements */}
                    <section className="section">
                        <h2 className="text-h3" style={{ marginBottom: '1.5rem' }}>Story Elements</h2>

                        <div className="timeline">
                            {storyElements.map((item, i) => (
                                <div key={i} className="timeline-item">
                                    <div className={`timeline-dot ${item.status === 'complete' ? 'complete' : ''}`}
                                        style={item.status === 'active' ? { background: 'var(--gold)', boxShadow: '0 0 8px rgba(212, 168, 83, 0.5)' } : {}} />
                                    <div>
                                        <p style={{
                                            fontSize: '1rem',
                                            fontWeight: 500,
                                            color: item.status === 'active' ? 'var(--gold)' : 'var(--text-primary)',
                                            marginBottom: '0.25rem'
                                        }}>
                                            {item.title}
                                        </p>
                                        <p className="text-small">{item.count} items</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Sources */}
                    <section className="section">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 className="text-h3">Sources</h2>
                            <Link to="/contacts" className="text-small text-gold" style={{ textDecoration: 'none' }}>
                                View all →
                            </Link>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {sources.map((source, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div className="avatar">{source.initials}</div>
                                    <div>
                                        <p style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.125rem' }}>
                                            {source.name}
                                        </p>
                                        <p className="text-small">{source.role}, {source.org}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Story Overview Panel */}
                    <section className="panel" style={{ marginTop: '2rem' }}>
                        <p className="text-label">STORY OVERVIEW</p>

                        <div style={{
                            aspectRatio: '16/9',
                            background: 'var(--bg-tertiary)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: '1rem'
                        }}>
                            <span className="text-small">Story visualization</span>
                        </div>

                        <p className="text-body" style={{ marginTop: '1.5rem' }}>
                            Investigating the impact of California's climate policy, specifically AB 32
                            and the cap-and-trade system, on local communities and industries.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
                            <div>
                                <p className="text-label" style={{ marginBottom: '0.5rem' }}>Key Entities</p>
                                <p className="text-small" style={{ color: 'var(--text-secondary)' }}>CARB, UC Berkeley, City of Oakland</p>
                            </div>
                            <div>
                                <p className="text-label" style={{ marginBottom: '0.5rem' }}>Topics</p>
                                <p className="text-small" style={{ color: 'var(--text-secondary)' }}>Climate Policy, Cap-and-Trade</p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Sidebar */}
                <div className="grid-sidebar">
                    {/* Quick Actions */}
                    <div>
                        <p className="text-label" style={{ marginBottom: '1rem' }}>QUICK ACTIONS</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            {quickActions.map((action, i) => (
                                <button
                                    key={i}
                                    className="card card-interactive"
                                    style={{ padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', border: '1px solid var(--border-subtle)' }}
                                >
                                    <action.icon style={{ width: '16px', height: '16px', color: 'var(--gold)' }} />
                                    <span className="text-small" style={{ color: 'var(--text-secondary)' }}>{action.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* AI Insights */}
                    <div className="panel panel-gold">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <Sparkles style={{ width: '16px', height: '16px', color: 'var(--gold)' }} />
                            <p className="text-label text-gold">AI INSIGHTS</p>
                        </div>

                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {aiSuggestions.map((item, i) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                    <span style={{ color: 'var(--gold)' }}>•</span>
                                    <span className="text-small" style={{ color: 'var(--text-secondary)' }}>{item}</span>
                                </li>
                            ))}
                        </ul>

                        <button className="text-small text-gold" style={{ marginTop: '1rem', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            Ask Auric AI <ArrowRight style={{ width: '12px', height: '12px' }} />
                        </button>
                    </div>

                    {/* Timeline */}
                    <div>
                        <p className="text-label" style={{ marginBottom: '1rem' }}>TIMELINE</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {[
                                { date: 'Dec 10', event: 'Initial research started' },
                                { date: 'Dec 12', event: 'Dr. Chen interview confirmed' },
                                { date: 'Dec 15', event: 'Scheduled interview' },
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', gap: '1rem' }}>
                                    <span className="text-mono text-gold" style={{ width: '48px' }}>{item.date}</span>
                                    <span className="text-small" style={{ color: 'var(--text-secondary)' }}>{item.event}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
