import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Command, ArrowRight } from 'lucide-react';

const suggestions = [
    { type: 'research', text: 'Research climate change policy in California' },
    { type: 'contact', text: 'Find local environmental experts' },
    { type: 'question', text: 'Generate questions for city council interview' },
    { type: 'draft', text: 'Draft article about housing crisis' },
];

export function SearchBar({ onSearch, placeholder = "Search or ask AI anything..." }) {
    const [query, setQuery] = useState('');
    const [focused, setFocused] = useState(false);
    const [activeSuggestion, setActiveSuggestion] = useState(-1);
    const inputRef = useRef(null);

    // Handle keyboard shortcut
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch?.(query);
            setQuery('');
            setFocused(false);
        }
    };

    const handleKeyNavigation = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveSuggestion(prev =>
                prev < suggestions.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveSuggestion(prev => prev > 0 ? prev - 1 : -1);
        } else if (e.key === 'Enter' && activeSuggestion >= 0) {
            e.preventDefault();
            setQuery(suggestions[activeSuggestion].text);
            setActiveSuggestion(-1);
        } else if (e.key === 'Escape') {
            setFocused(false);
            inputRef.current?.blur();
        }
    };

    return (
        <div className="relative w-full max-w-2xl">
            <form onSubmit={handleSubmit}>
                <div
                    className={`
            relative flex items-center gap-3 px-4 py-3 rounded-2xl
            bg-white/5 backdrop-blur-xl
            border transition-all duration-300
            ${focused
                            ? 'border-neon-cyan/50 shadow-[0_0_30px_rgba(0,245,255,0.15)]'
                            : 'border-white/10 hover:border-white/20'
                        }
          `}
                >
                    {/* Search icon */}
                    <Search className={`w-5 h-5 transition-colors duration-300 ${focused ? 'text-neon-cyan' : 'text-slate-400'}`} />

                    {/* Input */}
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setTimeout(() => setFocused(false), 200)}
                        onKeyDown={handleKeyNavigation}
                        placeholder={placeholder}
                        className="flex-1 bg-transparent outline-none text-white placeholder:text-slate-500"
                    />

                    {/* AI indicator */}
                    <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors ${focused ? 'bg-neon-cyan/10' : 'bg-white/5'}`}>
                            <Sparkles className={`w-3.5 h-3.5 ${focused ? 'text-neon-cyan' : 'text-slate-400'}`} />
                            <span className="text-xs text-slate-400">AI</span>
                        </div>

                        {/* Keyboard shortcut */}
                        <div className="hidden md:flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5">
                            <Command className="w-3 h-3 text-slate-500" />
                            <span className="text-xs text-slate-500">K</span>
                        </div>
                    </div>
                </div>
            </form>

            {/* Suggestions dropdown */}
            <AnimatePresence>
                {focused && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-2 p-2 rounded-xl bg-midnight-50/95 backdrop-blur-xl border border-white/10 shadow-2xl z-50"
                    >
                        <div className="text-xs text-slate-500 px-3 py-2 font-medium uppercase tracking-wide">
                            AI Suggestions
                        </div>
                        {suggestions.map((suggestion, index) => (
                            <button
                                key={index}
                                onMouseEnter={() => setActiveSuggestion(index)}
                                onClick={() => {
                                    setQuery(suggestion.text);
                                    onSearch?.(suggestion.text);
                                }}
                                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                  text-left transition-all duration-200
                  ${activeSuggestion === index
                                        ? 'bg-neon-cyan/10 text-white'
                                        : 'text-slate-300 hover:bg-white/5'
                                    }
                `}
                            >
                                <Sparkles className={`w-4 h-4 ${activeSuggestion === index ? 'text-neon-cyan' : 'text-slate-500'}`} />
                                <span className="flex-1 truncate">{suggestion.text}</span>
                                <ArrowRight className={`w-4 h-4 transition-transform ${activeSuggestion === index ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`} />
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default SearchBar;
