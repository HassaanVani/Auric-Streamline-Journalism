import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Search, Bell, Command, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function MainLayout() {
    const { user } = useAuth();
    const [searchFocused, setSearchFocused] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-primary)' }}>
            {/* Sidebar */}
            <Sidebar />

            {/* Main content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
                {/* Header */}
                <header style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem 2rem',
                    borderBottom: '1px solid var(--border-subtle)',
                    background: 'var(--bg-primary)',
                    flexShrink: 0
                }}>
                    {/* Search Bar */}
                    <div style={{ flex: 1, maxWidth: '560px' }}>
                        <div style={{ position: 'relative' }}>
                            <Search style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '18px',
                                height: '18px',
                                color: searchFocused ? 'var(--gold)' : 'var(--text-dim)'
                            }} />
                            <input
                                type="text"
                                placeholder="Search or enter command..."
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                                className="input-lg"
                                style={{
                                    width: '100%',
                                    paddingLeft: '3rem',
                                    paddingRight: '4rem'
                                }}
                            />
                            <div style={{
                                position: 'absolute',
                                right: '0.75rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '6px',
                                background: 'var(--bg-elevated)'
                            }}>
                                <Command style={{ width: '12px', height: '12px', color: 'var(--text-dim)' }} />
                                <span style={{ fontSize: '0.625rem', color: 'var(--text-dim)', fontWeight: 600 }}>K</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '2rem' }}>
                        {/* Notifications */}
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="btn-ghost"
                                style={{ position: 'relative' }}
                            >
                                <Bell style={{ width: '20px', height: '20px' }} />
                                <span style={{
                                    position: 'absolute',
                                    top: '4px',
                                    right: '4px',
                                    width: '8px',
                                    height: '8px',
                                    background: 'var(--gold)',
                                    borderRadius: '50%'
                                }} />
                            </button>

                            {/* Notifications Dropdown */}
                            {showNotifications && (
                                <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    right: 0,
                                    marginTop: '0.5rem',
                                    width: '320px',
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-subtle)',
                                    borderRadius: '12px',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                                    zIndex: 100
                                }}>
                                    <div style={{
                                        padding: '1rem',
                                        borderBottom: '1px solid var(--border-subtle)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Notifications</span>
                                        <button onClick={() => setShowNotifications(false)} className="btn-ghost" style={{ padding: '0.25rem' }}>
                                            <X style={{ width: '16px', height: '16px' }} />
                                        </button>
                                    </div>
                                    <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
                                        <Bell style={{ width: '32px', height: '32px', color: 'var(--text-dim)', margin: '0 auto 1rem' }} />
                                        <p className="text-body">No notifications yet</p>
                                        <p className="text-small" style={{ marginTop: '0.5rem' }}>
                                            You'll be notified about story updates and deadlines.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* User Avatar */}
                        <div className="avatar">{getInitials(user?.name)}</div>
                    </div>
                </header>

                {/* Page Content */}
                <main style={{ flex: 1, overflowY: 'auto' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default MainLayout;
