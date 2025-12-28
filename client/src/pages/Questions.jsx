import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import {
    ArrowLeft,
    Sparkles,
    Plus,
    Trash2,
    Loader,
    MessageSquare,
    Copy,
    Check
} from 'lucide-react';

export function Questions() {
    const api = useApi();
    const [stories, setStories] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStory, setSelectedStory] = useState('');
    const [selectedContact, setSelectedContact] = useState('');

    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState('');
    const [copiedIdx, setCopiedIdx] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [storiesData, contactsData] = await Promise.all([
                api.get('/stories'),
                api.get('/contacts')
            ]);
            setStories(storiesData);
            setContacts(contactsData);
        } catch (err) {
            console.error('Failed to load:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddQuestion = () => {
        if (!newQuestion.trim()) return;
        setQuestions([...questions, { id: Date.now(), text: newQuestion.trim(), category: 'Custom' }]);
        setNewQuestion('');
    };

    const handleDeleteQuestion = (id) => {
        setQuestions(questions.filter(q => q.id !== id));
    };

    const handleCopy = (idx, text) => {
        navigator.clipboard.writeText(text);
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 2000);
    };

    const copyAll = () => {
        const allQuestions = questions.map((q, i) => `${i + 1}. ${q.text}`).join('\n');
        navigator.clipboard.writeText(allQuestions);
    };

    if (loading) {
        return (
            <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
                <Loader style={{ width: '24px', height: '24px', color: 'var(--gold)', animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }

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
                <h1 className="text-h1" style={{ marginBottom: '0.5rem' }}>Interview Questions</h1>
                <p className="text-body">Create and organize questions for your interviews.</p>
            </header>

            {/* Context selectors */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ minWidth: '200px' }}>
                    <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Story</label>
                    <select
                        value={selectedStory}
                        onChange={(e) => setSelectedStory(e.target.value)}
                        className="input"
                    >
                        <option value="">Select a story</option>
                        {stories.map(s => (
                            <option key={s.id} value={s.id}>{s.title}</option>
                        ))}
                    </select>
                </div>
                <div style={{ minWidth: '200px' }}>
                    <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Contact</label>
                    <select
                        value={selectedContact}
                        onChange={(e) => setSelectedContact(e.target.value)}
                        className="input"
                    >
                        <option value="">Select a contact</option>
                        {contacts.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid-main">
                {/* Questions List */}
                <div>
                    {/* Add question */}
                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
                        <input
                            type="text"
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddQuestion()}
                            placeholder="Type a question..."
                            className="input"
                            style={{ flex: 1 }}
                        />
                        <button onClick={handleAddQuestion} disabled={!newQuestion.trim()} className="btn btn-primary">
                            <Plus style={{ width: '16px', height: '16px' }} />
                            Add
                        </button>
                    </div>

                    {questions.length === 0 ? (
                        <div className="panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                            <MessageSquare style={{ width: '48px', height: '48px', color: 'var(--gold)', margin: '0 auto 1.5rem' }} />
                            <h2 className="text-h2" style={{ marginBottom: '0.75rem' }}>No questions yet</h2>
                            <p className="text-body" style={{ maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                                Add interview questions manually, or connect your AI API key for intelligent question generation based on your research.
                            </p>
                            <div className="panel panel-gold" style={{ display: 'inline-block', padding: '1rem 1.5rem', textAlign: 'left' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <Sparkles style={{ width: '16px', height: '16px', color: 'var(--gold)' }} />
                                    <span className="text-label text-gold">AI GENERATION</span>
                                </div>
                                <p className="text-small">Add your OpenAI API key in Settings to enable AI-powered question generation.</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <span className="text-label">{questions.length} QUESTIONS</span>
                                <button onClick={copyAll} className="btn btn-secondary" style={{ fontSize: '0.8125rem' }}>
                                    <Copy style={{ width: '14px', height: '14px' }} />
                                    Copy All
                                </button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {questions.map((q, idx) => (
                                    <div key={q.id} className="card">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                                            <div style={{ flex: 1 }}>
                                                <span className="text-mono text-gold" style={{ marginRight: '0.75rem' }}>{idx + 1}.</span>
                                                <span style={{ color: 'var(--text-primary)' }}>{q.text}</span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button onClick={() => handleCopy(idx, q.text)} className="btn-ghost" style={{ padding: '0.375rem' }}>
                                                    {copiedIdx === idx ? (
                                                        <Check style={{ width: '16px', height: '16px', color: 'var(--success)' }} />
                                                    ) : (
                                                        <Copy style={{ width: '16px', height: '16px' }} />
                                                    )}
                                                </button>
                                                <button onClick={() => handleDeleteQuestion(q.id)} className="btn-ghost" style={{ padding: '0.375rem' }}>
                                                    <Trash2 style={{ width: '16px', height: '16px' }} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Sidebar */}
                <div className="grid-sidebar">
                    <div className="panel panel-gold">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <Sparkles style={{ width: '16px', height: '16px', color: 'var(--gold)' }} />
                            <span className="text-label text-gold">AI QUESTION GENERATOR</span>
                        </div>
                        <p className="text-body" style={{ marginBottom: '1rem' }}>
                            Generate tailored interview questions based on your research and contact's expertise.
                        </p>
                        <p className="text-small" style={{ opacity: 0.8 }}>
                            Requires OpenAI API key. Configure in Settings → API Keys.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Questions;
