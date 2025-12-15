import { motion } from 'framer-motion';

export function LoadingSpinner({ size = 'md', className = '' }) {
    const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };

    return (
        <svg className={`animate-spin text-[#D4AF37] ${sizes[size]} ${className}`} viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
    );
}

export function LoadingDots({ className = '' }) {
    return (
        <div className={`flex gap-1 ${className}`}>
            {[0, 1, 2].map((i) => (
                <motion.span
                    key={i}
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    className="w-2 h-2 bg-[#D4AF37] rounded-full"
                />
            ))}
        </div>
    );
}

export function LoadingPulse({ className = '' }) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <LoadingDots />
            <span className="text-sm text-[#D4AF37]">Processing...</span>
        </div>
    );
}

export function Skeleton({ className = '' }) {
    return (
        <div className={`
      bg-gradient-to-r from-[#1f1f1f] via-[#2a2a2a] to-[#1f1f1f]
      bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]
      rounded-lg
      ${className}
    `} />
    );
}

export function PageLoader() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="relative">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#8B6914] animate-pulse" />
                <div className="absolute inset-0 rounded-xl bg-[#D4AF37] blur-xl opacity-20 animate-pulse" />
            </div>
            <p className="mt-4 text-sm text-[#737373]">Loading...</p>
        </div>
    );
}

export default LoadingSpinner;
