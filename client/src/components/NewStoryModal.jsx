import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

export function NewStoryModal({ isOpen, onClose, onCreate }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            setError('Title is required');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await onCreate({ title: title.trim(), description: description.trim() });
            setTitle('');
            setDescription('');
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setTitle('');
        setDescription('');
        setError('');
        onClose();
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            {/* Backdrop */}
            <div
                onClick={handleClose}
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(4px)'
                }}
            />

            {/* Modal */}
            <div className="panel" style={{
                position: 'relative',
                width: '100%',
                maxWidth: '500px',
                maxHeight: '90vh',
                overflow: 'auto'
            }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Sparkles style={{ width: '24px', height: '24px', color: 'var(--gold)' }} />
                        <h2 className="text-h2">New Story</h2>
                    </div>
                    <button onClick={handleClose} className="btn-ghost" style={{ padding: '0.5rem' }}>
                        <X style={{ width: '20px', height: '20px' }} />
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div style={{
                        padding: '0.75rem',
                        marginBottom: '1rem',
                        background: 'rgba(248, 113, 113, 0.1)',
                        border: '1px solid rgba(248, 113, 113, 0.3)',
                        borderRadius: '8px'
                    }}>
                        <span className="text-small" style={{ color: 'var(--danger)' }}>{error}</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Story Title *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Climate Policy Investigation"
                            className="input"
                            autoFocus
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Description (optional)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brief overview of the story angle, key questions, or focus areas..."
                            className="input"
                            rows={4}
                            style={{ resize: 'vertical' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={handleClose} className="btn btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="btn btn-primary">
                            {loading ? 'Creating...' : 'Create Story'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NewStoryModal;
