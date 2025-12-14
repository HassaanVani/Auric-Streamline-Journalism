import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Mail,
    Phone,
    Calendar,
    ExternalLink,
    Building2,
    MapPin,
    Star,
    MoreHorizontal,
    Edit3,
    MessageSquare,
    FileText,
    Video,
    Clock,
    Sparkles,
    Plus,
    BookOpen,
    Link2
} from 'lucide-react';
import { GlassCard, GlassPanel } from '../components/GlassCard';
import { NeonButton } from '../components/NeonButton';
import { Badge, RelevanceScore, StatusBadge } from '../components/Badge';
import { Avatar } from '../components/Avatar';
import { TabPanel, TabContent } from '../components/TabPanel';

// Sample contact data
const contactData = {
    id: 1,
    name: 'Dr. Sarah Chen',
    title: 'Climate Scientist',
    organization: 'UC Berkeley Environmental Research',
    location: 'Berkeley, CA',
    email: 'sarah.chen@berkeley.edu',
    phone: '+1 (510) 555-0123',
    website: 'https://research.berkeley.edu/chen',
    relevance: 95,
    expertise: ['Climate Policy', 'Environmental Science', 'Sustainability', 'Carbon Markets'],
    status: 'available',
    bio: 'Dr. Sarah Chen is a leading climate scientist with over 15 years of experience in environmental research. Her work focuses on the intersection of climate policy and sustainable development.',
    avatar: null,
    socialLinks: {
        twitter: '@sarahchen_climate',
        linkedin: 'linkedin.com/in/sarahchen',
    },
};

const relatedArticles = [
    { id: 1, title: 'California Sets New Emission Targets', date: '2024-02-15', source: 'SF Chronicle' },
    { id: 2, title: 'UC Berkeley Climate Study Published', date: '2024-01-20', source: 'Nature' },
    { id: 3, title: 'Interview: Future of Green Energy', date: '2023-12-10', source: 'The Atlantic' },
];

const notes = [
    { id: 1, text: 'Expert on cap-and-trade policies. Mentioned interest in discussing recent AB 32 updates.', date: '2 days ago' },
    { id: 2, text: 'Referred by Prof. Michael Thompson at Stanford.', date: '1 week ago' },
];

const timeline = [
    { id: 1, action: 'Added to story', story: 'Climate Policy Reform', date: '2 days ago' },
    { id: 2, action: 'Email sent', details: 'Interview request', date: '2 days ago', status: 'pending' },
    { id: 3, action: 'Profile created', details: 'via AI discovery', date: '1 week ago' },
];

const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'articles', label: 'Related Articles', badge: 3 },
    { id: 'notes', label: 'Notes', badge: 2 },
    { id: 'timeline', label: 'Timeline' },
];

export function ContactProfile() {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('overview');
    const [isFavorite, setIsFavorite] = useState(false);
    const contact = contactData; // In real app, fetch by id

    return (
        <div className="space-y-6">
            {/* Back button */}
            <Link
                to="/contacts"
                className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Contacts
            </Link>

            {/* Profile header */}
            <GlassCard className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Avatar and basic info */}
                    <div className="flex items-start gap-4">
                        <Avatar
                            name={contact.name}
                            src={contact.avatar}
                            size="xl"
                            showStatus
                            status={contact.status}
                            glow
                        />
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-2xl font-display font-bold text-white">{contact.name}</h1>
                                <RelevanceScore score={contact.relevance} />
                            </div>
                            <p className="text-lg text-slate-400 mb-2">{contact.title}</p>
                            <div className="flex items-center gap-4 text-sm text-slate-400">
                                <span className="flex items-center gap-1">
                                    <Building2 className="w-4 h-4" />
                                    {contact.organization}
                                </span>
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {contact.location}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 lg:ml-auto">
                        <NeonButton variant="primary" icon={Mail}>
                            Compose Email
                        </NeonButton>
                        <NeonButton variant="default" icon={Video}>
                            Schedule Call
                        </NeonButton>
                        <NeonButton variant="default" icon={MessageSquare}>
                            Generate Questions
                        </NeonButton>
                        <NeonButton
                            variant="ghost"
                            icon={Star}
                            onClick={() => setIsFavorite(!isFavorite)}
                            className={isFavorite ? 'text-amber-400' : ''}
                        >
                            {isFavorite ? 'Favorited' : 'Add to Favorites'}
                        </NeonButton>
                    </div>
                </div>

                {/* Contact details row */}
                <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-white/5">
                    <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-sm text-slate-300 hover:text-neon-cyan transition-colors">
                        <Mail className="w-4 h-4" />
                        {contact.email}
                    </a>
                    <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-sm text-slate-300 hover:text-neon-cyan transition-colors">
                        <Phone className="w-4 h-4" />
                        {contact.phone}
                    </a>
                    <a href={contact.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-slate-300 hover:text-neon-cyan transition-colors">
                        <ExternalLink className="w-4 h-4" />
                        Website
                    </a>
                </div>

                {/* Expertise */}
                <div className="mt-4">
                    <p className="text-sm text-slate-500 mb-2">Expertise</p>
                    <div className="flex flex-wrap gap-2">
                        {contact.expertise.map((skill) => (
                            <Badge key={skill} variant="cyan" size="md">
                                {skill}
                            </Badge>
                        ))}
                    </div>
                </div>
            </GlassCard>

            {/* Tabs */}
            <TabPanel tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

            {/* Tab content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <TabContent tabId="overview" activeTab={activeTab}>
                        <GlassCard className="p-6">
                            <h3 className="text-lg font-medium text-white mb-4">Biography</h3>
                            <p className="text-slate-300 leading-relaxed">{contact.bio}</p>

                            <div className="mt-6 pt-6 border-t border-white/5">
                                <h4 className="text-md font-medium text-white mb-3">AI-Generated Insights</h4>
                                <GlassPanel className="p-4 border-neon-cyan/20">
                                    <div className="flex items-start gap-3">
                                        <Sparkles className="w-5 h-5 text-neon-cyan flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-slate-300">
                                                Dr. Chen has been quoted in 47 articles about California climate policy in the past year.
                                                Her research on cap-and-trade systems makes her an ideal source for stories about emissions regulations.
                                            </p>
                                            <p className="text-xs text-slate-500 mt-2">Last updated: 2 hours ago</p>
                                        </div>
                                    </div>
                                </GlassPanel>
                            </div>
                        </GlassCard>
                    </TabContent>

                    <TabContent tabId="articles" activeTab={activeTab}>
                        <GlassCard className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-white">Related Articles</h3>
                                <NeonButton size="sm" variant="ghost" icon={Plus}>Add Article</NeonButton>
                            </div>
                            <div className="space-y-4">
                                {relatedArticles.map((article) => (
                                    <div key={article.id} className="flex items-start justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                                        <div className="flex items-start gap-3">
                                            <FileText className="w-5 h-5 text-slate-400 mt-0.5" />
                                            <div>
                                                <h4 className="font-medium text-white hover:text-neon-cyan cursor-pointer transition-colors">
                                                    {article.title}
                                                </h4>
                                                <p className="text-sm text-slate-400">{article.source} • {article.date}</p>
                                            </div>
                                        </div>
                                        <NeonButton size="sm" variant="ghost" icon={ExternalLink}>View</NeonButton>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    </TabContent>

                    <TabContent tabId="notes" activeTab={activeTab}>
                        <GlassCard className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-white">Notes</h3>
                                <NeonButton size="sm" variant="primary" icon={Plus}>Add Note</NeonButton>
                            </div>
                            <div className="space-y-4">
                                {notes.map((note) => (
                                    <div key={note.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                                        <p className="text-slate-300 mb-2">{note.text}</p>
                                        <p className="text-xs text-slate-500">{note.date}</p>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    </TabContent>

                    <TabContent tabId="timeline" activeTab={activeTab}>
                        <GlassCard className="p-6">
                            <h3 className="text-lg font-medium text-white mb-4">Activity Timeline</h3>
                            <div className="relative">
                                {timeline.map((event, index) => (
                                    <div key={event.id} className="flex gap-4 pb-6 last:pb-0">
                                        <div className="relative">
                                            <div className="w-3 h-3 rounded-full bg-neon-cyan" />
                                            {index < timeline.length - 1 && (
                                                <div className="absolute top-3 left-1.5 w-px h-full -translate-x-1/2 bg-white/10" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-white">{event.action}</p>
                                            <p className="text-sm text-slate-400">{event.details || event.story}</p>
                                            <p className="text-xs text-slate-500 mt-1">{event.date}</p>
                                        </div>
                                        {event.status && <StatusBadge status={event.status} />}
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    </TabContent>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    {/* Quick actions */}
                    <GlassCard className="p-5">
                        <h3 className="font-medium text-white mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <NeonButton size="md" variant="default" icon={Mail} className="w-full justify-start">
                                Send Email
                            </NeonButton>
                            <NeonButton size="md" variant="default" icon={Calendar} className="w-full justify-start">
                                Schedule Interview
                            </NeonButton>
                            <NeonButton size="md" variant="default" icon={MessageSquare} className="w-full justify-start">
                                Generate Questions
                            </NeonButton>
                            <NeonButton size="md" variant="default" icon={BookOpen} className="w-full justify-start">
                                Research Background
                            </NeonButton>
                        </div>
                    </GlassCard>

                    {/* Social links */}
                    <GlassCard className="p-5">
                        <h3 className="font-medium text-white mb-4">Social Profiles</h3>
                        <div className="space-y-3">
                            {Object.entries(contact.socialLinks).map(([platform, handle]) => (
                                <a
                                    key={platform}
                                    href="#"
                                    className="flex items-center gap-3 text-sm text-slate-300 hover:text-neon-cyan transition-colors"
                                >
                                    <Link2 className="w-4 h-4" />
                                    <span className="capitalize">{platform}:</span>
                                    <span className="text-slate-400">{handle}</span>
                                </a>
                            ))}
                        </div>
                    </GlassCard>

                    {/* Stories using this contact */}
                    <GlassCard className="p-5">
                        <h3 className="font-medium text-white mb-4">Used in Stories</h3>
                        <div className="space-y-3">
                            <div className="p-3 rounded-lg bg-white/5">
                                <p className="text-sm font-medium text-white">Climate Policy Reform</p>
                                <p className="text-xs text-slate-400">Active • 65% complete</p>
                            </div>
                            <NeonButton size="sm" variant="ghost" icon={Plus} className="w-full">
                                Add to Story
                            </NeonButton>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}

export default ContactProfile;
