import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FileText, Sparkles, RefreshCw, Save, Download, Eye, Edit3,
    ChevronRight, AlertTriangle, CheckCircle, List, BookOpen
} from 'lucide-react';
import { GlassCard, GlassPanel } from '../components/GlassCard';
import { NeonButton } from '../components/NeonButton';
import { Badge } from '../components/Badge';
import { LoadingPulse } from '../components/Loading';
import { TabPanel, TabContent } from '../components/TabPanel';

const stories = [
    { id: 1, title: 'Climate Policy Reform in California', status: 'draft', progress: 65, lastUpdated: '2 hours ago' },
    { id: 2, title: 'Tech Industry Layoffs Analysis', status: 'outline', progress: 25, lastUpdated: '1 day ago' },
];

const sampleDraft = `# California's Bold Climate Agenda: A Deep Dive into Policy Reform

California has long positioned itself as a leader in environmental policy, and its latest climate initiatives represent the most ambitious push yet to address the global warming crisis.

## The Cap-and-Trade Success Story

According to Dr. Sarah Chen, a climate scientist at UC Berkeley, "The cap-and-trade program has been remarkably successful in reducing emissions while maintaining economic growth. We've seen a 20% reduction in covered emissions since 2013."

This market-based approach has generated over $15 billion in revenue since its inception, funding everything from public transit to wildfire prevention.

## Community Impact

But success at the policy level doesn't always translate to success on the ground. Local communities, particularly in disadvantaged areas, have expressed concerns about the uneven distribution of environmental benefits.

"We need policies that don't just reduce overall emissions, but specifically target pollution in communities that have borne the brunt of industrial activity," says community organizer Lisa Martinez.

## Looking Ahead

As California pushes toward its 2030 goals—a 40% reduction below 1990 levels—the question remains: can policy innovation keep pace with the urgency of the climate crisis?`;

const factChecks = [
    { id: 1, claim: '20% reduction in covered emissions since 2013', status: 'verified', source: 'CARB 2023 Report' },
    { id: 2, claim: '$15 billion in revenue', status: 'needs_review', source: 'Pending verification' },
    { id: 3, claim: '40% reduction target by 2030', status: 'verified', source: 'AB 32 Amendment' },
];

const outline = [
    { id: 1, section: 'Introduction', status: 'complete' },
    { id: 2, section: 'Cap-and-Trade Analysis', status: 'complete' },
    { id: 3, section: 'Community Impact', status: 'in_progress' },
    { id: 4, section: 'Future Outlook', status: 'pending' },
    { id: 5, section: 'Conclusion', status: 'pending' },
];

const tabs = [
    { id: 'editor', label: 'Editor', icon: Edit3 },
    { id: 'preview', label: 'Preview', icon: Eye },
    { id: 'outline', label: 'Outline', icon: List },
];

export function ArticleDraft() {
    const [activeTab, setActiveTab] = useState('editor');
    const [content, setContent] = useState(sampleDraft);
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedStory, setSelectedStory] = useState(stories[0]);

    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => { setIsGenerating(false); setContent(sampleDraft); }, 2500);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-display font-bold text-white mb-2">Article Drafting</h1>
                    <p className="text-slate-400">AI-assisted article drafting from research and interviews</p>
                </div>
                <NeonButton variant="primary" icon={Sparkles}>New Draft</NeonButton>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Story selector sidebar */}
                <div className="space-y-4">
                    <GlassCard className="p-4">
                        <h3 className="font-medium text-white mb-3">Your Stories</h3>
                        {stories.map(story => (
                            <button key={story.id} onClick={() => setSelectedStory(story)} className={`w-full p-3 rounded-lg text-left mb-2 transition-all ${selectedStory.id === story.id ? 'bg-neon-cyan/10 border border-neon-cyan/30' : 'bg-white/5 hover:bg-white/10'}`}>
                                <p className="font-medium text-white text-sm mb-1">{story.title}</p>
                                <div className="flex items-center gap-2">
                                    <Badge variant={story.status === 'draft' ? 'cyan' : 'default'} size="sm">{story.status}</Badge>
                                    <span className="text-xs text-slate-500">{story.progress}%</span>
                                </div>
                            </button>
                        ))}
                    </GlassCard>
                </div>

                {/* Main editor */}
                <div className="lg:col-span-2 space-y-4">
                    <GlassCard className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <TabPanel tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
                            <div className="flex gap-2">
                                <NeonButton size="sm" variant="ghost" icon={RefreshCw} onClick={handleGenerate}>Regenerate</NeonButton>
                                <NeonButton size="sm" variant="ghost" icon={Save}>Save</NeonButton>
                                <NeonButton size="sm" variant="default" icon={Download}>Export</NeonButton>
                            </div>
                        </div>

                        {isGenerating ? (
                            <div className="py-16"><LoadingPulse className="justify-center" /><p className="text-center text-sm text-slate-400 mt-4">Synthesizing research and interviews into article...</p></div>
                        ) : (
                            <>
                                <TabContent tabId="editor" activeTab={activeTab}>
                                    <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full h-[500px] p-4 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-mono text-sm leading-relaxed focus:border-neon-cyan/50 focus:outline-none resize-none" />
                                </TabContent>
                                <TabContent tabId="preview" activeTab={activeTab}>
                                    <div className="p-6 rounded-xl bg-white/5 border border-white/10 prose prose-invert max-w-none prose-headings:font-display prose-h1:text-2xl prose-h2:text-xl prose-p:text-slate-300 prose-a:text-neon-cyan">
                                        {content.split('\n').map((line, i) => {
                                            if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-display font-bold text-white mb-4">{line.slice(2)}</h1>;
                                            if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-display font-semibold text-white mt-6 mb-3">{line.slice(3)}</h2>;
                                            if (line.trim()) return <p key={i} className="text-slate-300 mb-4 leading-relaxed">{line}</p>;
                                            return null;
                                        })}
                                    </div>
                                </TabContent>
                                <TabContent tabId="outline" activeTab={activeTab}>
                                    <div className="space-y-2">
                                        {outline.map(section => (
                                            <div key={section.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                                                <div className="flex items-center gap-3">
                                                    {section.status === 'complete' ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : section.status === 'in_progress' ? <RefreshCw className="w-5 h-5 text-neon-cyan animate-spin" /> : <div className="w-5 h-5 rounded-full border-2 border-slate-500" />}
                                                    <span className="text-white">{section.section}</span>
                                                </div>
                                                <Badge variant={section.status === 'complete' ? 'success' : section.status === 'in_progress' ? 'cyan' : 'default'} size="sm">{section.status.replace('_', ' ')}</Badge>
                                            </div>
                                        ))}
                                    </div>
                                </TabContent>
                            </>
                        )}
                    </GlassCard>
                </div>

                {/* Fact checks sidebar */}
                <div className="space-y-4">
                    <GlassCard className="p-5 border-neon-cyan/20" glow>
                        <div className="flex items-center gap-2 mb-4"><AlertTriangle className="w-5 h-5 text-amber-400" /><h3 className="font-medium text-white">Fact Checks</h3></div>
                        <div className="space-y-3">
                            {factChecks.map(fact => (
                                <div key={fact.id} className={`p-3 rounded-lg ${fact.status === 'verified' ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-amber-500/10 border border-amber-500/30'}`}>
                                    <div className="flex items-start gap-2">
                                        {fact.status === 'verified' ? <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5" /> : <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5" />}
                                        <div>
                                            <p className="text-sm text-white">{fact.claim}</p>
                                            <p className="text-xs text-slate-400 mt-1">{fact.source}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>

                    <GlassCard className="p-5">
                        <div className="flex items-center gap-2 mb-4"><BookOpen className="w-5 h-5 text-slate-400" /><h3 className="font-medium text-white">Sources Used</h3></div>
                        <div className="space-y-2 text-sm">
                            {['Dr. Sarah Chen Interview', 'CARB 2023 Report', 'AB 32 Documentation', 'Community Survey Data'].map(source => (
                                <div key={source} className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
                                    <ChevronRight className="w-4 h-4 text-slate-500" />
                                    <span className="text-slate-300">{source}</span>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}

export default ArticleDraft;
