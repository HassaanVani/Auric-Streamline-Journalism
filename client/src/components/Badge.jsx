export function Badge({
    children,
    variant = 'default',
    size = 'md',
    glow = false,
    className = ''
}) {
    const variants = {
        default: 'bg-white/10 text-slate-300 border-white/20',
        cyan: 'bg-neon-cyan/15 text-neon-cyan border-neon-cyan/30',
        magenta: 'bg-electric-magenta/15 text-electric-magenta border-electric-magenta/30',
        success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        danger: 'bg-red-500/15 text-red-400 border-red-500/30',
        info: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    };

    const sizes = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-xs px-2.5 py-1',
        lg: 'text-sm px-3 py-1.5',
    };

    const glowStyles = {
        cyan: 'shadow-[0_0_10px_rgba(0,245,255,0.3)]',
        magenta: 'shadow-[0_0_10px_rgba(255,0,255,0.3)]',
        success: 'shadow-[0_0_10px_rgba(16,185,129,0.3)]',
        warning: 'shadow-[0_0_10px_rgba(245,158,11,0.3)]',
        danger: 'shadow-[0_0_10px_rgba(239,68,68,0.3)]',
        info: 'shadow-[0_0_10px_rgba(59,130,246,0.3)]',
        default: '',
    };

    return (
        <span
            className={`
        inline-flex items-center gap-1 
        rounded-full border font-medium
        ${variants[variant]}
        ${sizes[size]}
        ${glow ? glowStyles[variant] : ''}
        ${className}
      `}
        >
            {children}
        </span>
    );
}

export function StatusBadge({ status, showDot = true }) {
    const statuses = {
        active: { label: 'Active', variant: 'success', dot: 'bg-emerald-400' },
        pending: { label: 'Pending', variant: 'warning', dot: 'bg-amber-400' },
        completed: { label: 'Completed', variant: 'cyan', dot: 'bg-neon-cyan' },
        draft: { label: 'Draft', variant: 'default', dot: 'bg-slate-400' },
        error: { label: 'Error', variant: 'danger', dot: 'bg-red-400' },
        processing: { label: 'Processing', variant: 'info', dot: 'bg-blue-400 animate-pulse' },
    };

    const config = statuses[status] || statuses.draft;

    return (
        <Badge variant={config.variant}>
            {showDot && (
                <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            )}
            {config.label}
        </Badge>
    );
}

export function RelevanceScore({ score, showLabel = true }) {
    const getConfig = (score) => {
        if (score >= 80) return { label: 'High', variant: 'success' };
        if (score >= 60) return { label: 'Medium', variant: 'warning' };
        if (score >= 40) return { label: 'Low', variant: 'info' };
        return { label: 'Minimal', variant: 'default' };
    };

    const config = getConfig(score);

    return (
        <Badge variant={config.variant}>
            {showLabel && <span>{config.label}</span>}
            <span className="font-mono">{score}%</span>
        </Badge>
    );
}

export default Badge;
