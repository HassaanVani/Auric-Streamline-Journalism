import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FileText, Search, Play, Pause, Clock, Quote, Download, Share2,
    ChevronRight, Sparkles, MessageSquare, User, Flag, Copy, Check
} from 'lucide-react';
import { GlassCard, GlassPanel } from '../components/GlassCard';
import { NeonButton } from '../components/NeonButton';
import { Badge } from '../components/Badge';
import { Avatar } from '../components/Avatar';
import { TabPanel, TabContent } from '../components/TabPanel';

const transcripts = [
    { id: 1, title: 'Interview with Dr. Sarah Chen', date: '2024-03-10', duration: '28:45', source: 'Dr. Sarah Chen', status: 'complete', highlights: 5 },
    { id: 2, title: 'City Council Press Briefing', date: '2024-03-08', duration: '42:10', source: 'Mayor Wilson', status: 'processing', highlights: 0 },
];

const sampleTranscript = [
    { time: '00:00', speaker: 'John Doe', text: "Good morning, Dr. Chen. Thank you for taking the time to speak with me today about California's climate policy landscape." },
    { time: '00:15', speaker: 'Dr. Sarah Chen', text: "Thank you for having me. I'm happy to share my perspective on this important topic.", highlighted: false },
    { time: '00:25', speaker: 'John Doe', text: "Let's start with cap-and-trade. How would you assess its effectiveness so far?" },
    { time: '00:35', speaker: 'Dr. Sarah Chen', text: "The cap-and-trade program has been remarkably successful in reducing emissions while maintaining economic growth. We've seen a 20% reduction in covered emissions since 2013.", highlighted: true },
    { time: '01:15', speaker: 'John Doe', text: "That's significant. What do you see as the main challenges going forward?" },
    { time: '01:25', speaker: 'Dr. Sarah Chen', text: "The biggest challenge is extending these policies to sectors that are harder to decarbonize, like heavy industry and agriculture.", highlighted: true },
];

const tabs = [
    { id: 'all', label: 'All Transcripts', badge: 12 },
    { id: 'recent', label: 'Recent' },
    { id: 'highlighted', label: 'With Highlights', badge: 8 },
];

export function Transcripts() {
    const [activeTab, setActiveTab] = useState('all');
    const [selectedTranscript, setSelectedTranscript] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [copied, setCopied] = useState(null);

    const handleCopy = (id, text) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-display font-bold text-white mb-2">Transcripts</h1>
                <p className="text-slate-400">AI-powered transcription with smart quote highlighting</p>
            </div>

            {!selectedTranscript ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <GlassCard className="p-4">
                            <div className="flex gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search transcripts..." className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:border-neon-cyan/50 focus:outline-none" />
                                </div>
                                <NeonButton variant="primary" icon={Sparkles}>Upload Recording</NeonButton>
                            </div>
                        </GlassCard>

                        <TabPanel tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

                        <div className="space-y-4">
                            {transcripts.map((t, i) => (
                                <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                                    <GlassCard className="p-5 cursor-pointer" onClick={() => setSelectedTranscript(t)}>
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 rounded-xl bg-white/5"><FileText className="w-6 h-6 text-neon-cyan" /></div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-white mb-1">{t.title}</h3>
                                                <div className="flex items-center gap-4 text-sm text-slate-400">
                                                    <span className="flex items-center gap-1"><User className="w-4 h-4" />{t.source}</span>
                                                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{t.duration}</span>
                                                    <span>{t.date}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {t.highlights > 0 && <Badge variant="magenta">{t.highlights} highlights</Badge>}
                                                <Badge variant={t.status === 'complete' ? 'success' : 'warning'}>{t.status}</Badge>
                                                <ChevronRight className="w-5 h-5 text-slate-400" />
                                            </div>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <GlassCard className="p-5 border-neon-cyan/20" glow>
                            <div className="flex items-center gap-2 mb-4"><Quote className="w-5 h-5 text-neon-cyan" /><h3 className="font-medium text-white">Key Quotes</h3></div>
                            <div className="space-y-3">
                                {sampleTranscript.filter(s => s.highlighted).slice(0, 2).map((s, i) => (
                                    <div key={i} className="p-3 rounded-lg bg-white/5 border-l-2 border-neon-cyan">
                                        <p className="text-sm text-slate-300 italic">"{s.text.slice(0, 80)}..."</p>
                                        <p className="text-xs text-slate-500 mt-2">— {s.speaker}</p>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <NeonButton variant="ghost" onClick={() => setSelectedTranscript(null)}>← Back to Transcripts</NeonButton>

                    <GlassCard className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-display font-bold text-white mb-1">{selectedTranscript.title}</h2>
                                <p className="text-slate-400">{selectedTranscript.date} • {selectedTranscript.duration}</p>
                            </div>
                            <div className="flex gap-2">
                                <NeonButton size="sm" variant="ghost" icon={Download}>Export</NeonButton>
                                <NeonButton size="sm" variant="ghost" icon={Share2}>Share</NeonButton>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 mb-6">
                            <NeonButton variant="primary" icon={isPlaying ? Pause : Play} onClick={() => setIsPlaying(!isPlaying)}>{isPlaying ? 'Pause' : 'Play'}</NeonButton>
                            <div className="flex-1 h-2 bg-white/10 rounded-full"><div className="w-1/3 h-full bg-gradient-to-r from-neon-cyan to-electric-magenta rounded-full" /></div>
                            <span className="text-sm text-slate-400">09:15 / 28:45</span>
                        </div>

                        <div className="space-y-4">
                            {sampleTranscript.map((segment, i) => (
                                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className={`p-4 rounded-xl ${segment.highlighted ? 'bg-neon-cyan/10 border border-neon-cyan/30' : 'bg-white/5'}`}>
                                    <div className="flex items-start gap-3">
                                        <Avatar name={segment.speaker} size="sm" />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium text-white text-sm">{segment.speaker}</span>
                                                <span className="text-xs text-slate-500">{segment.time}</span>
                                                {segment.highlighted && <Badge variant="cyan" size="sm">Key Quote</Badge>}
                                            </div>
                                            <p className="text-slate-300">{segment.text}</p>
                                        </div>
                                        <div className="flex gap-1">
                                            <button onClick={() => handleCopy(i, segment.text)} className="p-2 text-slate-400 hover:text-white">{copied === i ? <Check className="w-4 h-4 text-neon-cyan" /> : <Copy className="w-4 h-4" />}</button>
                                            <button className="p-2 text-slate-400 hover:text-amber-400"><Flag className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </GlassCard>
                </div>
            )}
        </div>
    );
}

export default Transcripts;
