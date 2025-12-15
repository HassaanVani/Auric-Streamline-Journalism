import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Search,
    Users,
    Mail,
    MessageSquare,
    Video,
    FileText,
    PenTool,
    CheckCircle,
    Settings,
    Plus
} from 'lucide-react';

const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Home' },
    { path: '/research', icon: Search, label: 'Research' },
    { path: '/contacts', icon: Users, label: 'Sources' },
    { path: '/email', icon: Mail, label: 'Outreach' },
    { path: '/questions', icon: MessageSquare, label: 'Questions' },
    { path: '/meetings', icon: Video, label: 'Meetings' },
    { path: '/transcripts', icon: FileText, label: 'Transcripts' },
    { path: '/drafts', icon: PenTool, label: 'Drafts' },
    { path: '/review', icon: CheckCircle, label: 'Review' },
];

export function Sidebar() {
    const location = useLocation();

    return (
        <aside style={{
            width: '240px',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--bg-primary)',
            borderRight: '1px solid var(--border-subtle)',
            flexShrink: 0
        }}>
            {/* Logo */}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
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
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
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

            {/* Bottom Section */}
            <div style={{ padding: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                <button className="btn btn-primary" style={{ width: '100%', marginBottom: '0.75rem' }}>
                    <Plus style={{ width: '16px', height: '16px' }} />
                    New Story
                </button>

                <NavLink to="/settings" style={{ textDecoration: 'none' }}>
                    <div className="nav-link">
                        <Settings style={{ width: '18px', height: '18px' }} />
                        <span>Settings</span>
                    </div>
                </NavLink>
            </div>
        </aside>
    );
}

export default Sidebar;
