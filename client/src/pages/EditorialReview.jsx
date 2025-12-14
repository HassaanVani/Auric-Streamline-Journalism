import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Edit3, CheckCircle, AlertCircle, Lightbulb, Download, Share2,
    Eye, Type, AlignLeft, Sparkles, FileText, Clock, Send
} from 'lucide-react';
import { GlassCard, GlassPanel } from '../components/GlassCard';
import { NeonButton } from '../components/NeonButton';
import { Badge } from '../components/Badge';
import { TabPanel, TabContent } from '../components/TabPanel';

const styleSuggestions = [
    { id: 1, type: 'clarity', original: 'The policy has been implemented in a manner that is quite effective.', suggestion: 'The policy has been effectively implemented.', reason: 'More concise and direct' },
    { id: 2, type: 'tone', original: 'Officials claim the results are good.', suggestion: 'Officials report positive results.', reason: 'More neutral journalistic tone' },
    { id: 3, type: 'grammar', original: 'The data shows that emissions has decreased.', suggestion: 'The data show that emissions have decreased.', reason: 'Subject-verb agreement' },
];

const readabilityMetrics = { grade: 'B+', readingLevel: '10th Grade', avgSentenceLength: 18, passiveVoice: '8%', wordCount: 1247 };

const articleContent = `California's Bold Climate Agenda: A Deep Dive into Policy Reform

California has long positioned itself as a leader in environmental policy, and its latest climate initiatives represent the most ambitious push yet to address the global warming crisis.

The Cap-and-Trade Success Story

According to Dr. Sarah Chen, a climate scientist at UC Berkeley, "The cap-and-trade program has been remarkably successful in reducing emissions while maintaining economic growth. We've seen a 20% reduction in covered emissions since 2013."

This market-based approach has generated over $15 billion in revenue since its inception, funding everything from public transit to wildfire prevention.

Community Impact

But success at the policy level doesn't always translate to success on the ground. Local communities, particularly in disadvantaged areas, have expressed concerns about the uneven distribution of environmental benefits.

Looking Ahead

As California pushes toward its 2030 goals, the question remains: can policy innovation keep pace with the urgency of the climate crisis?`;

const tabs = [
    { id: 'edit', label: 'Edit', icon: Edit3 },
    { id: 'preview', label: 'Preview', icon: Eye },
];

export function EditorialReview() {
    const [activeTab, setActiveTab] = useState('edit');
    const [content, setContent] = useState(articleContent);
    const [appliedSuggestions, setAppliedSuggestions] = useState([]);

    const applySuggestion = (id, original, suggestion) => {
        setContent(content.replace(original, suggestion));
        setAppliedSuggestions([...appliedSuggestions, id]);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-display font-bold text-white mb-2">Editorial Review</h1>
                    <p className="text-slate-400">Final editing workspace with AI-assisted style suggestions</p>
                </div>
                <div className="flex gap-2">
                    <NeonButton variant="ghost" icon={Share2}>Share</NeonButton>
                    <NeonButton variant="default" icon={Download}>Export</NeonButton>
                    <NeonButton variant="primary" icon={Send}>Publish</NeonButton>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main editor */}
                <div className="lg:col-span-2 space-y-4">
                    <GlassCard className="p-4">
                        <TabPanel tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-4" />

                        <TabContent tabId="edit" activeTab={activeTab}>
                            <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full h-[500px] p-4 rounded-xl bg-white/5 border border-white/10 text-slate-300 leading-relaxed focus:border-neon-cyan/50 focus:outline-none resize-none" />
                        </TabContent>

                        <TabContent tabId="preview" activeTab={activeTab}>
                            <div className="p-6 rounded-xl bg-white border border-white/10">
                                <article className="prose max-w-none">
                                    {content.split('\n\n').map((para, i) => {
                                        if (i === 0) return <h1 key={i} className="text-2xl font-bold text-gray-900 mb-6">{para}</h1>;
                                        if (para.match(/^[A-Z].*[A-Za-z]$/) && para.length < 50) return <h2 key={i} className="text-xl font-semibold text-gray-800 mt-6 mb-3">{para}</h2>;
                                        return <p key={i} className="text-gray-700 mb-4 leading-relaxed">{para}</p>;
                                    })}
                                </article>
                            </div>
                        </TabContent>
                    </GlassCard>

                    {/* Style suggestions */}
                    <GlassCard className="p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2"><Lightbulb className="w-5 h-5 text-amber-400" /><h3 className="font-medium text-white">Style Suggestions</h3></div>
                            <Badge variant="cyan">{styleSuggestions.length - appliedSuggestions.length} remaining</Badge>
                        </div>
                        <div className="space-y-4">
                            {styleSuggestions.filter(s => !appliedSuggestions.includes(s.id)).map(suggestion => (
                                <motion.div key={suggestion.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <Badge variant={suggestion.type === 'grammar' ? 'danger' : suggestion.type === 'clarity' ? 'cyan' : 'warning'} size="sm" className="mb-2">{suggestion.type}</Badge>
                                    <div className="grid grid-cols-2 gap-4 mb-3">
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1">Original</p>
                                            <p className="text-sm text-slate-400 line-through">{suggestion.original}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1">Suggestion</p>
                                            <p className="text-sm text-neon-cyan">{suggestion.suggestion}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-slate-500">{suggestion.reason}</p>
                                        <div className="flex gap-2">
                                            <NeonButton size="sm" variant="ghost">Dismiss</NeonButton>
                                            <NeonButton size="sm" variant="primary" icon={CheckCircle} onClick={() => applySuggestion(suggestion.id, suggestion.original, suggestion.suggestion)}>Apply</NeonButton>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {appliedSuggestions.length === styleSuggestions.length && (
                                <div className="text-center py-8">
                                    <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                                    <p className="text-white font-medium">All suggestions reviewed!</p>
                                    <p className="text-sm text-slate-400">Your article is ready for publication</p>
                                </div>
                            )}
                        </div>
                    </GlassCard>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    {/* Readability score */}
                    <GlassCard className="p-5">
                        <div className="flex items-center gap-2 mb-4"><Type className="w-5 h-5 text-neon-cyan" /><h3 className="font-medium text-white">Readability</h3></div>
                        <div className="text-center mb-4">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-neon-cyan to-electric-magenta text-2xl font-bold text-white">{readabilityMetrics.grade}</div>
                        </div>
                        <div className="space-y-3">
                            {Object.entries(readabilityMetrics).filter(([k]) => k !== 'grade').map(([key, val]) => (
                                <div key={key} className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                    <span className="text-white">{val}</span>
                                </div>
                            ))}
                        </div>
                    </GlassCard>

                    {/* Export options */}
                    <GlassCard className="p-5">
                        <h3 className="font-medium text-white mb-4">Export Options</h3>
                        <div className="space-y-2">
                            {['Word Document (.docx)', 'PDF', 'Plain Text', 'HTML', 'Markdown'].map(format => (
                                <button key={format} className="w-full p-3 text-left text-sm text-slate-300 rounded-lg bg-white/5 hover:bg-white/10 flex items-center gap-2">
                                    <FileText className="w-4 h-4" />{format}
                                </button>
                            ))}
                        </div>
                    </GlassCard>

                    {/* Version history */}
                    <GlassCard className="p-5">
                        <div className="flex items-center gap-2 mb-4"><Clock className="w-5 h-5 text-slate-400" /><h3 className="font-medium text-white">Version History</h3></div>
                        <div className="space-y-2">
                            {['Current draft', '2 hours ago', 'Yesterday'].map((ver, i) => (
                                <button key={ver} className={`w-full p-3 text-left text-sm rounded-lg ${i === 0 ? 'bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}>{ver}</button>
                            ))}
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}

export default EditorialReview;
