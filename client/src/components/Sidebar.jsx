import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { NewStoryModal } from './NewStoryModal';
import { useApi } from '../hooks/useApi';
import {
    LayoutDashboard,
    FolderOpen,
    Search,
    Users,
    Mail,
    MessageSquare,
    Video,
    FileText,
    PenTool,
    CheckCircle,
    Settings,
    HelpCircle,
    Plus,
    LogOut,
    Menu,
    X
} from 'lucide-react';

const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Home' },
    { path: '/stories', icon: FolderOpen, label: 'Stories' },
    { path: '/research', icon: Search, label: 'Research' },
    { path: '/contacts', icon: Users, label: 'Sources' },
    { path: '/email', icon: Mail, label: 'Outreach' },
    { path: '/questions', icon: MessageSquare, label: 'Questions' },
    { path: '/meetings', icon: Video, label: 'Meetings' },
    { path: '/transcripts', icon: FileText, label: 'Transcripts' },
    { path: '/drafts', icon: PenTool, label: 'Drafts' },
    { path: '/review', icon: CheckCircle, label: 'Review' },
];

export function Sidebar({ isOpen, onClose }) {
    const location = useLocation();
    const { user, logout } = useAuth();
    const api = useApi();
    const [showNewStory, setShowNewStory] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (onClose) onClose();
    }, [location.pathname]);

    const handleCreateStory = async (storyData) => {
        await api.post('/stories', storyData);
        window.location.href = '/';
    };

    const sidebarContent = (
        <>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img
                        src="/Logo.png"
                        alt="Auric"
                        style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                    />
                    <span style={{ fontFamily: "'Newsreader', serif", fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        Auric
                    </span>
                </div>
                {isMobile && onClose && (
                    <button onClick={onClose} className="btn-ghost" style={{ padding: '0.5rem' }}>
                        <X style={{ width: '20px', height: '20px' }} />
                    </button>
                )}
            </div>

            <div style={{ padding: '1rem' }}>
                <button
                    onClick={() => setShowNewStory(true)}
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                >
                    <Plus style={{ width: '16px', height: '16px' }} />
                    New Story
                </button>
            </div>

            <nav style={{ flex: 1, padding: '0 1rem', overflowY: 'auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <NavLink key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
                                <div className={`nav-link ${isActive ? 'active' : ''}`}>
                                    <item.icon style={{ width: '18px', height: '18px', flexShrink: 0 }} />
                                    <span>{item.label}</span>
                                </div>
                            </NavLink>
                        );
                    })}
                </div>
            </nav>

            <div style={{ padding: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', padding: '0.5rem' }}>
                    <div className="avatar" style={{ width: '36px', height: '36px', fontSize: '0.75rem' }}>
                        {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user?.name || 'User'}
                        </p>
                    </div>
                </div>

                <NavLink to="/settings" style={{ textDecoration: 'none' }}>
                    <div className="nav-link">
                        <Settings style={{ width: '18px', height: '18px' }} />
                        <span>Settings</span>
                    </div>
                </NavLink>

                <NavLink to="/about" style={{ textDecoration: 'none' }}>
                    <div className="nav-link">
                        <HelpCircle style={{ width: '18px', height: '18px' }} />
                        <span>Help & About</span>
                    </div>
                </NavLink>

                <button
                    onClick={logout}
                    className="nav-link"
                    style={{ width: '100%', border: 'none', cursor: 'pointer', marginTop: '0.25rem' }}
                >
                    <LogOut style={{ width: '18px', height: '18px' }} />
                    <span>Sign Out</span>
                </button>
            </div>
        </>
    );

    return (
        <>
            {isMobile ? (
                <>
                    {isOpen && (
                        <div
                            onClick={onClose}
                            style={{
                                position: 'fixed',
                                inset: 0,
                                background: 'rgba(0,0,0,0.6)',
                                zIndex: 99
                            }}
                        />
                    )}
                    <aside style={{
                        position: 'fixed',
                        left: isOpen ? 0 : '-260px',
                        top: 0,
                        width: '260px',
                        height: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        background: 'var(--bg-primary)',
                        borderRight: '1px solid var(--border-subtle)',
                        zIndex: 100,
                        transition: 'left 0.2s ease'
                    }}>
                        {sidebarContent}
                    </aside>
                </>
            ) : (
                <aside style={{
                    width: '240px',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'var(--bg-primary)',
                    borderRight: '1px solid var(--border-subtle)',
                    flexShrink: 0
                }}>
                    {sidebarContent}
                </aside>
            )}

            <NewStoryModal
                isOpen={showNewStory}
                onClose={() => setShowNewStory(false)}
                onCreate={handleCreateStory}
            />
        </>
    );
}

export function MobileMenuButton({ onClick }) {
    return (
        <button onClick={onClick} className="btn-ghost" style={{ padding: '0.5rem' }}>
            <Menu style={{ width: '24px', height: '24px' }} />
        </button>
    );
}

export default Sidebar;
