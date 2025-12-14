import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    UserPlus,
    Filter,
    MapPin,
    Building2,
    Mail,
    Phone,
    ExternalLink,
    Star,
    MoreHorizontal,
    Grid,
    List,
    Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { NeonButton } from '../components/NeonButton';
import { Badge, RelevanceScore } from '../components/Badge';
import { Avatar } from '../components/Avatar';
import { TabPanel } from '../components/TabPanel';

// Sample contacts data
const sampleContacts = [
    {
        id: 1,
        name: 'Dr. Sarah Chen',
        title: 'Climate Scientist',
        organization: 'UC Berkeley Environmental Research',
        location: 'Berkeley, CA',
        email: 'sarah.chen@berkeley.edu',
        phone: '+1 (510) 555-0123',
        relevance: 95,
        expertise: ['Climate Policy', 'Environmental Science', 'Sustainability'],
        status: 'available',
        lastContact: null,
        avatar: null,
    },
    {
        id: 2,
        name: 'Mayor James Wilson',
        title: 'City Mayor',
        organization: 'City of Oakland',
        location: 'Oakland, CA',
        email: 'mayor.wilson@oakland.gov',
        phone: '+1 (510) 555-0456',
        relevance: 88,
        expertise: ['Local Government', 'Urban Policy', 'Community Development'],
        status: 'busy',
        lastContact: '2 days ago',
        avatar: null,
    },
    {
        id: 3,
        name: 'Lisa Martinez',
        title: 'Community Organizer',
        organization: 'Bay Area Climate Coalition',
        location: 'San Francisco, CA',
        email: 'lisa@bayareaclimate.org',
        phone: '+1 (415) 555-0789',
        relevance: 82,
        expertise: ['Grassroots Organizing', 'Climate Justice', 'Community Engagement'],
        status: 'available',
        lastContact: '1 week ago',
        avatar: null,
    },
    {
        id: 4,
        name: 'Dr. Michael Thompson',
        title: 'Economics Professor',
        organization: 'Stanford University',
        location: 'Stanford, CA',
        email: 'm.thompson@stanford.edu',
        phone: '+1 (650) 555-0321',
        relevance: 75,
        expertise: ['Environmental Economics', 'Policy Analysis', 'Market Research'],
        status: 'available',
        lastContact: null,
        avatar: null,
    },
];

const tabs = [
    { id: 'all', label: 'All Contacts', badge: 24 },
    { id: 'recent', label: 'Recently Added', badge: 5 },
    { id: 'favorites', label: 'Favorites', icon: Star, badge: 3 },
];

export function Contacts() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [contacts, setContacts] = useState(sampleContacts);

    const statusColors = {
        available: 'text-emerald-400',
        busy: 'text-amber-400',
        offline: 'text-slate-400',
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-display font-bold text-white mb-2">Contact Discovery</h1>
                    <p className="text-slate-400">Find and manage sources for your stories</p>
                </div>
                <NeonButton variant="primary" icon={Sparkles}>
                    AI Find Contacts
                </NeonButton>
            </div>

            {/* Search and filters */}
            <GlassCard className="p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search input */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search contacts by name, organization, or expertise..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:border-neon-cyan/50 focus:outline-none transition-all"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-2">
                        <NeonButton size="md" variant="ghost" icon={Filter}>
                            Filters
                        </NeonButton>
                        <NeonButton size="md" variant="ghost" icon={MapPin}>
                            Location
                        </NeonButton>
                        <NeonButton size="md" variant="ghost" icon={Building2}>
                            Organization
                        </NeonButton>

                        {/* View mode toggle */}
                        <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg ml-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-neon-cyan/20 text-neon-cyan' : 'text-slate-400 hover:text-white'}`}
                            >
                                <Grid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-neon-cyan/20 text-neon-cyan' : 'text-slate-400 hover:text-white'}`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </GlassCard>

            {/* Tabs */}
            <TabPanel tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

            {/* Contacts Grid */}
            <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {contacts.map((contact, index) => (
                    <motion.div
                        key={contact.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link to={`/contacts/${contact.id}`}>
                            <GlassCard className="p-5 group">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar
                                            name={contact.name}
                                            src={contact.avatar}
                                            size="lg"
                                            showStatus
                                            status={contact.status}
                                        />
                                        <div>
                                            <h3 className="font-medium text-white group-hover:text-neon-cyan transition-colors">
                                                {contact.name}
                                            </h3>
                                            <p className="text-sm text-slate-400">{contact.title}</p>
                                        </div>
                                    </div>
                                    <RelevanceScore score={contact.relevance} />
                                </div>

                                {/* Organization */}
                                <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
                                    <Building2 className="w-4 h-4" />
                                    <span className="truncate">{contact.organization}</span>
                                </div>

                                {/* Location */}
                                <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
                                    <MapPin className="w-4 h-4" />
                                    <span>{contact.location}</span>
                                </div>

                                {/* Expertise tags */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {contact.expertise.slice(0, 3).map((skill) => (
                                        <Badge key={skill} variant="default" size="sm">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                                    <NeonButton size="sm" variant="ghost" icon={Mail}>
                                        Email
                                    </NeonButton>
                                    <NeonButton size="sm" variant="ghost" icon={Phone}>
                                        Call
                                    </NeonButton>
                                    <NeonButton size="sm" variant="ghost" icon={Star}>
                                        Save
                                    </NeonButton>
                                    <button className="ml-auto p-2 text-slate-400 hover:text-white transition-colors">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Last contact info */}
                                {contact.lastContact && (
                                    <p className="text-xs text-slate-500 mt-3">
                                        Last contacted: {contact.lastContact}
                                    </p>
                                )}
                            </GlassCard>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Empty state / Add contact suggestion */}
            <GlassCard className="p-8 text-center border-dashed border-white/20">
                <UserPlus className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                    Need more contacts?
                </h3>
                <p className="text-slate-400 mb-4 max-w-md mx-auto">
                    Let our AI discover relevant experts, officials, and community members based on your story topic.
                </p>
                <NeonButton variant="primary" icon={Sparkles}>
                    Discover Contacts with AI
                </NeonButton>
            </GlassCard>
        </div>
    );
}

export default Contacts;
