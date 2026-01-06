import React, { useState } from 'react';
import { usePortfolio } from '../store/usePortfolio';
import { Plus, ArrowDownLeft, ArrowUpRight, Trash2 } from 'lucide-react';

const Transactions = () => {
    const { transactions, addTransaction, deleteTransaction } = usePortfolio();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        symbol: '',
        type: 'BUY', // BUY or SELL
        qty: '',
        price: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.symbol && formData.qty && formData.price) {
            addTransaction({
                date: formData.date || new Date().toISOString(),
                symbol: formData.symbol.toUpperCase(),
                type: formData.type,
                quantity: Number(formData.qty),
                price: Number(formData.price),
            });
            setIsModalOpen(false);
            setFormData({ date: new Date().toISOString().split('T')[0], symbol: '', type: 'BUY', qty: '', price: '' });
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div>
                    <h2 className="font-serif text-xl font-bold text-sidebar-bg">History</h2>
                    <p className="text-sm text-text-light">Record of all your buy and sell orders</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-gold-main hover:bg-gold-dim text-white px-5 py-2.5 rounded-lg font-medium shadow-gold transition-all"
                >
                    <Plus size={18} />
                    <span>New Transaction</span>
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Symbol</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Qty</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-gray-400 text-sm">
                                        No transactions recorded yet.
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light">
                                            {new Date(tx.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-bold text-sidebar-bg">{tx.symbol}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tx.type === 'BUY'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {tx.type === 'BUY' ? <ArrowDownLeft size={12} className="mr-1" /> : <ArrowUpRight size={12} className="mr-1" />}
                                                {tx.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-dark text-right font-mono">
                                            {tx.quantity}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-dark text-right font-mono">
                                            ₹{tx.price.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-sidebar-bg text-right font-mono">
                                            ₹{(tx.quantity * tx.price).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <button
                                                onClick={() => deleteTransaction(tx.id)}
                                                className="text-gray-300 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 bg-transparent border-0 cursor-pointer flex items-center justify-center mx-auto"
                                                title="Delete Transaction"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Transaction Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sidebar-bg/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-serif text-lg font-bold text-sidebar-bg">New Transaction</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-dark mb-1">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-main outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-dark mb-1">Stock Symbol</label>
                                <input
                                    type="text"
                                    name="symbol"
                                    value={formData.symbol}
                                    onChange={handleInputChange}
                                    placeholder="e.g. GOLDBEES"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-main outline-none uppercase"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-dark mb-1">Type</label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-main outline-none"
                                    >
                                        <option value="BUY">BUY</option>
                                        <option value="SELL">SELL</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-dark mb-1">Quantity</label>
                                    <input
                                        type="number"
                                        name="qty"
                                        value={formData.qty}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-main outline-none"
                                        required
                                        min="1"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-dark mb-1">Price per Unit (₹)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-main outline-none"
                                    required
                                    step="0.01"
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-gold-main text-white rounded-lg hover:bg-gold-dim shadow-gold transition-colors font-medium"
                                >
                                    Save Record
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Transactions;
