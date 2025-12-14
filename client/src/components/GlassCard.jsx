import { motion } from 'framer-motion';

export function GlassCard({ children, className = '', hover = true, glow = false, ...props }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`
        relative overflow-hidden rounded-2xl
        bg-gradient-to-br from-white/[0.08] to-white/[0.02]
        backdrop-blur-xl
        border border-white/10
        shadow-glass
        ${hover ? 'transition-all duration-300 hover:border-neon-cyan/30 hover:shadow-glass-hover hover:-translate-y-0.5' : ''}
        ${glow ? 'shadow-neon-glow' : ''}
        ${className}
      `}
            {...props}
        >
            {/* Top glow line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {children}
        </motion.div>
    );
}

export function GlassPanel({ children, className = '', ...props }) {
    return (
        <div
            className={`
        rounded-xl
        bg-white/[0.03]
        backdrop-blur-lg
        border border-white/5
        ${className}
      `}
            {...props}
        >
            {children}
        </div>
    );
}

export default GlassCard;
