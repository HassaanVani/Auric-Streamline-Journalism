import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function Privacy() {
    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg-primary)',
            padding: '3rem 2rem'
        }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <Link to="/register" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    color: 'var(--gold)',
                    textDecoration: 'none',
                    marginBottom: '2rem'
                }}>
                    <ArrowLeft style={{ width: '16px', height: '16px' }} />
                    Back to Registration
                </Link>

                <h1 style={{
                    fontFamily: "'Newsreader', serif",
                    fontSize: '2rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: '0.5rem'
                }}>
                    Privacy Policy
                </h1>
                <p className="text-small" style={{ marginBottom: '2rem', color: 'var(--text-dim)' }}>
                    Last updated: December 2024
                </p>

                <div style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                            1. Information We Collect
                        </h2>
                        <p style={{ marginBottom: '1rem' }}>
                            When you use Auric, we collect information you provide directly:
                        </p>
                        <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                            <li>Account information (name, email address, password)</li>
                            <li>Story content you create (research notes, article drafts, transcripts)</li>
                            <li>Contact information you add to your source network</li>
                            <li>Meeting and interview records</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                            2. How We Use Your Information
                        </h2>
                        <p style={{ marginBottom: '1rem' }}>We use the information we collect to:</p>
                        <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                            <li>Provide and maintain the Auric service</li>
                            <li>Store and sync your journalism workflow data</li>
                            <li>Authenticate your account and protect your data</li>
                            <li>Improve and develop new features</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                            3. Data Security
                        </h2>
                        <p>
                            We implement appropriate security measures to protect your personal information.
                            Your password is hashed and your data is stored securely. However, no method of
                            transmission over the Internet is 100% secure.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                            4. Data Retention
                        </h2>
                        <p>
                            We retain your data for as long as your account is active. You can delete your
                            account and associated data at any time through Settings.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                            5. Third-Party Services
                        </h2>
                        <p>
                            If you enable AI features, your content may be processed by OpenAI's API according
                            to their privacy policy. We recommend not including sensitive source information
                            in AI-processed content.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                            6. Your Rights
                        </h2>
                        <p>You have the right to:</p>
                        <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                            <li>Access your personal data</li>
                            <li>Correct inaccurate data</li>
                            <li>Delete your account and data</li>
                            <li>Export your data</li>
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                            7. Contact
                        </h2>
                        <p>
                            For privacy-related questions, please contact us through the application.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Privacy;
