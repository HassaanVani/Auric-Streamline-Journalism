import { forwardRef } from 'react';
import { motion } from 'framer-motion';

export const GlassCard = forwardRef(({ children, className = '', glow = false, hover = true, ...props }, ref) => {
    return (
        <motion.div
            ref={ref}
            whileHover={hover ? { y: -2 } : {}}
            transition={{ duration: 0.2 }}
            className={`
        bg-[#141414] border border-[#1f1f1f] rounded-xl
        ${hover ? 'hover:border-[#D4AF37]/20 transition-all duration-200' : ''}
        ${glow ? 'shadow-[0_0_20px_rgba(212,175,55,0.08)]' : ''}
        ${className}
      `}
            {...props}
        >
            {children}
        </motion.div>
    );
});

GlassCard.displayName = 'GlassCard';

export const GlassPanel = ({ children, className = '' }) => {
    return (
        <div className={`
      bg-gradient-to-br from-[#D4AF37]/5 to-transparent 
      border border-[#D4AF37]/10 rounded-xl
      ${className}
    `}>
            {children}
        </div>
    );
};

export default GlassCard;
