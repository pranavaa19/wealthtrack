import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { usePortfolio } from '../store/usePortfolio';

export default function AddTransaction({ isOpen, onClose }) {
    const { addTransaction } = usePortfolio();
    const [type, setType] = useState('BUY');
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        symbol: '',
        quantity: '',
        price: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.symbol || !formData.quantity || !formData.price) return;

        addTransaction({
            ...formData,
            quantity: Number(formData.quantity),
            price: Number(formData.price),
            type,
        });

        // Reset and Close
        setFormData({
            date: new Date().toISOString().split('T')[0],
            symbol: '',
            quantity: '',
            price: '',
        });
        onClose();
    };

    const total = (Number(formData.quantity) || 0) * (Number(formData.price) || 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 m-auto w-full max-w-md h-fit z-50 p-4"
                    >
                        <div className="glass-card bg-[#0A0A0A] border border-white/10 p-6 relative overflow-hidden">
                            {/* Background Glow */}
                            <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] rounded-full pointer-events-none ${type === 'BUY' ? 'bg-neon-gold/20' : 'bg-cyber-teal/20'}`} />

                            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                                <X size={24} />
                            </button>

                            <h2 className="text-2xl font-bold mb-6 font-sans">New Transaction</h2>

                            {/* Type Toggle */}
                            <div className="flex bg-white/5 rounded-lg p-1 mb-6">
                                {['BUY', 'SELL'].map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setType(t)}
                                        className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${type === t
                                            ? (t === 'BUY' ? 'bg-neon-gold text-black shadow-neon-gold' : 'bg-cyber-teal text-black shadow-neon-teal')
                                            : 'text-gray-400 hover:text-white'
                                            }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Quick Select */}
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {['GOLDBEES', 'NIFTYBEES', 'SILVERBEES'].map(s => (
                                        <button
                                            type="button"
                                            key={s}
                                            onClick={() => setFormData({ ...formData, symbol: s })}
                                            className={`px-3 py-1 rounded-full text-xs font-mono border transition-all ${formData.symbol === s
                                                ? 'border-neon-gold text-neon-gold bg-neon-gold/10'
                                                : 'border-white/10 text-gray-400 hover:border-white/30'
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>

                                <div>
                                    <label className="text-xs text-gray-400 uppercase tracking-widest pl-1">Date</label>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-gold outline-none font-sans"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs text-gray-400 uppercase tracking-widest pl-1">Symbol</label>
                                    <input
                                        type="text"
                                        value={formData.symbol}
                                        onChange={e => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-gold outline-none font-mono"
                                        placeholder="e.g. RELIANCE"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-400 uppercase tracking-widest pl-1">Quantity</label>
                                        <input
                                            type="number"
                                            value={formData.quantity}
                                            onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-gold outline-none font-mono"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 uppercase tracking-widest pl-1">Price</label>
                                        <input
                                            type="number"
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-gold outline-none font-mono"
                                            placeholder="₹0.00"
                                        />
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <div className="flex justify-between items-end mb-2 px-1">
                                        <span className="text-gray-400 text-sm">Total Amount</span>
                                        <span className={`text-xl font-mono ${type === 'BUY' ? 'text-neon-gold' : 'text-cyber-teal'}`}>
                                            ₹{total.toLocaleString()}
                                        </span>
                                    </div>
                                    <button type="submit" className="w-full btn-primary py-3 text-lg">
                                        {type === 'BUY' ? 'Confirm Purchase' : 'Confirm Sale'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
