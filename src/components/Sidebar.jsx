import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    History,
    BarChart3,
    FileText,
    LogOut,
    Settings,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={22} />, path: '/' },
        { name: 'History', icon: <History size={22} />, path: '/history' },
        { name: 'Analytics', icon: <BarChart3 size={22} />, path: '/analytics' },
        { name: 'Reports', icon: <FileText size={22} />, path: '/reports' },
    ];

    return (
        <div
            className={`h-screen sticky top-0 bg-slate-900/40 backdrop-blur-xl border-r border-white/10 flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}
        >
            {/* Brand */}
            <div className="p-6 flex items-center justify-between">
                {!isCollapsed && (
                    <span className="text-xl font-black bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                        DailyLife
                    </span>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 transition-colors"
                >
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 mt-4 px-3 space-y-2">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
              flex items-center gap-4 px-4 py-3 rounded-xl transition-all group
              ${isActive
                                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold'
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            }
            `}
                    >
                        <span className="transition-transform group-hover:scale-110">{item.icon}</span>
                        {!isCollapsed && <span className="text-sm">{item.name}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-white/5 space-y-2">
                <button className="w-full flex items-center gap-4 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-all">
                    <Settings size={22} />
                    {!isCollapsed && <span className="text-sm">Settings</span>}
                </button>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-4 px-4 py-3 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                >
                    <LogOut size={22} />
                    {!isCollapsed && <span className="text-sm font-semibold">Logout</span>}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
