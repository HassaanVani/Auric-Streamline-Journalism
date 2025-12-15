import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../hooks/useApi';
import {
    User,
    Mail,
    Lock,
    Bell,
    Palette,
    Check,
    AlertCircle
} from 'lucide-react';

export function Settings() {
    const { user, logout } = useAuth();
    const api = useApi();

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [notifications, setNotifications] = useState(user?.settings?.notifications ?? true);

    const [profileSuccess, setProfileSuccess] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [profileError, setProfileError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [saving, setSaving] = useState(false);

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setProfileError('');
        setProfileSuccess(false);

        try {
            await api.put('/settings/profile', { name, email });
            setProfileSuccess(true);
            setTimeout(() => setProfileSuccess(false), 3000);
        } catch (err) {
            setProfileError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setPasswordError('');
        setPasswordSuccess(false);

        try {
            await api.put('/settings/password', { currentPassword, newPassword });
            setPasswordSuccess(true);
            setCurrentPassword('');
            setNewPassword('');
            setTimeout(() => setPasswordSuccess(false), 3000);
        } catch (err) {
            setPasswordError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleNotificationChange = async () => {
        const newValue = !notifications;
        setNotifications(newValue);
        try {
            await api.put('/settings/preferences', { notifications: newValue });
        } catch (err) {
            setNotifications(!newValue); // Revert on error
        }
    };

    return (
        <div className="page-container" style={{ maxWidth: '800px' }}>
            <header className="page-header">
                <h1 className="text-h1" style={{ marginBottom: '0.5rem' }}>Settings</h1>
                <p className="text-body">Manage your account and preferences</p>
            </header>

            {/* Profile */}
            <section className="panel" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <User style={{ width: '20px', height: '20px', color: 'var(--gold)' }} />
                    <h2 className="text-h3">Profile</h2>
                </div>

                {profileError && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', marginBottom: '1rem', background: 'rgba(248, 113, 113, 0.1)', borderRadius: '8px' }}>
                        <AlertCircle style={{ width: '16px', height: '16px', color: 'var(--danger)' }} />
                        <span className="text-small" style={{ color: 'var(--danger)' }}>{profileError}</span>
                    </div>
                )}

                {profileSuccess && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', marginBottom: '1rem', background: 'rgba(74, 222, 128, 0.1)', borderRadius: '8px' }}>
                        <Check style={{ width: '16px', height: '16px', color: 'var(--success)' }} />
                        <span className="text-small" style={{ color: 'var(--success)' }}>Profile updated successfully</span>
                    </div>
                )}

                <form onSubmit={handleProfileSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div>
                            <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input"
                            />
                        </div>
                        <div>
                            <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input"
                            />
                        </div>
                    </div>
                    <button type="submit" disabled={saving} className="btn btn-primary">
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </section>

            {/* Password */}
            <section className="panel" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <Lock style={{ width: '20px', height: '20px', color: 'var(--gold)' }} />
                    <h2 className="text-h3">Change Password</h2>
                </div>

                {passwordError && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', marginBottom: '1rem', background: 'rgba(248, 113, 113, 0.1)', borderRadius: '8px' }}>
                        <AlertCircle style={{ width: '16px', height: '16px', color: 'var(--danger)' }} />
                        <span className="text-small" style={{ color: 'var(--danger)' }}>{passwordError}</span>
                    </div>
                )}

                {passwordSuccess && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', marginBottom: '1rem', background: 'rgba(74, 222, 128, 0.1)', borderRadius: '8px' }}>
                        <Check style={{ width: '16px', height: '16px', color: 'var(--success)' }} />
                        <span className="text-small" style={{ color: 'var(--success)' }}>Password changed successfully</span>
                    </div>
                )}

                <form onSubmit={handlePasswordSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div>
                            <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Current Password</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="input"
                            />
                        </div>
                        <div>
                            <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="input"
                            />
                        </div>
                    </div>
                    <button type="submit" disabled={saving} className="btn btn-secondary">
                        Change Password
                    </button>
                </form>
            </section>

            {/* Notifications */}
            <section className="panel" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <Bell style={{ width: '20px', height: '20px', color: 'var(--gold)' }} />
                    <h2 className="text-h3">Notifications</h2>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <p style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Email Notifications</p>
                        <p className="text-small">Receive updates about your stories and sources</p>
                    </div>
                    <button
                        onClick={handleNotificationChange}
                        style={{
                            width: '48px',
                            height: '28px',
                            borderRadius: '14px',
                            border: 'none',
                            cursor: 'pointer',
                            position: 'relative',
                            background: notifications ? 'var(--gold)' : 'var(--bg-elevated)',
                            transition: 'background 0.2s'
                        }}
                    >
                        <span style={{
                            position: 'absolute',
                            top: '2px',
                            left: notifications ? '22px' : '2px',
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: 'white',
                            transition: 'left 0.2s'
                        }} />
                    </button>
                </div>
            </section>

            {/* Danger Zone */}
            <section className="panel" style={{ borderColor: 'rgba(248, 113, 113, 0.3)' }}>
                <h2 className="text-h3" style={{ color: 'var(--danger)', marginBottom: '1rem' }}>Danger Zone</h2>
                <p className="text-body" style={{ marginBottom: '1.5rem' }}>
                    Signing out will end your current session.
                </p>
                <button onClick={logout} className="btn btn-secondary" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>
                    Sign Out
                </button>
            </section>
        </div>
    );
}

export default Settings;
