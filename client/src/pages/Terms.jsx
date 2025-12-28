import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function Terms() {
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
                    Terms of Service
                </h1>
                <p className="text-small" style={{ marginBottom: '2rem', color: 'var(--text-dim)' }}>
                    Last updated: December 2024
                </p>

                <div style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                            1. Acceptance of Terms
                        </h2>
                        <p>
                            By creating an account and using Auric, you agree to these Terms of Service.
                            If you do not agree, please do not use the service.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                            2. Description of Service
                        </h2>
                        <p>
                            Auric is a journalism workflow management tool that helps you organize research,
                            sources, interviews, and article drafts. The service is provided "as is" for
                            personal and professional journalism use.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                            3. User Accounts
                        </h2>
                        <ul style={{ paddingLeft: '1.5rem' }}>
                            <li>You must provide accurate information when creating an account</li>
                            <li>You are responsible for maintaining the security of your account</li>
                            <li>You must notify us immediately of any unauthorized access</li>
                            <li>One person per account; sharing accounts is not permitted</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                            4. Your Content
                        </h2>
                        <p style={{ marginBottom: '1rem' }}>
                            You retain ownership of all content you create in Auric, including stories,
                            research notes, drafts, and contact information.
                        </p>
                        <p>
                            You grant us a limited license to store and display your content solely to
                            provide the service to you.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                            5. Acceptable Use
                        </h2>
                        <p style={{ marginBottom: '1rem' }}>You agree not to:</p>
                        <ul style={{ paddingLeft: '1.5rem' }}>
                            <li>Use the service for illegal purposes</li>
                            <li>Attempt to gain unauthorized access to the system</li>
                            <li>Interfere with other users' access to the service</li>
                            <li>Upload malicious code or content</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                            6. AI Features
                        </h2>
                        <p>
                            Optional AI features are powered by third-party services. By using AI features,
                            you acknowledge that your content may be processed by these services according
                            to their terms. AI-generated content should be verified before publication.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                            7. Disclaimer
                        </h2>
                        <p>
                            Auric is provided "as is" without warranties of any kind. We do not guarantee
                            uninterrupted or error-free service. Use of Auric for journalism purposes is
                            at your own discretion and risk.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                            8. Termination
                        </h2>
                        <p>
                            We may suspend or terminate your account if you violate these terms. You may
                            delete your account at any time through Settings.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                            9. Changes to Terms
                        </h2>
                        <p>
                            We may update these terms from time to time. Continued use of the service
                            after changes constitutes acceptance of the new terms.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Terms;
