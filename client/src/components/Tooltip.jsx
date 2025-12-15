import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Tooltip({
    children,
    content,
    position = 'top',
    delay = 300
}) {
    const [isVisible, setIsVisible] = useState(false);
    let timeout;

    const show = () => {
        timeout = setTimeout(() => setIsVisible(true), delay);
    };

    const hide = () => {
        clearTimeout(timeout);
        setIsVisible(false);
    };

    const positions = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    return (
        <div className="relative inline-flex" onMouseEnter={show} onMouseLeave={hide}>
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className={`
              absolute z-50 px-3 py-1.5 text-xs font-medium
              bg-[#1f1f1f] border border-[#2a2a2a] text-[#e5e5e5]
              rounded-lg whitespace-nowrap
              shadow-lg
              ${positions[position]}
            `}
                    >
                        {content}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Tooltip;
