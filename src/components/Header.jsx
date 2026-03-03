import React, { useState, useEffect } from 'react';
import { Bell, Search, User, Download, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Header = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    if (!currentUser) return;
    try {
      const resp = await fetch(`${API_URL}/api/notifications?userId=${currentUser.id}`);
      const data = await resp.json();
      setNotifications(Array.isArray(data) ? data : []);
      setUnreadCount(Array.isArray(data) ? data.filter(n => !n.read_status).length : 0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [currentUser]);

  const markAsRead = async (id) => {
    try {
      await fetch(`${API_URL}/api/notifications/read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-slate-900/20 backdrop-blur-md sticky top-0 z-40">
      {/* Search Bar */}
      <div className="relative w-96 group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
        <input
          type="text"
          placeholder="Search transactions..."
          className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600 text-sm"
        />
      </div>

      {/* Profile & Notifications */}
      <div className="flex items-center gap-6">
        {/* Notification Icon */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 hover:bg-white/10 rounded-full transition-all relative group"
          >
            <Bell size={22} className="text-slate-400 group-hover:text-white" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center rounded-full border-2 border-slate-900">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-4 w-80 bg-slate-800 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
              >
                <div className="p-4 border-b border-white/5 bg-white/5">
                  <h3 className="font-bold">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {(!notifications || !Array.isArray(notifications) || notifications.length === 0) ? (
                    <div className="p-8 text-center text-slate-500 text-sm">
                      No new notifications
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${!n.read_status ? 'bg-blue-600/5' : ''}`}
                      >
                        <div className="flex gap-3">
                          <div className={`p-2 rounded-lg h-fit ${n.type === 'Report' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
                            {n.type === 'Report' ? <CheckCircle2 size={16} /> : <Bell size={16} />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-slate-200 leading-tight mb-2">{n.message}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              {n.action_url && (
                                <a
                                  href={n.action_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => markAsRead(n.id)}
                                  className="text-emerald-400 text-xs font-bold hover:underline flex items-center gap-1"
                                >
                                  <Download size={12} /> Download
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-6 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-white leading-none mb-1">
              {currentUser?.email.split('@')[0]}
            </p>
            <p className="text-xs text-slate-500 font-medium">Standard Plan</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white border border-white/20 shadow-lg">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;