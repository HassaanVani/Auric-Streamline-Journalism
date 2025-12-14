import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquareQuote,
    Sparkles,
    Plus,
    Copy,
    RefreshCw,
    ChevronDown,
    ChevronUp,
    GripVertical,
    Trash2,
    Edit3,
    Check,
    User,
    Save,
    FileText
} from 'lucide-react';
import { GlassCard, GlassPanel } from '../components/GlassCard';
import { NeonButton } from '../components/NeonButton';
import { Badge } from '../components/Badge';
import { Avatar } from '../components/Avatar';
import { LoadingPulse } from '../components/Loading';

const sampleContact = {
    name: 'Dr. Sarah Chen',
    title: 'Climate Scientist',
    expertise: ['Climate Policy', 'Environmental Science'],
};

const storyContext = {
    title: 'Climate Policy Reform in California',
    focus: 'Examining the effectiveness of recent climate legislation and its impact on local communities',
    gaps: ['Expert perspective on cap-and-trade', 'Community impact data', 'Future policy outlook'],
};

const generatedQuestions = [
    {
        id: 1,
        category: 'Background',
        question: "Can you walk me through your research on California's cap-and-trade system and its key findings?",
        followUp: "What aspects surprised you the most during your research?",
        priority: 'high',
    },
    {
        id: 2,
        category: 'Analysis',
        question: "How would you assess the effectiveness of AB 32 in achieving its stated emission reduction goals?",
        followUp: "What metrics do you believe are most important in evaluating climate policy success?",
        priority: 'high',
    },
    {
        id: 3,
        category: 'Impact',
        question: "What have been the most significant impacts of current climate policies on California communities?",
        followUp: "Are there any unintended consequences that policymakers should be aware of?",
        priority: 'medium',
    },
    {
        id: 4,
        category: 'Future',
        question: "Looking ahead, what policy changes would you recommend for California to meet its 2030 and 2045 climate goals?",
        followUp: "How do you see the role of technology evolving in climate solutions?",
        priority: 'medium',
    },
    {
        id: 5,
        category: 'Context',
        question: "How does California's approach compare to climate policies in other states or countries?",
        followUp: "What lessons can California learn from international climate initiatives?",
        priority: 'low',
    },
];

const priorityColors = {
    high: 'cyan',
    medium: 'warning',
    low: 'default',
};

export function Questions() {
    const [questions, setQuestions] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [expandedId, setExpandedId] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [copied, setCopied] = useState(null);

    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setQuestions(generatedQuestions);
            setIsGenerating(false);
        }, 2000);
    };

    const handleCopy = (id, text) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const handleDelete = (id) => {
        setQuestions(questions.filter(q => q.id !== id));
    };

    const copyAll = () => {
        const allQuestions = questions.map((q, i) =>
            `${i + 1}. ${q.question}\n   Follow-up: ${q.followUp}`
        ).join('\n\n');
        navigator.clipboard.writeText(allQuestions);
        setCopied('all');
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-display font-bold text-white mb-2">Question Generator</h1>
                <p className="text-slate-400">Generate targeted interview questions based on research and contact expertise</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Context cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Contact context */}
                        <GlassCard className="p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <User className="w-4 h-4 text-neon-cyan" />
                                <h3 className="font-medium text-white text-sm">Interview Subject</h3>
                            </div>
                            <div className="flex items-center gap-3">
                                <Avatar name={sampleContact.name} size="md" />
                                <div>
                                    <p className="font-medium text-white">{sampleContact.name}</p>
                                    <p className="text-sm text-slate-400">{sampleContact.title}</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-3">
                                {sampleContact.expertise.map((skill) => (
                                    <Badge key={skill} size="sm" variant="cyan">{skill}</Badge>
                                ))}
                            </div>
                        </GlassCard>

                        {/* Story context */}
                        <GlassCard className="p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <FileText className="w-4 h-4 text-electric-magenta" />
                                <h3 className="font-medium text-white text-sm">Story Context</h3>
                            </div>
                            <p className="font-medium text-white mb-1">{storyContext.title}</p>
                            <p className="text-sm text-slate-400">{storyContext.focus}</p>
                        </GlassCard>
                    </div>

                    {/* Research gaps */}
                    <GlassCard className="p-5">
                        <h3 className="font-medium text-white mb-3">Research Gaps to Address</h3>
                        <div className="flex flex-wrap gap-2">
                            {storyContext.gaps.map((gap) => (
                                <Badge key={gap} variant="magenta">{gap}</Badge>
                            ))}
                            <button className="px-3 py-1 rounded-full border border-dashed border-white/20 text-sm text-slate-400 hover:border-white/40 hover:text-white transition-colors">
                                <Plus className="w-3 h-3 inline mr-1" />
                                Add gap
                            </button>
                        </div>
                    </GlassCard>

                    {/* Generate button */}
                    <NeonButton
                        variant="primary"
                        size="lg"
                        icon={Sparkles}
                        className="w-full"
                        onClick={handleGenerate}
                        loading={isGenerating}
                    >
                        Generate Interview Questions
                    </NeonButton>

                    {/* Loading state */}
                    {isGenerating && (
                        <GlassCard className="p-8">
                            <LoadingPulse />
                            <p className="text-center text-sm text-slate-400 mt-4">
                                Analyzing research gaps and contact expertise to generate targeted questions...
                            </p>
                        </GlassCard>
                    )}

                    {/* Generated questions */}
                    <AnimatePresence>
                        {questions.length > 0 && !isGenerating && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                {/* Actions bar */}
                                <div className="flex items-center justify-between">
                                    <h3 className="font-medium text-white">
                                        {questions.length} Questions Generated
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <NeonButton size="sm" variant="ghost" icon={RefreshCw} onClick={handleGenerate}>
                                            Regenerate
                                        </NeonButton>
                                        <NeonButton
                                            size="sm"
                                            variant="ghost"
                                            icon={copied === 'all' ? Check : Copy}
                                            onClick={copyAll}
                                        >
                                            {copied === 'all' ? 'Copied!' : 'Copy All'}
                                        </NeonButton>
                                        <NeonButton size="sm" variant="default" icon={Save}>
                                            Save Set
                                        </NeonButton>
                                    </div>
                                </div>

                                {/* Questions list */}
                                {questions.map((q, index) => (
                                    <motion.div
                                        key={q.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <GlassCard className="p-5">
                                            <div className="flex items-start gap-4">
                                                {/* Drag handle */}
                                                <div className="pt-1 cursor-grab text-slate-500 hover:text-slate-300">
                                                    <GripVertical className="w-4 h-4" />
                                                </div>

                                                {/* Question content */}
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Badge variant={priorityColors[q.priority]} size="sm">
                                                            {q.priority}
                                                        </Badge>
                                                        <Badge variant="default" size="sm">{q.category}</Badge>
                                                    </div>

                                                    {editingId === q.id ? (
                                                        <textarea
                                                            defaultValue={q.question}
                                                            className="w-full p-2 rounded-lg bg-white/5 border border-neon-cyan/50 text-white text-sm focus:outline-none resize-none"
                                                            rows={2}
                                                        />
                                                    ) : (
                                                        <p className="text-white mb-3">{q.question}</p>
                                                    )}

                                                    {/* Follow-up section */}
                                                    <button
                                                        onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
                                                        className="flex items-center gap-2 text-sm text-slate-400 hover:text-neon-cyan transition-colors"
                                                    >
                                                        {expandedId === q.id ? (
                                                            <ChevronUp className="w-4 h-4" />
                                                        ) : (
                                                            <ChevronDown className="w-4 h-4" />
                                                        )}
                                                        Follow-up question
                                                    </button>

                                                    <AnimatePresence>
                                                        {expandedId === q.id && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="mt-3 p-3 rounded-lg bg-white/5 border border-white/10">
                                                                    <p className="text-sm text-slate-300">{q.followUp}</p>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => handleCopy(q.id, q.question)}
                                                        className="p-2 text-slate-400 hover:text-white transition-colors"
                                                    >
                                                        {copied === q.id ? <Check className="w-4 h-4 text-neon-cyan" /> : <Copy className="w-4 h-4" />}
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingId(editingId === q.id ? null : q.id)}
                                                        className="p-2 text-slate-400 hover:text-white transition-colors"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(q.id)}
                                                        className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </GlassCard>
                                    </motion.div>
                                ))}

                                {/* Add custom question */}
                                <button className="w-full p-4 rounded-2xl border border-dashed border-white/20 text-slate-400 hover:border-neon-cyan/50 hover:text-neon-cyan transition-colors flex items-center justify-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    Add custom question
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    {/* Tips */}
                    <GlassCard className="p-5 border-neon-cyan/20" glow>
                        <div className="flex items-center gap-2 mb-4">
                            <MessageSquareQuote className="w-5 h-5 text-neon-cyan" />
                            <h3 className="font-medium text-white">Interview Tips</h3>
                        </div>
                        <div className="space-y-3 text-sm text-slate-300">
                            <p>• Start with open-ended questions to build rapport</p>
                            <p>• Use follow-ups to dig deeper into interesting points</p>
                            <p>• Leave room for unexpected insights</p>
                            <p>• End with "Is there anything else you'd like to add?"</p>
                        </div>
                    </GlassCard>

                    {/* Saved question sets */}
                    <GlassCard className="p-5">
                        <h3 className="font-medium text-white mb-4">Saved Question Sets</h3>
                        <div className="space-y-2">
                            {['Climate Policy Experts', 'Government Officials', 'Community Leaders'].map((set) => (
                                <button
                                    key={set}
                                    className="w-full p-3 text-left text-sm text-slate-300 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                    {set}
                                </button>
                            ))}
                        </div>
                    </GlassCard>

                    {/* Question categories */}
                    <GlassCard className="p-5">
                        <h3 className="font-medium text-white mb-4">Categories</h3>
                        <div className="flex flex-wrap gap-2">
                            {['Background', 'Analysis', 'Impact', 'Future', 'Personal', 'Data'].map((cat) => (
                                <Badge key={cat} variant="default" size="md">{cat}</Badge>
                            ))}
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}

export default Questions;
