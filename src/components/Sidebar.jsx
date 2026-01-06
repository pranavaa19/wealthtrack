import React from 'react';
import { LayoutDashboard, History, Calculator, PieChart, TrendingUp, LogOut } from 'lucide-react';

const Sidebar = ({ activeView, setActiveView, onLogout }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'transactions', label: 'Transactions', icon: History },
        { id: 'calculator', label: 'Profit Calc', icon: Calculator },
    ];

    return (
        <aside className="w-64 bg-sidebar-bg text-white flex flex-col h-full shadow-xl z-20 transition-all duration-300">
            <div className="p-8 pb-4">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-gold-main rounded-xl flex items-center justify-center shadow-gold">
                        <TrendingUp size={24} className="text-white" />
                    </div>
                    <h1 className="font-serif text-2xl font-bold tracking-tight">GoldFolio</h1>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeView === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-gold-main text-white shadow-gold font-medium transform translate-x-1'
                                : 'text-gray-400 hover:bg-sidebar-hover hover:text-white hover:pl-5'
                                }`}
                        >
                            <Icon size={20} className={`${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                            <span className="text-sm tracking-wide">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-700/50">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all duration-200"
                >
                    <LogOut size={20} />
                    <span className="text-sm font-medium">Log Out</span>
                </button>
            </div>

            <div className="p-6 pt-2">
                <div className="text-xs text-gray-500 font-medium text-center">
                    v1.1.0 © 2026
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
