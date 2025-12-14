import { motion } from 'framer-motion';

export function Avatar({
    src,
    name,
    size = 'md',
    showStatus = false,
    status = 'online',
    glow = false,
    className = ''
}) {
    const sizes = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base',
        xl: 'w-16 h-16 text-lg',
    };

    const statusColors = {
        online: 'bg-emerald-500',
        offline: 'bg-slate-500',
        busy: 'bg-red-500',
        away: 'bg-amber-500',
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className={`relative inline-block ${className}`}>
            <motion.div
                whileHover={{ scale: 1.05 }}
                className={`
          ${sizes[size]}
          rounded-full overflow-hidden
          flex items-center justify-center
          font-medium
          ${glow ? 'shadow-neon-glow' : ''}
        `}
                style={{
                    border: '2px solid transparent',
                    background: src
                        ? 'transparent'
                        : 'linear-gradient(135deg, #0a0e27, #0a0e27) padding-box, linear-gradient(135deg, #00f5ff, #ff00ff) border-box',
                }}
            >
                {src ? (
                    <img
                        src={src}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-gradient">{getInitials(name)}</span>
                )}
            </motion.div>

            {/* Status indicator */}
            {showStatus && (
                <span
                    className={`
            absolute bottom-0 right-0 
            w-3 h-3 rounded-full 
            border-2 border-midnight
            ${statusColors[status]}
          `}
                />
            )}
        </div>
    );
}

export function AvatarGroup({ avatars, max = 4, size = 'md' }) {
    const displayAvatars = avatars.slice(0, max);
    const remaining = avatars.length - max;

    return (
        <div className="flex -space-x-2">
            {displayAvatars.map((avatar, index) => (
                <Avatar
                    key={index}
                    src={avatar.src}
                    name={avatar.name}
                    size={size}
                    className="ring-2 ring-midnight"
                />
            ))}
            {remaining > 0 && (
                <div
                    className={`
            ${size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm'}
            rounded-full bg-white/10 border border-white/20
            flex items-center justify-center
            text-slate-300 font-medium
            ring-2 ring-midnight
          `}
                >
                    +{remaining}
                </div>
            )}
        </div>
    );
}

export default Avatar;
