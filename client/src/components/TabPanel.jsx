import { motion, AnimatePresence } from 'framer-motion';

export function TabPanel({ tabs, activeTab, onChange, className = '' }) {
    return (
        <div className={`flex items-center gap-1 p-1 bg-[#141414] border border-[#1f1f1f] rounded-xl ${className}`}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={`
            relative flex items-center gap-2 py-2 px-4 text-sm font-medium rounded-lg transition-all
            ${activeTab === tab.id
                            ? 'text-[#D4AF37]'
                            : 'text-[#737373] hover:text-[#a3a3a3]'
                        }
          `}
                >
                    {activeTab === tab.id && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-[#D4AF37]/10 rounded-lg"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                        />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                        {tab.icon && <tab.icon className="w-4 h-4" />}
                        {tab.label}
                        {tab.badge && (
                            <span className="px-1.5 py-0.5 text-xs bg-[#D4AF37]/10 text-[#D4AF37] rounded">
                                {tab.badge}
                            </span>
                        )}
                    </span>
                </button>
            ))}
        </div>
    );
}

export function TabContent({ children, tabId, activeTab }) {
    if (tabId !== activeTab) return null;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={tabId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}

export default TabPanel;
