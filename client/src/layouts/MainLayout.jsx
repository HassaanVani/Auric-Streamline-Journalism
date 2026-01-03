import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar, MobileMenuButton } from '../components/Sidebar';
import { Search, Bell, Command, X, FileText, Users, BookOpen, Mail, MessageSquare, Calendar, PenTool, CheckCircle, Settings, Info, Sparkles, Menu } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

const commands = [
    { name: 'Dashboard', path: '/', icon: FileText, keywords: ['home', 'main'] },
    { name: 'Stories', path: '/stories', icon: BookOpen, keywords: ['investigations', 'projects'] },
    { name: 'Research', path: '/research', icon: Sparkles, keywords: ['search', 'ai', 'find'] },
    { name: 'Contacts', path: '/contacts', icon: Users, keywords: ['sources', 'people'] },
    { name: 'Email Outreach', path: '/email', icon: Mail, keywords: ['message', 'send'] },
    { name: 'Questions', path: '/questions', icon: MessageSquare, keywords: ['interview', 'ask'] },
    { name: 'Meetings', path: '/meetings', icon: Calendar, keywords: ['schedule', 'interview'] },
    { name: 'Transcripts', path: '/transcripts', icon: FileText, keywords: ['notes', 'audio'] },
    { name: 'Article Drafts', path: '/drafts', icon: PenTool, keywords: ['write', 'edit'] },
    { name: 'Editorial Review', path: '/review', icon: CheckCircle, keywords: ['approve', 'publish'] },
    { name: 'Settings', path: '/settings', icon: Settings, keywords: ['preferences', 'account'] },
    { name: 'About', path: '/about', icon: Info, keywords: ['help', 'info'] },
];

export function MainLayout() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const filteredCommands = searchValue.trim()
        ? commands.filter(cmd =>
            cmd.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            cmd.keywords.some(k => k.includes(searchValue.toLowerCase()))
        )
        : commands.slice(0, 6);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleSearchKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(i => Math.min(i + 1, filteredCommands.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(i => Math.max(i - 1, 0));
        } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
            navigate(filteredCommands[selectedIndex].path);
            setSearchValue('');
            inputRef.current?.blur();
        } else if (e.key === 'Escape') {
            setSearchValue('');
            inputRef.current?.blur();
        }
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-primary)' }}>
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
                <header style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: isMobile ? '0.75rem 1rem' : '1rem 2rem',
                    borderBottom: '1px solid var(--border-subtle)',
                    background: 'var(--bg-primary)',
                    flexShrink: 0,
                    gap: '0.75rem'
                }}>
                    {isMobile && (
                        <MobileMenuButton onClick={() => setSidebarOpen(true)} />
                    )}

                    {!isMobile && (
                        <div style={{ flex: 1, maxWidth: '480px', position: 'relative' }}>
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
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Quick navigation... ⌘K"
                                    value={searchValue}
                                    onChange={(e) => { setSearchValue(e.target.value); setSelectedIndex(0); }}
                                    onFocus={() => setSearchFocused(true)}
                                    onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                                    onKeyDown={handleSearchKeyDown}
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

                            {searchFocused && (
                                <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    right: 0,
                                    marginTop: '0.5rem',
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-subtle)',
                                    borderRadius: '12px',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                                    zIndex: 100,
                                    overflow: 'hidden'
                                }}>
                                    <div style={{ padding: '0.5rem' }}>
                                        {filteredCommands.map((cmd, i) => (
                                            <button
                                                key={cmd.path}
                                                onClick={() => { navigate(cmd.path); setSearchValue(''); }}
                                                style={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.75rem',
                                                    padding: '0.75rem 1rem',
                                                    background: i === selectedIndex ? 'var(--gold-muted)' : 'transparent',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    textAlign: 'left'
                                                }}
                                            >
                                                <cmd.icon style={{ width: '18px', height: '18px', color: i === selectedIndex ? 'var(--gold)' : 'var(--text-dim)' }} />
                                                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{cmd.name}</span>
                                            </button>
                                        ))}
                                        {filteredCommands.length === 0 && (
                                            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                                                No results found
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {isMobile && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <img src="/Logo.png" alt="Auric" style={{ width: '28px', height: '28px' }} />
                            <span style={{ fontFamily: "'Newsreader', serif", fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)' }}>Auric</span>
                        </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: isMobile ? 'auto' : '2rem' }}>
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="btn-ghost"
                                style={{ position: 'relative' }}
                            >
                                <Bell style={{ width: '20px', height: '20px' }} />
                            </button>

                            {showNotifications && (
                                <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    right: 0,
                                    marginTop: '0.5rem',
                                    width: isMobile ? '280px' : '320px',
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
                                            You'll be notified about story updates.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {!isMobile && <div className="avatar">{getInitials(user?.name)}</div>}
                    </div>
                </header>

                <main style={{ flex: 1, overflowY: 'auto' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default MainLayout;
