import React from 'react';
import { usePortfolio } from '../store/usePortfolio';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StockList() {
    const { holdings } = usePortfolio();

    // Filter only active holdings or those with PnL history
    const activeHoldings = holdings.filter(h => h.quantity > 0 || h.realizedPnL !== 0);

    if (activeHoldings.length === 0) return null;

    return (
        <div className="glass-card p-6 overflow-hidden">
            <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-6">Your Portfolio</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/10 text-gray-500 text-xs uppercase tracking-wider">
                            <th className="pb-4 pl-4">Stock</th>
                            <th className="pb-4 text-right">Quantity</th>
                            <th className="pb-4 text-right">Avg Cost</th>
                            <th className="pb-4 text-right">Invested</th>
                            <th className="pb-4 text-right pr-4">Realized P&L</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {activeHoldings.map((stock) => (
                            <tr key={stock.symbol} className="hover:bg-white/5 transition-colors group">
                                <td className="py-4 pl-4 font-bold text-white group-hover:text-neon-gold transition-colors">
                                    {stock.symbol}
                                </td>
                                <td className="py-4 text-right font-mono text-gray-300">
                                    {stock.quantity}
                                </td>
                                <td className="py-4 text-right font-mono text-gray-300">
                                    ₹{stock.avgPrice.toFixed(2)}
                                </td>
                                <td className="py-4 text-right font-mono text-white font-bold">
                                    ₹{stock.totalInvested.toLocaleString()}
                                </td>
                                <td className={`py-4 text-right pr-4 font-mono font-bold ${stock.realizedPnL >= 0 ? 'text-neon-gold' : 'text-red-500'
                                    }`}>
                                    {stock.realizedPnL !== 0 ? (
                                        <span className="flex items-center justify-end gap-1">
                                            {stock.realizedPnL >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                            {stock.realizedPnL >= 0 ? '+' : ''}₹{stock.realizedPnL.toLocaleString()}
                                        </span>
                                    ) : '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
