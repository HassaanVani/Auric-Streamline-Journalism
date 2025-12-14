import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Video, Calendar, Clock, Users, Plus, ExternalLink,
    Link2, Copy, Check, ChevronLeft, ChevronRight, Settings
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { NeonButton } from '../components/NeonButton';
import { Badge, StatusBadge } from '../components/Badge';
import { AvatarGroup } from '../components/Avatar';
import { TabPanel, TabContent } from '../components/TabPanel';

const upcomingMeetings = [
    { id: 1, title: 'Interview with Dr. Sarah Chen', type: 'zoom', date: '2024-03-15', time: '10:00 AM', duration: '30 min', status: 'confirmed', participants: [{ name: 'Dr. Sarah Chen' }, { name: 'John Doe' }], link: 'https://zoom.us/j/123456789' },
    { id: 2, title: 'City Council Press Briefing', type: 'meet', date: '2024-03-16', time: '2:00 PM', duration: '45 min', status: 'pending', participants: [{ name: 'Mayor Wilson' }, { name: 'John Doe' }], link: 'https://meet.google.com/abc' },
];

const tabs = [
    { id: 'upcoming', label: 'Upcoming', badge: 3 },
    { id: 'past', label: 'Past Meetings', badge: 8 },
];

export function Meetings() {
    const [activeTab, setActiveTab] = useState('upcoming');
    const [copied, setCopied] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

    const handleCopyLink = (id, link) => {
        navigator.clipboard.writeText(link);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-display font-bold text-white mb-2">Meetings</h1>
                    <p className="text-slate-400">Schedule and manage video call interviews</p>
                </div>
                <NeonButton variant="primary" icon={Plus}>Schedule Meeting</NeonButton>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <TabPanel tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
                    <TabContent tabId="upcoming" activeTab={activeTab}>
                        <div className="space-y-4">
                            {upcomingMeetings.map((meeting, i) => (
                                <motion.div key={meeting.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                                    <GlassCard className="p-5">
                                        <div className="flex items-start gap-4">
                                            <div className="text-center p-3 rounded-xl bg-white/5 min-w-[70px]">
                                                <p className="text-xs text-slate-400">{new Date(meeting.date).toLocaleDateString('en-US', { month: 'short' })}</p>
                                                <p className="text-2xl font-bold text-white">{new Date(meeting.date).getDate()}</p>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-white mb-2">{meeting.title}</h3>
                                                <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                                                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{meeting.time}</span>
                                                    <span>{meeting.duration}</span>
                                                    <StatusBadge status={meeting.status} />
                                                </div>
                                                <AvatarGroup avatars={meeting.participants} size="sm" />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <NeonButton size="sm" variant="primary" icon={Video}>Join</NeonButton>
                                                <NeonButton size="sm" variant="ghost" icon={copied === meeting.id ? Check : Link2} onClick={() => handleCopyLink(meeting.id, meeting.link)}>
                                                    {copied === meeting.id ? 'Copied!' : 'Copy Link'}
                                                </NeonButton>
                                            </div>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            ))}
                        </div>
                    </TabContent>
                </div>
                <div className="space-y-4">
                    <GlassCard className="p-5">
                        <h3 className="font-medium text-white mb-4">Quick Schedule</h3>
                        <div className="flex items-center justify-between mb-4">
                            <button className="p-1 text-slate-400 hover:text-white"><ChevronLeft className="w-4 h-4" /></button>
                            <span className="text-sm font-medium text-white">March 2024</span>
                            <button className="p-1 text-slate-400 hover:text-white"><ChevronRight className="w-4 h-4" /></button>
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="text-center text-xs text-slate-500 py-1">{d}</div>)}
                            {Array.from({ length: 31 }, (_, i) => (
                                <button key={i} onClick={() => setSelectedDate(i + 1)} className={`text-center text-sm py-1.5 rounded-lg ${selectedDate === i + 1 ? 'bg-neon-cyan text-midnight' : 'text-slate-300 hover:bg-white/10'}`}>{i + 1}</button>
                            ))}
                        </div>
                    </GlassCard>
                    <GlassCard className="p-5">
                        <h3 className="font-medium text-white mb-4">Connected Services</h3>
                        <div className="space-y-3">
                            {[{ name: 'Zoom', color: 'blue' }, { name: 'Google Meet', color: 'emerald' }].map(s => (
                                <div key={s.name} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded bg-${s.color}-500 flex items-center justify-center`}><Video className="w-4 h-4 text-white" /></div>
                                        <span className="text-sm text-white">{s.name}</span>
                                    </div>
                                    <Badge variant="success" size="sm">Connected</Badge>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}

export default Meetings;
