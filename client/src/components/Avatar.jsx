export function Avatar({
    name,
    src,
    size = 'md',
    status,
    className = ''
}) {
    const sizes = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base',
        xl: 'w-16 h-16 text-lg',
    };

    const initials = name
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className={`relative flex-shrink-0 ${className}`}>
            {src ? (
                <img
                    src={src}
                    alt={name}
                    className={`rounded-full object-cover border-2 border-[#2a2a2a] ${sizes[size]}`}
                />
            ) : (
                <div className={`
          ${sizes[size]} rounded-full 
          bg-gradient-to-br from-[#D4AF37]/20 to-[#8B6914]/10 
          border border-[#D4AF37]/30
          flex items-center justify-center 
          font-serif font-medium text-[#D4AF37]
        `}>
                    {initials}
                </div>
            )}

            {status && (
                <span className={`
          absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0a0a0a]
          ${status === 'online' ? 'bg-[#4ADE80]' : ''}
          ${status === 'busy' ? 'bg-[#F87171]' : ''}
          ${status === 'away' ? 'bg-[#FBBF24]' : ''}
          ${status === 'offline' ? 'bg-[#525252]' : ''}
        `} />
            )}
        </div>
    );
}

export function AvatarGroup({ avatars, max = 4, size = 'sm' }) {
    const displayed = avatars.slice(0, max);
    const remaining = avatars.length - max;

    return (
        <div className="flex -space-x-2">
            {displayed.map((avatar, i) => (
                <Avatar key={i} {...avatar} size={size} className="ring-2 ring-[#0a0a0a]" />
            ))}
            {remaining > 0 && (
                <div className="w-8 h-8 rounded-full bg-[#1f1f1f] border border-[#2a2a2a] flex items-center justify-center text-xs text-[#737373]">
                    +{remaining}
                </div>
            )}
        </div>
    );
}

export default Avatar;
