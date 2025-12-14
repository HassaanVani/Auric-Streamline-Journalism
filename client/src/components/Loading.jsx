import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export function LoadingSpinner({ size = 'md', className = '' }) {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
    };

    return (
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className={`${sizes[size]} ${className}`}
        >
            <div className="w-full h-full rounded-full border-2 border-neon-cyan/20 border-t-neon-cyan" />
        </motion.div>
    );
}

export function LoadingDots({ className = '' }) {
    return (
        <div className={`flex items-center gap-1 ${className}`}>
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    animate={{ y: [-2, 2, -2] }}
                    transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.1,
                    }}
                    className="w-2 h-2 rounded-full bg-neon-cyan"
                />
            ))}
        </div>
    );
}

export function LoadingPulse({ className = '' }) {
    return (
        <div className={`flex items-center justify-center gap-3 ${className}`}>
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="relative"
            >
                <Sparkles className="w-6 h-6 text-neon-cyan" />
                <div className="absolute inset-0 blur-md bg-neon-cyan/50 rounded-full" />
            </motion.div>
            <span className="text-slate-400 animate-pulse">AI is thinking...</span>
        </div>
    );
}

export function Skeleton({ className = '', variant = 'text' }) {
    const variants = {
        text: 'h-4 rounded',
        title: 'h-6 rounded w-3/4',
        avatar: 'w-10 h-10 rounded-full',
        card: 'h-32 rounded-xl',
        button: 'h-10 w-24 rounded-lg',
    };

    return (
        <div
            className={`
        ${variants[variant] || ''}
        bg-gradient-to-r from-white/5 via-white/10 to-white/5
        bg-[length:200%_100%]
        animate-[shimmer_1.5s_infinite]
        ${className}
      `}
        />
    );
}

export function PageLoader() {
    return (
        <div className="fixed inset-0 bg-midnight flex items-center justify-center z-50">
            <div className="text-center">
                <motion.div
                    animate={{
                        rotate: 360,
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
                        scale: { duration: 1, repeat: Infinity },
                    }}
                    className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-neon-cyan to-electric-magenta flex items-center justify-center"
                >
                    <Sparkles className="w-8 h-8 text-white" />
                </motion.div>
                <p className="text-slate-400">Loading Auric...</p>
            </div>
        </div>
    );
}

export default LoadingSpinner;
