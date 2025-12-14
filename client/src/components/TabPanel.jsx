import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function TabPanel({ tabs, activeTab, onChange, className = '' }) {
    return (
        <div className={`relative ${className}`}>
            {/* Tab buttons */}
            <div className="flex gap-1 p-1 bg-white/5 rounded-xl backdrop-blur-sm">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onChange(tab.id)}
                        className={`
              relative flex items-center gap-2 px-4 py-2 rounded-lg
              font-medium text-sm transition-all duration-300
              ${activeTab === tab.id
                                ? 'text-neon-cyan'
                                : 'text-slate-400 hover:text-white'
                            }
            `}
                    >
                        {/* Active background */}
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 to-electric-magenta/5 rounded-lg border border-neon-cyan/30"
                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                            />
                        )}

                        {/* Icon */}
                        {tab.icon && (
                            <span className="relative z-10">
                                <tab.icon className="w-4 h-4" />
                            </span>
                        )}

                        {/* Label */}
                        <span className="relative z-10">{tab.label}</span>

                        {/* Badge */}
                        {tab.badge !== undefined && (
                            <span className={`
                relative z-10 px-1.5 py-0.5 text-xs rounded-full
                ${activeTab === tab.id
                                    ? 'bg-neon-cyan/20 text-neon-cyan'
                                    : 'bg-white/10 text-slate-400'
                                }
              `}>
                                {tab.badge}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Glow effect under active tab */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent blur-sm" />
        </div>
    );
}

export function TabContent({ children, tabId, activeTab }) {
    return (
        <AnimatePresence mode="wait">
            {tabId === activeTab && (
                <motion.div
                    key={tabId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default TabPanel;
