import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from '../components/Sidebar';
import { SearchBar } from '../components/SearchBar';
import { Avatar } from '../components/Avatar';
import { Bell, Settings } from 'lucide-react';

export function MainLayout() {
    const handleSearch = (query) => {
        console.log('Search:', query);
        // TODO: Implement global search
    };

    return (
        <div className="flex h-screen overflow-hidden bg-midnight">
            {/* Sidebar */}
            <Sidebar />

            {/* Main content area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-midnight/50 backdrop-blur-xl">
                    {/* Search */}
                    <SearchBar onSearch={handleSearch} />

                    {/* Header actions */}
                    <div className="flex items-center gap-4">
                        {/* Notifications */}
                        <button className="relative p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-electric-magenta rounded-full" />
                        </button>

                        {/* Settings */}
                        <button className="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                            <Settings className="w-5 h-5" />
                        </button>

                        {/* User avatar */}
                        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                            <Avatar name="John Doe" showStatus status="online" />
                            <div className="hidden lg:block">
                                <p className="text-sm font-medium text-white">John Doe</p>
                                <p className="text-xs text-slate-400">Reporter</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="p-6"
                    >
                        <Outlet />
                    </motion.div>
                </main>
            </div>

            {/* Background effects */}
            <div className="fixed inset-0 pointer-events-none">
                {/* Top-right glow */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl" />
                {/* Bottom-left glow */}
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-electric-magenta/5 rounded-full blur-3xl" />
            </div>
        </div>
    );
}

export default MainLayout;
