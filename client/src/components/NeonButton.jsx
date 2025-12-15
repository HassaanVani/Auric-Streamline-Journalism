import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const variants = {
    primary: 'bg-gradient-to-r from-[#D4AF37] to-[#C9A227] text-[#0a0a0a] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]',
    secondary: 'bg-transparent border border-[#2a2a2a] text-[#e5e5e5] hover:border-[#D4AF37]/50 hover:text-[#D4AF37]',
    ghost: 'bg-transparent text-[#a3a3a3] hover:bg-white/5 hover:text-[#e5e5e5]',
    danger: 'bg-transparent border border-[#F87171]/30 text-[#F87171] hover:bg-[#F87171]/10',
};

const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-sm',
    xl: 'px-6 py-3 text-base',
};

export const NeonButton = forwardRef(({
    children,
    variant = 'secondary',
    size = 'md',
    icon: Icon,
    iconPosition = 'left',
    loading = false,
    disabled = false,
    className = '',
    ...props
}, ref) => {
    return (
        <motion.button
            ref={ref}
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
            disabled={disabled || loading}
            className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-lg
        transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
            {...props}
        >
            {loading ? (
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            ) : Icon && iconPosition === 'left' ? (
                <Icon className="w-4 h-4" />
            ) : null}
            {children}
            {!loading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
        </motion.button>
    );
});

NeonButton.displayName = 'NeonButton';

export default NeonButton;
