const variants = {
    default: 'bg-[#1f1f1f] text-[#a3a3a3]',
    gold: 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20',
    success: 'bg-[#4ADE80]/10 text-[#4ADE80]',
    warning: 'bg-[#FBBF24]/10 text-[#FBBF24]',
    danger: 'bg-[#F87171]/10 text-[#F87171]',
    info: 'bg-[#60A5FA]/10 text-[#60A5FA]',
};

const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
};

export function Badge({
    children,
    variant = 'default',
    size = 'md',
    className = ''
}) {
    return (
        <span className={`
      inline-flex items-center gap-1 font-medium rounded-md
      ${variants[variant]}
      ${sizes[size]}
      ${className}
    `}>
            {children}
        </span>
    );
}

export function StatusBadge({ status }) {
    const statusConfig = {
        confirmed: { label: 'Confirmed', variant: 'success' },
        pending: { label: 'Pending', variant: 'warning' },
        scheduled: { label: 'Scheduled', variant: 'info' },
        draft: { label: 'Draft', variant: 'gold' },
        complete: { label: 'Complete', variant: 'success' },
        'in_progress': { label: 'In Progress', variant: 'gold' },
    };

    const config = statusConfig[status] || { label: status, variant: 'default' };

    return <Badge variant={config.variant}>{config.label}</Badge>;
}

export function RelevanceScore({ score }) {
    return (
        <span className="text-xs px-2 py-0.5 bg-[#D4AF37]/10 text-[#D4AF37] rounded">
            {score}%
        </span>
    );
}

export default Badge;
