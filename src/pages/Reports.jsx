import React, { useState, useEffect } from 'react';
import {
    FileText,
    Download,
    Clock,
    CheckCircle2,
    AlertCircle,
    FileSpreadsheet,
    File as FileIcon,
    Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Reports = () => {
    const { currentUser } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchRequests = async () => {
        try {
            const resp = await fetch(`${API_URL}/api/reports?userId=${currentUser.id}`);
            const data = await resp.json();
            setRequests(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchRequests();
        const interval = setInterval(fetchRequests, 10000); // Poll for status changes
        return () => clearInterval(interval);
    }, [currentUser]);

    const requestReport = async (type) => {
        setLoading(true);
        try {
            const resp = await fetch(`${API_URL}/api/reports/request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUser.id, type })
            });
            if (resp.ok) {
                fetchRequests();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-12 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div>
                    <h1 className="text-4xl font-black mb-2 tracking-tight">Financial Reports</h1>
                    <p className="text-slate-500 font-medium">Request, manage, and audit your fiscal statement exports.</p>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => requestReport('PDF')}
                        disabled={loading}
                        className="flex items-center gap-2 bg-rose-600/20 text-rose-400 border border-rose-500/30 px-6 py-3 rounded-2xl font-bold hover:bg-rose-600/40 transition-all text-sm"
                    >
                        <FileIcon size={18} /> REQUEST PDF
                    </button>
                    <button
                        onClick={() => requestReport('EXCEL')}
                        disabled={loading}
                        className="flex items-center gap-2 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 px-6 py-3 rounded-2xl font-bold hover:bg-emerald-600/40 transition-all text-sm"
                    >
                        <FileSpreadsheet size={18} /> REQUEST EXCEL
                    </button>
                </div>
            </div>

            {/* Requests Hub */}
            <section className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[40px] p-10">
                <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl">
                        <Clock size={24} />
                    </div>
                    <h2 className="text-2xl font-black">Export History</h2>
                </div>

                <div className="space-y-6">
                    {requests.length === 0 ? (
                        <div className="text-center py-20 text-slate-500 flex flex-col items-center gap-4">
                            <FileText size={48} className="text-slate-700" />
                            <p className="font-bold italic text-lg">No reports requested yet.</p>
                            <p className="text-sm max-w-xs">Statements are generated upon request and verified by the system administrator.</p>
                        </div>
                    ) : (
                        requests.map((req) => (
                            <div key={req.id} className="group bg-slate-800/40 border border-white/5 rounded-3xl p-6 flex items-center justify-between transition-all hover:bg-slate-800/60">
                                <div className="flex items-center gap-6">
                                    <div className={`p-4 rounded-2xl ${req.type === 'PDF' ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                        {req.type === 'PDF' ? <FileIcon size={24} /> : <FileSpreadsheet size={24} />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <p className="text-lg font-black">{req.type} Statement</p>
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${req.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                req.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                    'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                                }`}>
                                                {req.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1 flex items-center gap-2">
                                            <Clock size={12} /> {new Date(req.requested_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    {req.status === 'Approved' && (
                                        <a
                                            href={req.file_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-black px-6 py-3 rounded-xl transition-all shadow-xl shadow-blue-500/20"
                                        >
                                            <Download size={18} /> DOWNLOAD NOW
                                        </a>
                                    )}
                                    {req.status === 'Pending' && (
                                        <p className="text-sm text-slate-500 italic font-medium px-4">Processing...</p>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Educational Footer */}
            <div className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-[30px] p-8 border border-blue-500/20 flex items-center gap-6">
                <div className="bg-blue-500 text-white p-3 rounded-2xl">
                    <AlertCircle size={24} />
                </div>
                <div>
                    <h4 className="font-black text-blue-400 text-sm">PRO TIP</h4>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                        Reports usually take 1-2 business minutes for verification. Keep an eye on your <strong>notifications</strong> in the top header for real-time approval status and instant download access.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Reports;
