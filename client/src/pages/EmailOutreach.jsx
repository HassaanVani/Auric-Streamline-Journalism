import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Mail,
    Sparkles,
    Send,
    Copy,
    RefreshCw,
    User,
    Building2,
    Sliders,
    Check,
    ChevronRight,
    Edit3,
    Eye
} from 'lucide-react';
import { GlassCard, GlassPanel } from '../components/GlassCard';
import { NeonButton } from '../components/NeonButton';
import { Badge } from '../components/Badge';
import { Avatar } from '../components/Avatar';
import { TabPanel, TabContent } from '../components/TabPanel';
import { LoadingPulse } from '../components/Loading';

const toneOptions = [
    { id: 'professional', label: 'Professional', description: 'Formal and business-appropriate' },
    { id: 'friendly', label: 'Friendly', description: 'Warm and approachable' },
    { id: 'empathetic', label: 'Empathetic', description: 'Understanding and considerate' },
    { id: 'direct', label: 'Direct', description: 'Clear and to the point' },
];

const sampleRecipient = {
    name: 'Dr. Sarah Chen',
    title: 'Climate Scientist',
    organization: 'UC Berkeley',
    email: 'sarah.chen@berkeley.edu',
};

const generatedEmail = `Dear Dr. Chen,

I hope this message finds you well. My name is John Doe, and I'm a journalist working on a feature story about California's evolving climate policy landscape.

Your groundbreaking research on cap-and-trade systems and their economic impacts has been invaluable to my understanding of the subject. I would be honored to include your expert perspective in my upcoming article.

Would you be available for a brief 20-30 minute interview in the coming week? I'm flexible with timing and can accommodate your schedule. The interview can be conducted via video call, phone, or in person—whichever works best for you.

Some topics I'd love to discuss include:
• Your recent findings on emission reduction strategies
• The effectiveness of current policy frameworks
• Future outlook for climate legislation in California

I believe your insights would greatly benefit our readers and contribute to a more informed public conversation about climate policy.

Thank you for considering this request. I look forward to the possibility of speaking with you.

Best regards,
John Doe
Senior Reporter
The Daily Chronicle
john.doe@dailychronicle.com
(415) 555-0123`;

const tabs = [
    { id: 'compose', label: 'Compose', icon: Edit3 },
    { id: 'preview', label: 'Preview', icon: Eye },
];

export function EmailOutreach() {
    const [recipient, setRecipient] = useState(sampleRecipient);
    const [selectedTone, setSelectedTone] = useState('professional');
    const [purpose, setPurpose] = useState('Request an interview about climate policy research');
    const [isGenerating, setIsGenerating] = useState(false);
    const [email, setEmail] = useState('');
    const [activeTab, setActiveTab] = useState('compose');
    const [copied, setCopied] = useState(false);

    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setEmail(generatedEmail);
            setIsGenerating(false);
            setActiveTab('preview');
        }, 2500);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-display font-bold text-white mb-2">Email Outreach</h1>
                <p className="text-slate-400">Generate personalized, empathetic outreach emails for your sources</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Recipient card */}
                    <GlassCard className="p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium text-white">Recipient</h3>
                            <NeonButton size="sm" variant="ghost">
                                Change
                            </NeonButton>
                        </div>
                        <div className="flex items-center gap-4">
                            <Avatar name={recipient.name} size="lg" />
                            <div>
                                <h4 className="font-medium text-white">{recipient.name}</h4>
                                <p className="text-sm text-slate-400">{recipient.title} at {recipient.organization}</p>
                                <p className="text-sm text-neon-cyan">{recipient.email}</p>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Purpose input */}
                    <GlassCard className="p-5">
                        <label className="block font-medium text-white mb-3">
                            What's the purpose of this email?
                        </label>
                        <textarea
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                            placeholder="E.g., Request an interview about their recent research on..."
                            className="w-full h-24 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:border-neon-cyan/50 focus:outline-none resize-none"
                        />
                    </GlassCard>

                    {/* Tone selection */}
                    <GlassCard className="p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <Sliders className="w-5 h-5 text-neon-cyan" />
                            <h3 className="font-medium text-white">Email Tone</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {toneOptions.map((tone) => (
                                <button
                                    key={tone.id}
                                    onClick={() => setSelectedTone(tone.id)}
                                    className={`p-4 rounded-xl text-left transition-all ${selectedTone === tone.id
                                            ? 'bg-neon-cyan/10 border border-neon-cyan/50'
                                            : 'bg-white/5 border border-white/10 hover:border-white/20'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={`font-medium ${selectedTone === tone.id ? 'text-neon-cyan' : 'text-white'}`}>
                                            {tone.label}
                                        </span>
                                        {selectedTone === tone.id && <Check className="w-4 h-4 text-neon-cyan" />}
                                    </div>
                                    <p className="text-sm text-slate-400">{tone.description}</p>
                                </button>
                            ))}
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
                        Generate Email with AI
                    </NeonButton>

                    {/* Generated email */}
                    {isGenerating && (
                        <GlassCard className="p-8">
                            <LoadingPulse />
                            <p className="text-center text-sm text-slate-400 mt-4">
                                Crafting a personalized email based on contact profile and context...
                            </p>
                        </GlassCard>
                    )}

                    {email && !isGenerating && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <GlassCard className="p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <TabPanel tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
                                    <div className="flex items-center gap-2">
                                        <NeonButton size="sm" variant="ghost" icon={RefreshCw} onClick={handleGenerate}>
                                            Regenerate
                                        </NeonButton>
                                        <NeonButton
                                            size="sm"
                                            variant="ghost"
                                            icon={copied ? Check : Copy}
                                            onClick={handleCopy}
                                        >
                                            {copied ? 'Copied!' : 'Copy'}
                                        </NeonButton>
                                    </div>
                                </div>

                                <TabContent tabId="compose" activeTab={activeTab}>
                                    <textarea
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full h-96 p-4 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-mono text-sm leading-relaxed focus:border-neon-cyan/50 focus:outline-none resize-none"
                                    />
                                </TabContent>

                                <TabContent tabId="preview" activeTab={activeTab}>
                                    <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                                        <div className="mb-6 pb-4 border-b border-white/10">
                                            <p className="text-sm text-slate-400 mb-1">To:</p>
                                            <p className="text-white">{recipient.email}</p>
                                            <p className="text-sm text-slate-400 mt-3 mb-1">Subject:</p>
                                            <p className="text-white">Interview Request: California Climate Policy Feature</p>
                                        </div>
                                        <div className="text-slate-300 whitespace-pre-line leading-relaxed">
                                            {email}
                                        </div>
                                    </div>
                                </TabContent>

                                <div className="flex gap-3 mt-4 pt-4 border-t border-white/5">
                                    <NeonButton variant="primary" icon={Send} className="flex-1">
                                        Send Email
                                    </NeonButton>
                                    <NeonButton variant="default">
                                        Save as Draft
                                    </NeonButton>
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    {/* Tips */}
                    <GlassCard className="p-5 border-neon-cyan/20" glow>
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-5 h-5 text-neon-cyan" />
                            <h3 className="font-medium text-white">AI Tips</h3>
                        </div>
                        <div className="space-y-3 text-sm text-slate-300">
                            <div className="flex items-start gap-2">
                                <ChevronRight className="w-4 h-4 text-neon-cyan mt-0.5 flex-shrink-0" />
                                <p>Personalize your request based on the contact's recent work</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <ChevronRight className="w-4 h-4 text-neon-cyan mt-0.5 flex-shrink-0" />
                                <p>Be specific about time commitment and interview format</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <ChevronRight className="w-4 h-4 text-neon-cyan mt-0.5 flex-shrink-0" />
                                <p>Mention how their expertise relates to your story</p>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Recent emails */}
                    <GlassCard className="p-5">
                        <h3 className="font-medium text-white mb-4">Recent Outreach</h3>
                        <div className="space-y-3">
                            {[
                                { name: 'Mayor Wilson', status: 'replied', time: '2 hours ago' },
                                { name: 'Lisa Martinez', status: 'sent', time: '1 day ago' },
                                { name: 'Prof. Thompson', status: 'draft', time: '2 days ago' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                                    <div className="flex items-center gap-3">
                                        <Avatar name={item.name} size="sm" />
                                        <span className="text-sm text-white">{item.name}</span>
                                    </div>
                                    <Badge
                                        variant={item.status === 'replied' ? 'success' : item.status === 'sent' ? 'cyan' : 'default'}
                                        size="sm"
                                    >
                                        {item.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </GlassCard>

                    {/* Templates */}
                    <GlassCard className="p-5">
                        <h3 className="font-medium text-white mb-4">Email Templates</h3>
                        <div className="space-y-2">
                            {['Interview Request', 'Follow-up', 'Thank You', 'Introduction'].map((template) => (
                                <button
                                    key={template}
                                    className="w-full p-3 text-left text-sm text-slate-300 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                    {template}
                                </button>
                            ))}
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}

export default EmailOutreach;
