import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    ArrowLeft,
    Mail,
    MapPin,
    Calendar,
    MessageSquare,
    Sparkles,
    Edit,
    ChevronRight
} from 'lucide-react';

const contact = {
    name: 'Dr. Sarah Chen',
    role: 'Climate Scientist',
    org: 'UC Berkeley',
    location: 'Berkeley, CA',
    email: 'sarah.chen@berkeley.edu',
    expertise: ['Climate Policy', 'Cap-and-Trade', 'Environmental Economics'],
    bio: 'Dr. Sarah Chen is a leading climate scientist specializing in the economic impacts of environmental policy. Her research on California\'s cap-and-trade system has been cited in major policy decisions.',
    initials: 'SC',
};

const timeline = [
    { title: 'Initial outreach sent', date: 'Dec 10, 2024', complete: true },
    { title: 'Response received', date: 'Dec 11, 2024', complete: true },
    { title: 'Interview scheduled', date: 'Dec 15, 2024', complete: false },
];

const suggestedQuestions = [
    'What are the key metrics for measuring AB 32 success?',
    'How do you see the policy evolving post-2030?',
    'What sectors have been most impacted?'
];

export function ContactProfile() {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('overview');

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

            {/* Header Card */}
            <div className="panel" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <div className="avatar-xl">{contact.initials}</div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                <h1 className="text-h2">{contact.name}</h1>
                                <span className="badge badge-success">Confirmed</span>
                            </div>
                            <p className="text-body" style={{ marginBottom: '0.75rem' }}>
                                {contact.role} at {contact.org}
                            </p>
                            <div style={{ display: 'flex', gap: '1.5rem' }}>
                                <span className="text-small" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                    <MapPin style={{ width: '14px', height: '14px' }} /> {contact.location}
                                </span>
                                <span className="text-small" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                    <Mail style={{ width: '14px', height: '14px' }} /> {contact.email}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button className="btn btn-secondary">
                            <Edit style={{ width: '16px', height: '16px' }} />
                            Edit
                        </button>
                        <Link to="/email">
                            <button className="btn btn-primary">
                                <Mail style={{ width: '16px', height: '16px' }} />
                                Draft Email
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs" style={{ marginBottom: '2rem' }}>
                {['overview', 'articles', 'notes', 'timeline'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`tab ${activeTab === tab ? 'active' : ''}`}
                        style={{ textTransform: 'capitalize' }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="grid-main">
                {/* Main Content */}
                <div>
                    {activeTab === 'overview' && (
                        <>
                            <div className="card" style={{ marginBottom: '1.5rem' }}>
                                <p className="text-label" style={{ marginBottom: '0.75rem' }}>ABOUT</p>
                                <p className="text-body">{contact.bio}</p>
                            </div>

                            <div className="card" style={{ marginBottom: '1.5rem' }}>
                                <p className="text-label" style={{ marginBottom: '0.75rem' }}>EXPERTISE</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {contact.expertise.map((skill) => (
                                        <span key={skill} className="badge" style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem' }}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="panel panel-gold">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                    <Sparkles style={{ width: '16px', height: '16px', color: 'var(--gold)' }} />
                                    <p className="text-label text-gold">SUGGESTED QUESTIONS</p>
                                </div>
                                <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {suggestedQuestions.map((q, i) => (
                                        <li key={i} style={{ display: 'flex', gap: '0.75rem' }}>
                                            <span className="text-mono text-gold">{i + 1}.</span>
                                            <span className="text-body">{q}</span>
                                        </li>
                                    ))}
                                </ol>
                                <Link to="/questions" style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    fontSize: '0.8125rem',
                                    color: 'var(--gold)',
                                    textDecoration: 'none',
                                    marginTop: '1rem'
                                }}>
                                    Generate more <ChevronRight style={{ width: '14px', height: '14px' }} />
                                </Link>
                            </div>
                        </>
                    )}

                    {activeTab === 'timeline' && (
                        <div className="timeline">
                            {timeline.map((item, i) => (
                                <div key={i} className="timeline-item">
                                    <div className={`timeline-dot ${item.complete ? 'complete' : ''}`} />
                                    <div className="card" style={{ padding: '1rem' }}>
                                        <p style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                                            {item.title}
                                        </p>
                                        <p className="text-small">{item.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="grid-sidebar">
                    <div className="card">
                        <p className="text-label" style={{ marginBottom: '1rem' }}>ACTIONS</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {[
                                { to: '/email', icon: Mail, label: 'Send email' },
                                { to: '/meetings', icon: Calendar, label: 'Schedule meeting' },
                                { to: '/questions', icon: MessageSquare, label: 'Generate questions' },
                            ].map((action) => (
                                <Link key={action.label} to={action.to} style={{ textDecoration: 'none' }}>
                                    <button className="btn btn-ghost" style={{
                                        width: '100%',
                                        justifyContent: 'flex-start',
                                        padding: '0.75rem'
                                    }}>
                                        <action.icon style={{ width: '16px', height: '16px', color: 'var(--gold)' }} />
                                        <span style={{ color: 'var(--text-secondary)' }}>{action.label}</span>
                                    </button>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="card">
                        <p className="text-label" style={{ marginBottom: '1rem' }}>RELATED SOURCES</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {['Prof. Emily Watson', 'Dr. Michael Thompson'].map((name) => (
                                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div className="avatar" style={{ width: '36px', height: '36px', fontSize: '0.75rem' }}>
                                        {name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <span className="text-small" style={{ color: 'var(--text-secondary)' }}>{name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactProfile;
