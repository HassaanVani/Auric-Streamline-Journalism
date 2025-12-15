import { useState } from 'react';
import {
    Calendar,
    Clock,
    Video,
    Plus,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    Check
} from 'lucide-react';

const upcomingMeetings = [
    {
        id: 1,
        title: 'Interview with Dr. Sarah Chen',
        date: 'Dec 15, 2024',
        time: '10:00 AM PST',
        duration: '30 min',
        platform: 'Zoom',
        status: 'confirmed',
    },
    {
        id: 2,
        title: 'Follow-up with Mayor Wilson',
        date: 'Dec 18, 2024',
        time: '2:00 PM PST',
        duration: '45 min',
        platform: 'Google Meet',
        status: 'pending',
    },
];

const pastMeetings = [
    { id: 101, title: 'Initial Research Discussion', date: 'Dec 10, 2024', contact: 'Lisa Martinez', hasTranscript: true },
];

export function Meetings() {
    const [activeTab, setActiveTab] = useState('upcoming');

    return (
        <div className="page-container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                <div>
                    <h1 className="text-h1" style={{ marginBottom: '0.5rem' }}>Meetings</h1>
                    <p className="text-body" style={{ maxWidth: '400px' }}>Schedule and manage interview sessions</p>
                </div>
                <button className="btn btn-primary">
                    <Plus style={{ width: '16px', height: '16px' }} />
                    Schedule Meeting
                </button>
            </header>

            <div className="grid-main">
                <div>
                    {/* Tabs */}
                    <div className="tabs" style={{ marginBottom: '2rem' }}>
                        {['upcoming', 'past'].map((tab) => (
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

                    {/* Meetings */}
                    {activeTab === 'upcoming' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {upcomingMeetings.map((meeting) => (
                                <div key={meeting.id} className="card">
                                    <div style={{ display: 'flex', gap: '1.25rem' }}>
                                        <div style={{
                                            width: '56px',
                                            height: '56px',
                                            borderRadius: '12px',
                                            background: 'var(--gold-muted)',
                                            border: '1px solid rgba(212, 168, 83, 0.3)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}>
                                            <Video style={{ width: '24px', height: '24px', color: 'var(--gold)' }} />
                                        </div>

                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                                                {meeting.title}
                                            </h3>
                                            <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '0.75rem' }}>
                                                <span className="text-small" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                                    <Calendar style={{ width: '14px', height: '14px' }} /> {meeting.date}
                                                </span>
                                                <span className="text-small" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                                    <Clock style={{ width: '14px', height: '14px' }} /> {meeting.time}
                                                </span>
                                                <span className="text-small">{meeting.duration}</span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <span className="badge">{meeting.platform}</span>
                                                <span className={`badge ${meeting.status === 'confirmed' ? 'badge-success' : 'badge-warning'}`}>
                                                    {meeting.status}
                                                </span>
                                            </div>
                                        </div>

                                        <button className="btn btn-primary">
                                            <ExternalLink style={{ width: '16px', height: '16px' }} />
                                            Join
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'past' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {pastMeetings.map((meeting) => (
                                <div key={meeting.id} className="card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
                                                {meeting.title}
                                            </h3>
                                            <p className="text-small" style={{ marginBottom: '0.5rem' }}>{meeting.date} • {meeting.contact}</p>
                                            {meeting.hasTranscript && (
                                                <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                                                    <Check style={{ width: '12px', height: '12px' }} /> Transcript available
                                                </span>
                                            )}
                                        </div>
                                        <button className="btn btn-secondary">View</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="grid-sidebar">
                    {/* Calendar */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>December 2024</span>
                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                                <button className="btn-ghost" style={{ padding: '0.25rem' }}>
                                    <ChevronLeft style={{ width: '16px', height: '16px' }} />
                                </button>
                                <button className="btn-ghost" style={{ padding: '0.25rem' }}>
                                    <ChevronRight style={{ width: '16px', height: '16px' }} />
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem', marginBottom: '0.5rem' }}>
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                                <div key={i} style={{ textAlign: 'center', fontSize: '0.6875rem', color: 'var(--text-dim)', padding: '0.5rem' }}>
                                    {d}
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem' }}>
                            {Array.from({ length: 35 }, (_, i) => {
                                const day = i - 6;
                                const inMonth = day > 0 && day <= 31;
                                const hasEvent = [15, 18].includes(day);
                                const today = day === 14;
                                return (
                                    <button
                                        key={i}
                                        style={{
                                            position: 'relative',
                                            height: '36px',
                                            fontSize: '0.8125rem',
                                            borderRadius: '8px',
                                            border: 'none',
                                            cursor: inMonth ? 'pointer' : 'default',
                                            background: today ? 'var(--gold)' : 'transparent',
                                            color: today ? 'var(--bg-primary)' : !inMonth ? 'var(--border-subtle)' : 'var(--text-secondary)',
                                            fontWeight: today ? 600 : 400
                                        }}
                                    >
                                        {inMonth ? day : ''}
                                        {hasEvent && !today && (
                                            <span style={{
                                                position: 'absolute',
                                                bottom: '4px',
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                width: '4px',
                                                height: '4px',
                                                borderRadius: '50%',
                                                background: 'var(--gold)'
                                            }} />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Services */}
                    <div className="card">
                        <p className="text-label" style={{ marginBottom: '1rem' }}>CONNECTED SERVICES</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {[
                                { name: 'Zoom', connected: true },
                                { name: 'Google Meet', connected: true },
                                { name: 'Outlook', connected: false },
                            ].map((s) => (
                                <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span className="text-small" style={{ color: 'var(--text-secondary)' }}>{s.name}</span>
                                    {s.connected ? (
                                        <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <Check style={{ width: '12px', height: '12px' }} /> Connected
                                        </span>
                                    ) : (
                                        <button style={{ fontSize: '0.8125rem', color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                            Connect
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Meetings;
