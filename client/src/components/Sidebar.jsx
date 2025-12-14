import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Search,
    Users,
    Mail,
    MessageSquareQuote,
    Video,
    FileText,
    Sparkles,
    Edit3,
    Settings,
    HelpCircle,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useState } from 'react';

const menuItems = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        path: '/',
        description: 'Overview & workflow'
    },
    {
        id: 'research',
        label: 'Research',
        icon: Search,
        path: '/research',
        description: 'AI-powered research'
    },
    {
        id: 'contacts',
        label: 'Contacts',
        icon: Users,
        path: '/contacts',
        description: 'Find & manage sources'
    },
    {
        id: 'email',
        label: 'Outreach',
        icon: Mail,
        path: '/email',
        description: 'Generate emails'
    },
    {
        id: 'questions',
        label: 'Questions',
        icon: MessageSquareQuote,
        path: '/questions',
        description: 'Interview prep'
    },
    {
        id: 'meetings',
        label: 'Meetings',
        icon: Video,
        path: '/meetings',
        description: 'Schedule calls'
    },
    {
        id: 'transcripts',
        label: 'Transcripts',
        icon: FileText,
        path: '/transcripts',
        description: 'Interview notes'
    },
    {
        id: 'drafts',
        label: 'Drafts',
        icon: Sparkles,
        path: '/drafts',
        description: 'AI article drafting'
    },
    {
        id: 'review',
        label: 'Review',
        icon: Edit3,
        path: '/review',
        description: 'Final editing'
    },
];

const bottomItems = [
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
    { id: 'help', label: 'Help', icon: HelpCircle, path: '/help' },
];

export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

    return (
        <motion.aside
            initial={false}
            animate={{ width: collapsed ? 80 : 280 }}
            transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
            className="relative h-screen flex flex-col bg-midnight-100/50 backdrop-blur-xl border-r border-white/5"
        >
            {/* Logo */}
            <div className="flex items-center gap-3 px-5 py-6 border-b border-white/5">
                <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-electric-magenta flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-br from-neon-cyan to-electric-magenta rounded-xl blur-lg opacity-40" />
                </div>
                {!collapsed && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                    >
                        <h1 className="text-xl font-display font-bold text-white">Auric</h1>
                        <p className="text-xs text-slate-400">Streamline Journalism</p>
                    </motion.div>
                )}
            </div>

            {/* Main navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.id}
                        to={item.path}
                        className={({ isActive }) => `
              group flex items-center gap-3 px-3 py-2.5 rounded-xl
              transition-all duration-300
              ${isActive
                                ? 'bg-gradient-to-r from-neon-cyan/10 to-electric-magenta/5 text-neon-cyan border-l-2 border-neon-cyan shadow-[0_0_20px_rgba(0,245,255,0.1)]'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }
            `}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-neon-cyan' : ''}`} />
                                {!collapsed && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex-1 min-w-0"
                                    >
                                        <span className="block font-medium truncate">{item.label}</span>
                                        <span className="block text-xs text-slate-500 truncate">{item.description}</span>
                                    </motion.div>
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Divider */}
            <div className="mx-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Bottom navigation */}
            <div className="py-4 px-3 space-y-1">
                {bottomItems.map((item) => (
                    <NavLink
                        key={item.id}
                        to={item.path}
                        className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl
              transition-all duration-300
              ${isActive
                                ? 'text-neon-cyan bg-white/5'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }
            `}
                    >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {!collapsed && <span className="font-medium">{item.label}</span>}
                    </NavLink>
                ))}
            </div>

            {/* Collapse button */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-midnight border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-neon-cyan/50 transition-all duration-300 z-10"
            >
                {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
        </motion.aside>
    );
}

export default Sidebar;
