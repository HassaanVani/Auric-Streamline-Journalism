import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Sparkles,
    ExternalLink,
    BookOpen,
    Clock,
    Filter,
    Save,
    Share2,
    RefreshCw,
    ChevronRight,
    Lightbulb,
    Globe,
    FileText
} from 'lucide-react';
import { GlassCard, GlassPanel } from '../components/GlassCard';
import { NeonButton } from '../components/NeonButton';
import { Badge } from '../components/Badge';
import { LoadingPulse, Skeleton } from '../components/Loading';
import { TabPanel, TabContent } from '../components/TabPanel';

// Sample research results
const sampleResults = [
    {
        id: 1,
        title: 'California Climate Policy: A Comprehensive Overview',
        source: 'California Government',
        url: 'https://example.com/climate-policy',
        summary: 'California has been at the forefront of climate policy in the United States, implementing ambitious goals to reduce greenhouse gas emissions by 40% below 1990 levels by 2030.',
        relevance: 95,
        type: 'government',
        date: '2024-01-15',
    },
    {
        id: 2,
        title: 'Impact of AB 32 on California Industries',
        source: 'Environmental Research Institute',
        url: 'https://example.com/ab32-impact',
        summary: 'Analysis of how the Global Warming Solutions Act (AB 32) has affected various industries in California, including manufacturing, energy, and agriculture sectors.',
        relevance: 88,
        type: 'research',
        date: '2024-02-20',
    },
    {
        id: 3,
        title: 'Local Communities Lead Climate Action',
        source: 'The Daily Chronicle',
        url: 'https://example.com/local-climate',
        summary: 'Grassroots movements in California cities are pushing for more aggressive climate policies, with several municipalities declaring climate emergencies.',
        relevance: 82,
        type: 'news',
        date: '2024-03-10',
    },
];

const insights = [
    'Key policy: AB 32 targets 40% emission reduction by 2030',
    'Major sectors affected: Transportation, Energy, Agriculture',
    'Recent developments: Cap-and-trade program expansion',
    'Public sentiment: 65% support stronger climate action',
];

const tabs = [
    { id: 'all', label: 'All Results', badge: 12 },
    { id: 'news', label: 'News', icon: FileText, badge: 5 },
    { id: 'research', label: 'Research', icon: BookOpen, badge: 4 },
    { id: 'government', label: 'Government', icon: Globe, badge: 3 },
];

export function Research() {
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState(sampleResults);
    const [activeTab, setActiveTab] = useState('all');
    const [showInsights, setShowInsights] = useState(true);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsSearching(true);
        // Simulate AI research
        setTimeout(() => {
            setIsSearching(false);
            setResults(sampleResults);
        }, 2000);
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'news': return FileText;
            case 'research': return BookOpen;
            case 'government': return Globe;
            default: return FileText;
        }
    };

    const filteredResults = activeTab === 'all'
        ? results
        : results.filter(r => r.type === activeTab);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-display font-bold text-white mb-2">Research Module</h1>
                <p className="text-slate-400">AI-powered research to gather context, facts, and sources for your stories</p>
            </div>

            {/* Search Section */}
            <GlassCard className="p-6">
                <form onSubmit={handleSearch}>
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Enter a topic, question, or story angle..."
                                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:border-neon-cyan/50 focus:outline-none focus:shadow-[0_0_20px_rgba(0,245,255,0.15)] transition-all"
                            />
                        </div>
                        <NeonButton type="submit" variant="primary" size="lg" icon={Sparkles} loading={isSearching}>
                            Research with AI
                        </NeonButton>
                    </div>

                    {/* Quick suggestions */}
                    <div className="flex items-center gap-2 mt-4">
                        <span className="text-sm text-slate-500">Try:</span>
                        {['Climate change California', 'Tech layoffs 2024', 'Housing crisis solutions'].map((suggestion) => (
                            <button
                                key={suggestion}
                                type="button"
                                onClick={() => setQuery(suggestion)}
                                className="px-3 py-1 text-sm rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-neon-cyan/30 transition-all"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </form>
            </GlassCard>

            {/* Loading state */}
            <AnimatePresence>
                {isSearching && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <GlassCard className="p-8">
                            <LoadingPulse className="justify-center" />
                            <div className="mt-6 space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex gap-4">
                                        <Skeleton className="w-12 h-12 rounded-xl" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton variant="title" />
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-3/4" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results */}
            {!isSearching && results.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main results */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Tabs and filters */}
                        <div className="flex items-center justify-between">
                            <TabPanel tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
                            <div className="flex items-center gap-2">
                                <NeonButton size="sm" variant="ghost" icon={Filter}>
                                    Filter
                                </NeonButton>
                                <NeonButton size="sm" variant="ghost" icon={RefreshCw}>
                                    Refresh
                                </NeonButton>
                            </div>
                        </div>

                        {/* Results list */}
                        <div className="space-y-4">
                            {filteredResults.map((result, index) => {
                                const TypeIcon = getTypeIcon(result.type);
                                return (
                                    <motion.div
                                        key={result.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <GlassCard className="p-5">
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 rounded-xl bg-white/5 flex-shrink-0">
                                                    <TypeIcon className="w-5 h-5 text-neon-cyan" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-4 mb-2">
                                                        <div>
                                                            <h3 className="font-medium text-white hover:text-neon-cyan transition-colors cursor-pointer">
                                                                {result.title}
                                                            </h3>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="text-sm text-slate-400">{result.source}</span>
                                                                <span className="text-slate-600">•</span>
                                                                <span className="text-sm text-slate-500">{result.date}</span>
                                                            </div>
                                                        </div>
                                                        <Badge variant="cyan">{result.relevance}% match</Badge>
                                                    </div>
                                                    <p className="text-sm text-slate-300 mb-4">{result.summary}</p>
                                                    <div className="flex items-center gap-2">
                                                        <NeonButton size="sm" variant="ghost" icon={ExternalLink}>
                                                            View Source
                                                        </NeonButton>
                                                        <NeonButton size="sm" variant="ghost" icon={Save}>
                                                            Save
                                                        </NeonButton>
                                                        <NeonButton size="sm" variant="ghost" icon={Share2}>
                                                            Share
                                                        </NeonButton>
                                                    </div>
                                                </div>
                                            </div>
                                        </GlassCard>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Insights sidebar */}
                    <div className="space-y-4">
                        {/* AI Insights */}
                        <GlassCard className="p-5 border-neon-cyan/20" glow>
                            <div className="flex items-center gap-2 mb-4">
                                <Lightbulb className="w-5 h-5 text-neon-cyan" />
                                <h3 className="font-medium text-white">AI Insights</h3>
                            </div>
                            <div className="space-y-3">
                                {insights.map((insight, i) => (
                                    <div key={i} className="flex items-start gap-2">
                                        <ChevronRight className="w-4 h-4 text-neon-cyan mt-0.5 flex-shrink-0" />
                                        <p className="text-sm text-slate-300">{insight}</p>
                                    </div>
                                ))}
                            </div>
                            <NeonButton size="sm" variant="primary" className="w-full mt-4">
                                Generate Report
                            </NeonButton>
                        </GlassCard>

                        {/* Saved Research */}
                        <GlassCard className="p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-medium text-white">Saved Research</h3>
                                <Badge variant="default">5 items</Badge>
                            </div>
                            <div className="space-y-3">
                                {['Climate Policy Overview', 'Expert Interview Notes', 'Statistical Data'].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
                                        <BookOpen className="w-4 h-4 text-slate-400" />
                                        <span className="text-sm text-slate-300 truncate">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>

                        {/* Research History */}
                        <GlassCard className="p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <Clock className="w-5 h-5 text-slate-400" />
                                <h3 className="font-medium text-white">Recent Searches</h3>
                            </div>
                            <div className="space-y-2">
                                {['Housing market trends', 'Local government officials', 'Environmental regulations'].map((search, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setQuery(search)}
                                        className="block w-full text-left px-3 py-2 text-sm text-slate-400 rounded-lg hover:bg-white/5 hover:text-white transition-colors"
                                    >
                                        {search}
                                    </button>
                                ))}
                            </div>
                        </GlassCard>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Research;
