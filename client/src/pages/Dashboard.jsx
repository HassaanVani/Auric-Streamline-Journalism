import { motion } from 'framer-motion';
import {
    Search,
    Users,
    Mail,
    FileText,
    Sparkles,
    ArrowRight,
    TrendingUp,
    Clock,
    Target,
    Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { NeonButton } from '../components/NeonButton';
import { Badge, StatusBadge } from '../components/Badge';
import { Avatar, AvatarGroup } from '../components/Avatar';

// Sample data for dashboard
const activeStories = [
    {
        id: 1,
        title: 'Climate Policy Reform in California',
        status: 'processing',
        progress: 65,
        contacts: 4,
        lastUpdated: '2 hours ago',
    },
    {
        id: 2,
        title: 'Tech Industry Layoffs Analysis',
        status: 'active',
        progress: 35,
        contacts: 2,
        lastUpdated: '5 hours ago',
    },
    {
        id: 3,
        title: 'Local Housing Crisis Investigation',
        status: 'draft',
        progress: 10,
        contacts: 0,
        lastUpdated: '1 day ago',
    },
];

const quickActions = [
    {
        id: 'research',
        label: 'Start Research',
        icon: Search,
        path: '/research',
        color: 'from-neon-cyan to-blue-500',
        description: 'AI-powered topic research'
    },
    {
        id: 'contacts',
        label: 'Find Contacts',
        icon: Users,
        path: '/contacts',
        color: 'from-electric-magenta to-purple-500',
        description: 'Discover relevant sources'
    },
    {
        id: 'email',
        label: 'Draft Outreach',
        icon: Mail,
        path: '/email',
        color: 'from-amber-400 to-orange-500',
        description: 'Generate outreach emails'
    },
    {
        id: 'article',
        label: 'Write Article',
        icon: FileText,
        path: '/drafts',
        color: 'from-emerald-400 to-teal-500',
        description: 'AI-assisted drafting'
    },
];

const stats = [
    { label: 'Active Stories', value: '12', change: '+3', icon: FileText },
    { label: 'Contacts', value: '47', change: '+8', icon: Users },
    { label: 'Interviews', value: '23', change: '+2', icon: Target },
    { label: 'Published', value: '8', change: '+1', icon: Zap },
];

export function Dashboard() {
    return (
        <div className="space-y-8">
            {/* Welcome header */}
            <div className="flex items-start justify-between">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-display font-bold text-white mb-2"
                    >
                        Good evening, John
                    </motion.h1>
                    <p className="text-slate-400">
                        You have <span className="text-neon-cyan">3 active stories</span> in progress.
                        Keep up the great work!
                    </p>
                </div>
                <NeonButton variant="primary" icon={Sparkles}>
                    New Story
                </NeonButton>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <GlassCard className="p-5">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-2.5 rounded-xl bg-white/5">
                                    <stat.icon className="w-5 h-5 text-neon-cyan" />
                                </div>
                                <span className="flex items-center gap-1 text-xs text-emerald-400">
                                    <TrendingUp className="w-3 h-3" />
                                    {stat.change}
                                </span>
                            </div>
                            <p className="text-2xl font-display font-bold text-white mb-1">
                                {stat.value}
                            </p>
                            <p className="text-sm text-slate-400">{stat.label}</p>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>

            {/* Quick actions */}
            <div>
                <h2 className="text-lg font-display font-semibold text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => (
                        <motion.div
                            key={action.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                        >
                            <Link to={action.path}>
                                <GlassCard className="p-5 group cursor-pointer">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <action.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="font-medium text-white mb-1 group-hover:text-neon-cyan transition-colors">
                                        {action.label}
                                    </h3>
                                    <p className="text-sm text-slate-400">{action.description}</p>
                                    <ArrowRight className="w-4 h-4 text-slate-500 mt-3 group-hover:translate-x-1 group-hover:text-neon-cyan transition-all" />
                                </GlassCard>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Active stories */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stories list */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-display font-semibold text-white">Active Stories</h2>
                        <Link to="/drafts" className="text-sm text-neon-cyan hover:underline">View all</Link>
                    </div>
                    <div className="space-y-4">
                        {activeStories.map((story, index) => (
                            <motion.div
                                key={story.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                            >
                                <GlassCard className="p-5">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-medium text-white mb-1">{story.title}</h3>
                                            <div className="flex items-center gap-3 text-sm text-slate-400">
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-3.5 h-3.5" />
                                                    {story.contacts} contacts
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {story.lastUpdated}
                                                </span>
                                            </div>
                                        </div>
                                        <StatusBadge status={story.status} />
                                    </div>

                                    {/* Progress bar */}
                                    <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${story.progress}%` }}
                                            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-neon-cyan to-electric-magenta rounded-full"
                                            style={{ boxShadow: '0 0 10px rgba(0, 245, 255, 0.5)' }}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-xs text-slate-500">{story.progress}% complete</span>
                                        <NeonButton size="sm" variant="ghost">
                                            Continue <ArrowRight className="w-3 h-3 ml-1" />
                                        </NeonButton>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* AI Assistant panel */}
                <div>
                    <h2 className="text-lg font-display font-semibold text-white mb-4">AI Assistant</h2>
                    <GlassCard className="p-5 border-neon-cyan/20" glow>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan to-electric-magenta flex items-center justify-center">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                                <div className="absolute -inset-1 bg-gradient-to-br from-neon-cyan to-electric-magenta rounded-xl blur opacity-30 animate-pulse" />
                            </div>
                            <div>
                                <h3 className="font-medium text-white">Aurora</h3>
                                <p className="text-xs text-slate-400">Your AI journalism assistant</p>
                            </div>
                        </div>

                        <div className="space-y-3 mb-4">
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                <p className="text-sm text-slate-300">
                                    "I noticed your climate policy story needs more local expert voices.
                                    Want me to find relevant contacts?"
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <NeonButton size="sm" variant="primary" className="flex-1">
                                Find Contacts
                            </NeonButton>
                            <NeonButton size="sm" variant="ghost">
                                Dismiss
                            </NeonButton>
                        </div>
                    </GlassCard>

                    {/* Recent activity */}
                    <h2 className="text-lg font-display font-semibold text-white mt-6 mb-4">Recent Activity</h2>
                    <GlassCard className="p-4">
                        <div className="space-y-4">
                            {[
                                { action: 'Research completed', item: 'Climate policy backgrounds', time: '10 min ago' },
                                { action: 'Email sent to', item: 'Dr. Sarah Chen', time: '1 hour ago' },
                                { action: 'Interview scheduled', item: 'Mayor Johnson', time: '2 hours ago' },
                            ].map((activity, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-neon-cyan" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white truncate">{activity.action}</p>
                                        <p className="text-xs text-slate-400">{activity.item}</p>
                                    </div>
                                    <span className="text-xs text-slate-500 whitespace-nowrap">{activity.time}</span>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
