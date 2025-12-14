import { motion } from 'framer-motion';

export function NeonButton({
    children,
    variant = 'default',
    size = 'md',
    icon: Icon,
    loading = false,
    className = '',
    ...props
}) {
    const variants = {
        default: `
      bg-gradient-to-r from-neon-cyan/10 to-electric-magenta/10
      border border-neon-cyan/50
      text-neon-cyan
      hover:border-neon-cyan
      hover:shadow-neon-cyan
      hover:from-neon-cyan/20 hover:to-electric-magenta/20
    `,
        primary: `
      bg-gradient-to-r from-neon-cyan to-neon-cyan-600
      text-midnight
      font-semibold
      hover:from-neon-cyan-400 hover:to-neon-cyan
      hover:shadow-neon-cyan
    `,
        magenta: `
      bg-gradient-to-r from-electric-magenta/10 to-neon-cyan/10
      border border-electric-magenta/50
      text-electric-magenta
      hover:border-electric-magenta
      hover:shadow-neon-magenta
    `,
        ghost: `
      bg-transparent
      text-slate-400
      hover:text-white
      hover:bg-white/5
    `,
        danger: `
      bg-red-500/10
      border border-red-500/50
      text-red-400
      hover:border-red-500
      hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]
    `,
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
        md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
        lg: 'px-6 py-3 text-base rounded-xl gap-2.5',
        xl: 'px-8 py-4 text-lg rounded-2xl gap-3',
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
        relative inline-flex items-center justify-center
        font-medium
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
            disabled={loading}
            {...props}
        >
            {loading ? (
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                />
            ) : (
                <>
                    {Icon && <Icon className="w-4 h-4" />}
                    {children}
                </>
            )}
        </motion.button>
    );
}

export default NeonButton;
