import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-primary)',
            padding: '2rem'
        }}>
            <div style={{ width: '100%', maxWidth: '400px' }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <img src="/Logo.png" alt="Auric" style={{ width: '48px', height: '48px', marginBottom: '1rem' }} />
                    <h1 className="text-h1" style={{ marginBottom: '0.5rem' }}>Welcome back</h1>
                    <p className="text-body">Sign in to continue your work</p>
                </div>

                {/* Error */}
                {error && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '1rem',
                        marginBottom: '1.5rem',
                        background: 'rgba(248, 113, 113, 0.1)',
                        border: '1px solid rgba(248, 113, 113, 0.3)',
                        borderRadius: '12px'
                    }}>
                        <AlertCircle style={{ width: '20px', height: '20px', color: 'var(--danger)' }} />
                        <span className="text-small" style={{ color: 'var(--danger)' }}>{error}</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
                        <div style={{ position: 'relative' }}>
                            <Mail style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '18px',
                                height: '18px',
                                color: 'var(--text-dim)'
                            }} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="input"
                                style={{ paddingLeft: '3rem' }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '18px',
                                height: '18px',
                                color: 'var(--text-dim)'
                            }} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="input"
                                style={{ paddingLeft: '3rem' }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                        {!loading && <ArrowRight style={{ width: '18px', height: '18px' }} />}
                    </button>
                </form>

                {/* Register link */}
                <p className="text-body" style={{ textAlign: 'center', marginTop: '2rem' }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: 'var(--gold)', textDecoration: 'none' }}>
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
