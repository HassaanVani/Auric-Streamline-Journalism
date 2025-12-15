import { useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, X } from 'lucide-react';

export const SearchBar = forwardRef(({
    value,
    onChange,
    placeholder = 'Search...',
    onSearch,
    className = ''
}, ref) => {
    const [focused, setFocused] = useState(false);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && onSearch) {
            onSearch(value);
        }
    };

    return (
        <div className={`relative ${className}`}>
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focused ? 'text-[#D4AF37]' : 'text-[#525252]'}`} />
            <input
                ref={ref}
                type="text"
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className={`
          w-full py-3 pl-11 pr-16 text-sm text-[#e5e5e5] placeholder-[#525252]
          bg-[#141414] border rounded-xl transition-all duration-200
          ${focused
                        ? 'border-[#D4AF37]/50 shadow-[0_0_0_3px_rgba(212,175,55,0.1)]'
                        : 'border-[#2a2a2a] hover:border-[#333333]'
                    }
          focus:outline-none
        `}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 rounded-md bg-[#1f1f1f] border border-[#2a2a2a]">
                <Command className="w-3 h-3 text-[#525252]" />
                <span className="text-xs text-[#525252] font-medium">K</span>
            </div>
        </div>
    );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;
