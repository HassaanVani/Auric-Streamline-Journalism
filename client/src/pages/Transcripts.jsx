import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import {
    FileText,
    Plus,
    Loader,
    Trash2,
    X,
    Clock,
    Save
} from 'lucide-react';

export function Transcripts() {
    const api = useApi();
    const [transcripts, setTranscripts] = useState([]);
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNewForm, setShowNewForm] = useState(false);
    const [selectedTranscript, setSelectedTranscript] = useState(null);

    // Form state
    const [newTranscript, setNewTranscript] = useState({
        title: '',
        storyId: '',
        source: '',
        duration: ''
    });
    const [content, setContent] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [transcriptsData, storiesData] = await Promise.all([
                api.get('/transcripts'),
                api.get('/stories')
            ]);
            setTranscripts(transcriptsData);
            setStories(storiesData);
            if (storiesData.length > 0) {
                setNewTranscript(prev => ({ ...prev, storyId: storiesData[0].id }));
            }
        } catch (err) {
            console.error('Failed to load:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!newTranscript.title || !newTranscript.storyId) return;

        setSaving(true);
        try {
            const transcript = await api.post('/transcripts', {
                title: newTranscript.title,
                storyId: newTranscript.storyId,
                source: newTranscript.source || null,
                duration: newTranscript.duration || null,
                content: ''
            });
            setTranscripts([transcript, ...transcripts]);
            setNewTranscript({
                title: '',
                storyId: stories[0]?.id || '',
                source: '',
                duration: ''
            });
            setShowNewForm(false);
            selectTranscript(transcript);
        } catch (err) {
            console.error('Failed to create:', err);
        } finally {
            setSaving(false);
        }
    };

    const selectTranscript = (transcript) => {
        setSelectedTranscript(transcript);
        setContent(transcript.content || '');
    };

    const handleSave = async () => {
        if (!selectedTranscript) return;

        setSaving(true);
        try {
            const updated = await api.put(`/transcripts/${selectedTranscript.id}`, {
                content
            });
            setTranscripts(transcripts.map(t => t.id === updated.id ? updated : t));
            setSelectedTranscript(updated);
        } catch (err) {
            console.error('Failed to save:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this transcript?')) return;

        try {
            await api.del(`/transcripts/${id}`);
            const remaining = transcripts.filter(t => t.id !== id);
            setTranscripts(remaining);
            if (selectedTranscript?.id === id) {
                setSelectedTranscript(null);
                setContent('');
            }
        } catch (err) {
            console.error('Failed to delete:', err);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
                <Loader style={{ width: '24px', height: '24px', color: 'var(--gold)', animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }

    return (
        <div className="page-container" style={{ display: 'flex', gap: '2rem', height: 'calc(100vh - 120px)' }}>
            {/* Sidebar - Transcript List */}
            <div style={{ width: '300px', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 className="text-h3">Transcripts</h2>
                    <button onClick={() => setShowNewForm(true)} className="btn-ghost" style={{ padding: '0.5rem' }}>
                        <Plus style={{ width: '18px', height: '18px' }} />
                    </button>
                </div>

                {/* New transcript form */}
                {showNewForm && (
                    <div className="card" style={{ marginBottom: '1rem', padding: '1rem' }}>
                        <input
                            type="text"
                            value={newTranscript.title}
                            onChange={(e) => setNewTranscript({ ...newTranscript, title: e.target.value })}
                            placeholder="Transcript title"
                            className="input"
                            style={{ marginBottom: '0.75rem', fontSize: '0.875rem' }}
                        />
                        <select
                            value={newTranscript.storyId}
                            onChange={(e) => setNewTranscript({ ...newTranscript, storyId: e.target.value })}
                            className="input"
                            style={{ marginBottom: '0.75rem', fontSize: '0.875rem' }}
                        >
                            {stories.map(s => (
                                <option key={s.id} value={s.id}>{s.title}</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            value={newTranscript.source}
                            onChange={(e) => setNewTranscript({ ...newTranscript, source: e.target.value })}
                            placeholder="Source (e.g., Zoom recording)"
                            className="input"
                            style={{ marginBottom: '0.75rem', fontSize: '0.875rem' }}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => setShowNewForm(false)} className="btn btn-secondary" style={{ flex: 1, fontSize: '0.75rem' }}>Cancel</button>
                            <button onClick={handleCreate} disabled={saving} className="btn btn-primary" style={{ flex: 1, fontSize: '0.75rem' }}>Create</button>
                        </div>
                    </div>
                )}

                {/* Transcript list */}
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {transcripts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                            <FileText style={{ width: '32px', height: '32px', color: 'var(--text-dim)', margin: '0 auto 1rem' }} />
                            <p className="text-small">No transcripts yet</p>
                        </div>
                    ) : (
                        transcripts.map(transcript => (
                            <div
                                key={transcript.id}
                                onClick={() => selectTranscript(transcript)}
                                className="card card-interactive"
                                style={{
                                    padding: '1rem',
                                    cursor: 'pointer',
                                    borderColor: selectedTranscript?.id === transcript.id ? 'var(--gold)' : undefined
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                                            {transcript.title}
                                        </p>
                                        <p className="text-small">
                                            {transcript.story?.title} • {formatDate(transcript.createdAt)}
                                        </p>
                                        {transcript.duration && (
                                            <p className="text-small" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                                                <Clock style={{ width: '12px', height: '12px' }} />
                                                {transcript.duration}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(transcript.id); }}
                                        className="btn-ghost"
                                        style={{ padding: '0.25rem' }}
                                    >
                                        <Trash2 style={{ width: '14px', height: '14px' }} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Editor */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {selectedTranscript ? (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <div>
                                <h2 className="text-h2">{selectedTranscript.title}</h2>
                                <p className="text-small">
                                    {selectedTranscript.source && `${selectedTranscript.source} • `}
                                    {formatDate(selectedTranscript.createdAt)}
                                </p>
                            </div>
                            <button onClick={handleSave} disabled={saving} className="btn btn-primary">
                                {saving ? <Loader style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} /> : <Save style={{ width: '16px', height: '16px' }} />}
                                Save
                            </button>
                        </div>

                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Paste or type transcript content here..."
                            className="input"
                            style={{
                                flex: 1,
                                resize: 'none',
                                fontFamily: 'monospace',
                                fontSize: '0.875rem',
                                lineHeight: 1.8
                            }}
                        />
                    </>
                ) : (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ textAlign: 'center' }}>
                            <FileText style={{ width: '48px', height: '48px', color: 'var(--text-dim)', margin: '0 auto 1rem' }} />
                            <p className="text-body">Select a transcript or create a new one</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Transcripts;
