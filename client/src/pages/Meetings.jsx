import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import {
    Calendar,
    Clock,
    Video,
    Plus,
    Loader,
    Trash2,
    X
} from 'lucide-react';

export function Meetings() {
    const api = useApi();
    const [meetings, setMeetings] = useState([]);
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNewForm, setShowNewForm] = useState(false);

    // New meeting form
    const [newMeeting, setNewMeeting] = useState({
        title: '',
        date: '',
        time: '10:00',
        duration: 30,
        platform: 'zoom',
        storyId: '',
        contactName: ''
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [meetingsData, storiesData] = await Promise.all([
                api.get('/meetings'),
                api.get('/stories')
            ]);
            setMeetings(meetingsData);
            setStories(storiesData);
            if (storiesData.length > 0) {
                setNewMeeting(prev => ({ ...prev, storyId: storiesData[0].id }));
            }
        } catch (err) {
            console.error('Failed to load data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateMeeting = async () => {
        if (!newMeeting.title || !newMeeting.date || !newMeeting.storyId) return;

        setSaving(true);
        try {
            const dateTime = new Date(`${newMeeting.date}T${newMeeting.time}`);
            const meeting = await api.post('/meetings', {
                title: newMeeting.title,
                date: dateTime.toISOString(),
                duration: newMeeting.duration,
                platform: newMeeting.platform,
                storyId: newMeeting.storyId,
                contactName: newMeeting.contactName || null
            });
            setMeetings([meeting, ...meetings]);
            setNewMeeting({
                title: '',
                date: '',
                time: '10:00',
                duration: 30,
                platform: 'zoom',
                storyId: stories[0]?.id || '',
                contactName: ''
            });
            setShowNewForm(false);
        } catch (err) {
            console.error('Failed to create meeting:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteMeeting = async (id) => {
        if (!confirm('Delete this meeting?')) return;

        try {
            await api.del(`/meetings/${id}`);
            setMeetings(meetings.filter(m => m.id !== id));
        } catch (err) {
            console.error('Failed to delete:', err);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit'
        });
    };

    const upcomingMeetings = meetings.filter(m => new Date(m.date) >= new Date());
    const pastMeetings = meetings.filter(m => new Date(m.date) < new Date());

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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 className="text-h1" style={{ marginBottom: '0.5rem' }}>Meetings</h1>
                        <p className="text-body">Schedule and track interviews with sources.</p>
                    </div>
                    <button onClick={() => setShowNewForm(true)} className="btn btn-primary">
                        <Plus style={{ width: '16px', height: '16px' }} />
                        Schedule Meeting
                    </button>
                </div>
            </header>

            {/* New Meeting Form */}
            {showNewForm && (
                <div className="panel" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 className="text-h3">New Meeting</h2>
                        <button onClick={() => setShowNewForm(false)} className="btn-ghost" style={{ padding: '0.5rem' }}>
                            <X style={{ width: '20px', height: '20px' }} />
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                            <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Title *</label>
                            <input
                                type="text"
                                value={newMeeting.title}
                                onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                                className="input"
                                placeholder="Interview with..."
                            />
                        </div>
                        <div>
                            <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Date *</label>
                            <input
                                type="date"
                                value={newMeeting.date}
                                onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                                className="input"
                            />
                        </div>
                        <div>
                            <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Time</label>
                            <input
                                type="time"
                                value={newMeeting.time}
                                onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                                className="input"
                            />
                        </div>
                        <div>
                            <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Story *</label>
                            <select
                                value={newMeeting.storyId}
                                onChange={(e) => setNewMeeting({ ...newMeeting, storyId: e.target.value })}
                                className="input"
                            >
                                {stories.map(s => (
                                    <option key={s.id} value={s.id}>{s.title}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Platform</label>
                            <select
                                value={newMeeting.platform}
                                onChange={(e) => setNewMeeting({ ...newMeeting, platform: e.target.value })}
                                className="input"
                            >
                                <option value="zoom">Zoom</option>
                                <option value="google_meet">Google Meet</option>
                                <option value="phone">Phone</option>
                                <option value="in_person">In Person</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Contact Name</label>
                            <input
                                type="text"
                                value={newMeeting.contactName}
                                onChange={(e) => setNewMeeting({ ...newMeeting, contactName: e.target.value })}
                                className="input"
                                placeholder="Source name"
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                        <button onClick={() => setShowNewForm(false)} className="btn btn-secondary">Cancel</button>
                        <button onClick={handleCreateMeeting} disabled={saving} className="btn btn-primary">
                            {saving ? 'Creating...' : 'Create Meeting'}
                        </button>
                    </div>
                </div>
            )}

            {/* Empty state */}
            {meetings.length === 0 && !showNewForm && (
                <div className="panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <Calendar style={{ width: '48px', height: '48px', color: 'var(--gold)', margin: '0 auto 1.5rem' }} />
                    <h2 className="text-h2" style={{ marginBottom: '0.75rem' }}>No meetings scheduled</h2>
                    <p className="text-body" style={{ maxWidth: '400px', margin: '0 auto 2rem' }}>
                        Schedule your first interview to get started.
                    </p>
                    <button onClick={() => setShowNewForm(true)} className="btn btn-primary">
                        <Plus style={{ width: '16px', height: '16px' }} />
                        Schedule Meeting
                    </button>
                </div>
            )}

            {/* Upcoming Meetings */}
            {upcomingMeetings.length > 0 && (
                <section style={{ marginBottom: '2rem' }}>
                    <h2 className="text-h3" style={{ marginBottom: '1rem' }}>Upcoming</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {upcomingMeetings.map(meeting => (
                            <div key={meeting.id} className="card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                                            {meeting.title}
                                        </h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                                            <span className="text-small" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                                <Calendar style={{ width: '14px', height: '14px' }} />
                                                {formatDate(meeting.date)}
                                            </span>
                                            <span className="text-small" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                                <Clock style={{ width: '14px', height: '14px' }} />
                                                {formatTime(meeting.date)} ({meeting.duration} min)
                                            </span>
                                            <span className="text-small" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                                <Video style={{ width: '14px', height: '14px' }} />
                                                {meeting.platform}
                                            </span>
                                            {meeting.story && (
                                                <span className="badge badge-gold">{meeting.story.title}</span>
                                            )}
                                        </div>
                                    </div>
                                    <button onClick={() => handleDeleteMeeting(meeting.id)} className="btn-ghost" style={{ padding: '0.5rem' }}>
                                        <Trash2 style={{ width: '16px', height: '16px' }} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Past Meetings */}
            {pastMeetings.length > 0 && (
                <section>
                    <h2 className="text-h3" style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Past</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {pastMeetings.map(meeting => (
                            <div key={meeting.id} className="card" style={{ opacity: 0.7 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <p style={{ fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{meeting.title}</p>
                                        <p className="text-small">{formatDate(meeting.date)} • {meeting.contactName}</p>
                                    </div>
                                    <button onClick={() => handleDeleteMeeting(meeting.id)} className="btn-ghost" style={{ padding: '0.5rem' }}>
                                        <Trash2 style={{ width: '16px', height: '16px' }} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

export default Meetings;
