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
    const [generating, setGenerating] = useState(false);

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
        setQuestions([...questions, { id: Date.now(), question: newQuestion.trim(), category: 'Custom', priority: 'medium' }]);
        setNewQuestion('');
    };

    const handleGenerateQuestions = async () => {
        setGenerating(true);
        try {
            const contact = contacts.find(c => c.id === selectedContact);
            const story = stories.find(s => s.id === selectedStory);

            const result = await api.post('/questions/generate', {
                contact: contact ? { name: contact.name, role: contact.role, affiliation: contact.org } : null,
                story: story ? { title: story.title } : null,
                researchGaps: null
            });

            if (result.questions) {
                setQuestions([...questions, ...result.questions.map(q => ({
                    id: Date.now() + Math.random(),
                    question: q.question,
                    category: q.category || 'General',
                    priority: q.priority || 'medium',
                    followUp: q.followUp
                }))]);
            }
        } catch (err) {
            console.error('Failed to generate:', err);
        } finally {
            setGenerating(false);
        }
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
        const allQuestions = questions.map((q, i) => `${i + 1}. ${q.question}${q.followUp ? `\n   Follow-up: ${q.followUp}` : ''}`).join('\n\n');
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

            <div className="panel panel-gold" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Sparkles style={{ width: '18px', height: '18px', color: 'var(--gold)' }} />
                    <span className="text-label text-gold">AI QUESTION GENERATOR</span>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ minWidth: '180px', flex: 1 }}>
                        <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Story Context</label>
                        <select
                            value={selectedStory}
                            onChange={(e) => setSelectedStory(e.target.value)}
                            className="input"
                        >
                            <option value="">Any story</option>
                            {stories.map(s => (
                                <option key={s.id} value={s.id}>{s.title}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ minWidth: '180px', flex: 1 }}>
                        <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>For Contact</label>
                        <select
                            value={selectedContact}
                            onChange={(e) => setSelectedContact(e.target.value)}
                            className="input"
                        >
                            <option value="">Any contact</option>
                            {contacts.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={handleGenerateQuestions}
                        disabled={generating}
                        className="btn btn-primary"
                        style={{ minWidth: '180px', height: '44px' }}
                    >
                        {generating ? (
                            <Loader style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />
                        ) : (
                            <Sparkles style={{ width: '18px', height: '18px' }} />
                        )}
                        {generating ? 'Generating...' : 'Generate Questions'}
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
                <input
                    type="text"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddQuestion()}
                    placeholder="Or type a question manually..."
                    className="input"
                    style={{ flex: 1 }}
                />
                <button onClick={handleAddQuestion} disabled={!newQuestion.trim()} className="btn btn-secondary">
                    <Plus style={{ width: '16px', height: '16px' }} />
                    Add
                </button>
            </div>

            {questions.length === 0 ? (
                <div className="panel" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                    <MessageSquare style={{ width: '40px', height: '40px', color: 'var(--gold)', margin: '0 auto 1rem' }} />
                    <h2 className="text-h3" style={{ marginBottom: '0.5rem' }}>No questions yet</h2>
                    <p className="text-body" style={{ maxWidth: '400px', margin: '0 auto' }}>
                        Use AI to generate interview questions based on your story and contact, or add them manually.
                    </p>
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
                                        <div style={{ marginBottom: q.followUp ? '0.5rem' : 0 }}>
                                            <span className="text-mono text-gold" style={{ marginRight: '0.75rem' }}>{idx + 1}.</span>
                                            <span style={{ color: 'var(--text-primary)' }}>{q.question}</span>
                                        </div>
                                        {q.followUp && (
                                            <p className="text-small" style={{ marginLeft: '1.75rem', color: 'var(--text-secondary)' }}>
                                                Follow-up: {q.followUp}
                                            </p>
                                        )}
                                        <div style={{ marginTop: '0.5rem', marginLeft: '1.75rem', display: 'flex', gap: '0.5rem' }}>
                                            <span className="badge" style={{ fontSize: '0.6875rem' }}>{q.category}</span>
                                            {q.priority === 'high' && (
                                                <span className="badge badge-gold" style={{ fontSize: '0.6875rem' }}>High Priority</span>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={() => handleCopy(idx, q.question)} className="btn-ghost" style={{ padding: '0.375rem' }}>
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
    );
}

export default Questions;
