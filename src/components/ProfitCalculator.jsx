import React, { useState } from 'react';
import { usePortfolio } from '../store/usePortfolio';
import { Calculator } from 'lucide-react';

const ProfitCalculator = () => {
    const { holdings } = usePortfolio();

    const [selectedStock, setSelectedStock] = useState('');
    const [qtyToSell, setQtyToSell] = useState('');
    const [currentPrice, setCurrentPrice] = useState('');
    const [result, setResult] = useState(null);

    const handleCalculate = () => {
        if (!selectedStock || !qtyToSell || !currentPrice) return;

        const stock = holdings.find(h => h.symbol === selectedStock);
        if (!stock) return;

        const cost = stock.avgPrice * Number(qtyToSell);
        const revenue = Number(currentPrice) * Number(qtyToSell);
        const profit = revenue - cost;
        const roi = (profit / cost) * 100;

        setResult({
            profit,
            roi,
            revenue,
            cost
        });
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="text-center mb-10">
                <h2 className="font-serif text-3xl font-bold text-sidebar-bg">Profit Calculator</h2>
                <p className="text-text-light mt-2">Estimate potential returns before you sell</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gold-light shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <Calculator className="text-gold-main" size={24} />
                    <h3 className="font-serif text-xl font-bold text-sidebar-bg">Calculation Parameters</h3>
                </div>
                <p className="text-sm text-text-light mb-8">Select a holding and enter market details.</p>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-text-dark mb-2">Select Holding</label>
                        <select
                            value={selectedStock}
                            onChange={(e) => {
                                setSelectedStock(e.target.value);
                                setResult(null); // Reset result on change
                            }}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-main outline-none bg-gray-50"
                        >
                            <option value="">Select stock...</option>
                            {holdings.map(h => (
                                <option key={h.symbol} value={h.symbol}>
                                    {h.symbol} (Owned: {h.quantity} | Avg: ₹{h.avgPrice.toFixed(2)})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-text-dark mb-2">Quantity to Sell</label>
                            <input
                                type="number"
                                value={qtyToSell}
                                onChange={(e) => setQtyToSell(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-main outline-none"
                                placeholder="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-dark mb-2">Current Market Price (₹)</label>
                            <input
                                type="number"
                                value={currentPrice}
                                onChange={(e) => setCurrentPrice(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-main outline-none"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleCalculate}
                        disabled={!selectedStock || !qtyToSell || !currentPrice}
                        className="w-full py-4 bg-gold-main text-white font-bold rounded-xl shadow-gold hover:bg-gold-dim transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                        Calculate Potential Returns
                    </button>
                </div>
            </div>

            {result && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
                    <div className="bg-sidebar-bg text-white p-6 rounded-2xl relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Estimated Profit/Loss</p>
                            <h3 className={`text-4xl font-serif font-bold mt-2 ${result.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {result.profit >= 0 ? '+' : ''}₹{result.profit.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                            </h3>
                            <p className="text-sm text-gray-400 mt-1">
                                ROI: <span className={result.roi >= 0 ? 'text-green-400' : 'text-red-400'}>{result.roi.toFixed(2)}%</span>
                            </p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col justify-center">
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-500">Total Purchase Cost</span>
                            <span className="font-mono font-medium">₹{result.cost.toLocaleString()}</span>
                        </div>
                        <div className="w-full h-px bg-gray-100 my-2"></div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Estimated Revenue</span>
                            <span className="font-mono font-medium font-bold text-sidebar-bg">₹{result.revenue.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfitCalculator;
