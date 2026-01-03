import { Link } from 'react-router-dom';
import {
    Search,
    Users,
    FileText,
    Video,
    PenTool,
    CheckCircle,
    Sparkles,
    ArrowRight,
    Shield,
    Link2,
    AlertTriangle
} from 'lucide-react';

export function About() {
    const features = [
        {
            icon: Search,
            title: 'Research',
            description: 'Gather and organize information with AI-powered search. Save findings and build your knowledge base.'
        },
        {
            icon: Users,
            title: 'Sources & Contacts',
            description: 'Manage your network of experts and key contacts. Track relationships across multiple stories.'
        },
        {
            icon: Video,
            title: 'Meetings & Transcripts',
            description: 'Schedule interviews, log meeting notes, and store transcripts in one place.'
        },
        {
            icon: PenTool,
            title: 'Article Drafts',
            description: 'Write with a distraction-free editor. Track multiple drafts per story.'
        },
        {
            icon: CheckCircle,
            title: 'Editorial Review',
            description: 'AI-powered style suggestions and fact-checking. Move articles through your workflow.'
        }
    ];

    const workflow = [
        { step: 1, title: 'Create a Story', description: 'Start your investigation. This organizes all your work.' },
        { step: 2, title: 'Research', description: 'Gather information with AI search. Findings link to your story.' },
        { step: 3, title: 'Find Sources', description: 'Add contacts to your source list. Link them to relevant stories.' },
        { step: 4, title: 'Interview', description: 'AI generates questions. Store transcripts and notes.' },
        { step: 5, title: 'Write', description: 'Create drafts with your research visible in the sidebar.' },
        { step: 6, title: 'Review & Publish', description: 'AI reviews for clarity. Fact-check claims before publishing.' }
    ];

    const values = [
        {
            icon: Shield,
            title: 'Structural Integrity',
            description: 'Organized information is the best defense against misinformation.'
        },
        {
            icon: Link2,
            title: 'Chain of Custody',
            description: 'Trace every sentence back to a specific interview, research query, or verified contact.'
        },
        {
            icon: AlertTriangle,
            title: 'Accountability Built In',
            description: 'Link sources to stories and notes to drafts. Build accountability into your writing.'
        }
    ];

    return (
        <div className="page-container">
            <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1rem',
                    marginBottom: '1.5rem'
                }}>
                    <img src="/Logo.png" alt="Auric" style={{ width: '48px', height: '48px' }} />
                    <h1 style={{
                        fontFamily: "'Newsreader', serif",
                        fontSize: '2.5rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)'
                    }}>
                        Auric
                    </h1>
                </div>
                <p className="text-h2" style={{ marginBottom: '1rem', color: 'var(--gold)' }}>
                    Streamlined Investigative Journalism
                </p>
                <p className="text-body" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    Auric helps journalists organize their investigations from research to publication.
                    Manage sources, track interviews, write drafts, and keep everything connected,
                    integrating AI through the whole process to ensure consistency, accuracy, and integrity.
                </p>
            </header>

            <section style={{ marginBottom: '4rem' }}>
                <div className="panel" style={{ padding: '2rem', background: 'var(--bg-secondary)', borderLeft: '4px solid var(--gold)' }}>
                    <h2 className="text-h2" style={{ marginBottom: '1rem' }}>The Problem</h2>
                    <p className="text-body" style={{ marginBottom: '1rem' }}>
                        We are living through a crisis of information. In an era where verifying facts is more critical than ever,
                        the tools available to journalists are surprisingly fragile.
                    </p>
                    <p className="text-body">
                        A typical investigation lives across scattered documents, disparate email threads, and mental notes.
                        This fragmentation makes it harder to verify sources, easier to lose track of evidence,
                        and significantly more difficult for new journalists to produce rigorous work.
                    </p>
                </div>
            </section>

            <section style={{ marginBottom: '4rem' }}>
                <h2 className="text-h2" style={{ marginBottom: '2rem', textAlign: 'center' }}>Our Approach</h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '1.5rem'
                }}>
                    {values.map((value) => (
                        <div key={value.title} className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                            <value.icon style={{
                                width: '32px',
                                height: '32px',
                                color: 'var(--gold)',
                                margin: '0 auto 1rem'
                            }} />
                            <h3 style={{
                                fontSize: '1.125rem',
                                fontWeight: 600,
                                color: 'var(--text-primary)',
                                marginBottom: '0.5rem'
                            }}>
                                {value.title}
                            </h3>
                            <p className="text-body">{value.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section style={{ marginBottom: '4rem' }}>
                <h2 className="text-h2" style={{ marginBottom: '2rem', textAlign: 'center' }}>Features</h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '1.5rem'
                }}>
                    {features.map((feature) => (
                        <div key={feature.title} className="card" style={{ padding: '1.5rem' }}>
                            <feature.icon style={{
                                width: '28px',
                                height: '28px',
                                color: 'var(--gold)',
                                marginBottom: '1rem'
                            }} />
                            <h3 style={{
                                fontSize: '1.125rem',
                                fontWeight: 600,
                                color: 'var(--text-primary)',
                                marginBottom: '0.5rem'
                            }}>
                                {feature.title}
                            </h3>
                            <p className="text-body">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section style={{ marginBottom: '4rem' }}>
                <h2 className="text-h2" style={{ marginBottom: '2rem', textAlign: 'center' }}>How It Works</h2>
                <div className="panel" style={{ padding: '2rem' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '2rem'
                    }}>
                        {workflow.map((item, idx) => (
                            <div key={item.step} style={{ position: 'relative' }}>
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    background: 'var(--gold)',
                                    color: 'var(--bg-primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 700,
                                    marginBottom: '0.75rem'
                                }}>
                                    {item.step}
                                </div>
                                <h3 style={{
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    color: 'var(--text-primary)',
                                    marginBottom: '0.375rem'
                                }}>
                                    {item.title}
                                </h3>
                                <p className="text-small">{item.description}</p>
                                {idx < workflow.length - 1 && (
                                    <ArrowRight style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '-16px',
                                        width: '20px',
                                        height: '20px',
                                        color: 'var(--gold)',
                                        display: 'none'
                                    }} className="workflow-arrow" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section style={{ marginBottom: '4rem' }}>
                <div className="panel panel-gold" style={{ padding: '2rem', textAlign: 'center' }}>
                    <Sparkles style={{ width: '32px', height: '32px', color: 'var(--gold)', margin: '0 auto 1rem' }} />
                    <h2 className="text-h2" style={{ marginBottom: '0.75rem' }}>Powered by AI</h2>
                    <p className="text-body" style={{ maxWidth: '500px', margin: '0 auto 1.5rem' }}>
                        Auric uses AI to power research search, interview question generation, email drafting,
                        and editorial review with fact-checking—all designed to support journalistic integrity.
                    </p>
                    <Link to="/research">
                        <button className="btn btn-primary">
                            Try AI Research
                        </button>
                    </Link>
                </div>
            </section>

            <section style={{ textAlign: 'center' }}>
                <h2 className="text-h2" style={{ marginBottom: '1rem' }}>Ready to get started?</h2>
                <p className="text-body" style={{ marginBottom: '1.5rem' }}>
                    Create your first story and begin organizing your investigation.
                </p>
                <Link to="/">
                    <button className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
                        Go to Dashboard <ArrowRight style={{ width: '16px', height: '16px' }} />
                    </button>
                </Link>
            </section>
        </div>
    );
}

export default About;
