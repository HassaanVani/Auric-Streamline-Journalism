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
    ExternalLink
} from 'lucide-react';

export function About() {
    const features = [
        {
            icon: Search,
            title: 'Research',
            description: 'Gather and organize information for your investigations. Save research queries and build your knowledge base.'
        },
        {
            icon: Users,
            title: 'Sources & Contacts',
            description: 'Manage your network of experts, officials, and key contacts. Link contacts to multiple stories and track your relationships.'
        },
        {
            icon: Video,
            title: 'Meetings & Transcripts',
            description: 'Schedule interviews, log meeting notes, and store transcripts. Keep all your interview data in one place.'
        },
        {
            icon: PenTool,
            title: 'Article Drafts',
            description: 'Write and edit your articles with a distraction-free editor. Track multiple drafts per story.'
        },
        {
            icon: CheckCircle,
            title: 'Editorial Review',
            description: 'Move articles through your workflow: draft → review → approved → published.'
        }
    ];

    const workflow = [
        { step: 1, title: 'Create a Story', description: 'Start by creating a story for your investigation. This organizes all your work.' },
        { step: 2, title: 'Research', description: 'Gather information. Save key findings and link them to your story.' },
        { step: 3, title: 'Find Sources', description: 'Add contacts to your source list. Link them to relevant stories.' },
        { step: 4, title: 'Interview', description: 'Schedule meetings with sources. Store transcripts and notes.' },
        { step: 5, title: 'Write', description: 'Create article drafts using your research and interviews.' },
        { step: 6, title: 'Review & Publish', description: 'Move through editorial review until published.' }
    ];

    return (
        <div className="page-container">
            {/* Hero */}
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
                    Manage sources, track interviews, write drafts, and keep everything connected.
                </p>
            </header>

            {/* Features */}
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

            {/* Workflow */}
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
                                        display: 'none' // Hide on small screens
                                    }} className="workflow-arrow" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* AI Features */}
            <section style={{ marginBottom: '4rem' }}>
                <div className="panel panel-gold" style={{ padding: '2rem', textAlign: 'center' }}>
                    <Sparkles style={{ width: '32px', height: '32px', color: 'var(--gold)', margin: '0 auto 1rem' }} />
                    <h2 className="text-h2" style={{ marginBottom: '0.75rem' }}>AI Features</h2>
                    <p className="text-body" style={{ maxWidth: '500px', margin: '0 auto 1.5rem' }}>
                        Auric supports AI-powered features like question generation, email drafting, and article review.
                        Configure your OpenAI API key in Settings to enable these features.
                    </p>
                    <Link to="/settings">
                        <button className="btn btn-primary">
                            Go to Settings
                        </button>
                    </Link>
                </div>
            </section>

            {/* Get Started */}
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
