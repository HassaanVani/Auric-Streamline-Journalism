import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Tooltip({
    children,
    content,
    position = 'top',
    delay = 300,
    className = ''
}) {
    const [visible, setVisible] = useState(false);
    const timeoutRef = useRef(null);

    const positions = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    const arrows = {
        top: 'top-full left-1/2 -translate-x-1/2 border-t-midnight-50',
        bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-midnight-50',
        left: 'left-full top-1/2 -translate-y-1/2 border-l-midnight-50',
        right: 'right-full top-1/2 -translate-y-1/2 border-r-midnight-50',
    };

    const handleMouseEnter = () => {
        timeoutRef.current = setTimeout(() => setVisible(true), delay);
    };

    const handleMouseLeave = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setVisible(false);
    };

    return (
        <div
            className={`relative inline-block ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}

            <AnimatePresence>
                {visible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                        className={`
              absolute z-50 px-3 py-2
              text-sm text-white whitespace-nowrap
              rounded-lg
              bg-midnight-50/95 backdrop-blur-lg
              border border-neon-cyan/30
              shadow-[0_0_20px_rgba(0,245,255,0.15)]
              ${positions[position]}
            `}
                    >
                        {content}

                        {/* Arrow */}
                        <div
                            className={`
                absolute w-0 h-0 
                border-4 border-transparent
                ${arrows[position]}
              `}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Tooltip;
