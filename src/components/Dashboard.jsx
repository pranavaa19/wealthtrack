import React, { useMemo } from 'react';
import { usePortfolio } from '../store/usePortfolio';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Wallet, Link, TrendingUp } from 'lucide-react';

const Dashboard = () => {
    const { holdings } = usePortfolio();

    // -- Derived State (Calculations) --
    const { totalInvested, totalUnits, topAsset, portfolioData } = useMemo(() => {
        let invested = 0;
        let units = 0;
        let assetValueMap = {};

        holdings.forEach(h => {
            // Use 'quantity' and 'totalInvested' from store
            invested += h.totalInvested;
            units += h.quantity;
            assetValueMap[h.symbol] = (assetValueMap[h.symbol] || 0) + h.totalInvested;
        });

        // Find top asset
        let top = { symbol: '-', value: 0 };
        Object.entries(assetValueMap).forEach(([symbol, value]) => {
            if (value > top.value) {
                top = { symbol, value };
            }
        });

        // Chart Data
        const data = Object.entries(assetValueMap).map(([name, value]) => ({
            name,
            value
        }));

        return {
            totalInvested: invested,
            totalUnits: units,
            topAsset: top.symbol,
            portfolioData: data
        };
    }, [holdings]);


    // Colors for the chart matching the GoldFolio palette
    const COLORS = ['#2C3E50', '#D4AF37', '#34495E', '#BFA356'];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100">
                    <p className="text-sidebar-bg font-bold text-sm">{payload[0].name}</p>
                    <p className="text-gold-main text-xs font-medium">
                        ₹{payload[0].value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Invested */}
                <div className="bg-[#FAF3DC] p-6 rounded-2xl border border-gold-light/20 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="relative z-10">
                        <p className="text-gray-500 text-xs font-bold tracking-wider uppercase mb-1">Total Invested</p>
                        <h3 className="text-3xl font-serif font-bold text-sidebar-bg">
                            ₹{totalInvested.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h3>
                    </div>
                    <div className="absolute top-4 right-4 w-10 h-10 bg-gold-main/20 rounded-full flex items-center justify-center">
                        <Wallet className="text-gold-main w-5 h-5" />
                    </div>
                </div>

                {/* Total Units */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="relative z-10">
                        <p className="text-gray-500 text-xs font-bold tracking-wider uppercase mb-1">Total Units</p>
                        <h3 className="text-3xl font-serif font-bold text-sidebar-bg">{totalUnits}</h3>
                        <p className="text-xs text-text-light mt-1">Across all assets</p>
                    </div>
                    <div className="absolute top-4 right-4 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Link className="text-gray-500 w-5 h-5" />
                    </div>
                </div>

                {/* Top Asset */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="relative z-10">
                        <p className="text-gray-500 text-xs font-bold tracking-wider uppercase mb-1">Top Asset</p>
                        <h3 className="text-3xl font-serif font-bold text-sidebar-bg">{topAsset}</h3>
                        <p className="text-xs text-text-light mt-1">By invested value</p>
                    </div>
                    <div className="absolute top-4 right-4 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="text-gray-500 w-5 h-5" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Holdings List */}
                <div className="lg:col-span-2">
                    <h2 className="font-serif text-xl font-bold text-sidebar-bg mb-6">Your Holdings</h2>
                    <div className="space-y-4">
                        {holdings.length === 0 ? (
                            <div className="p-8 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                <p className="text-gray-400 text-sm">No holdings found. Start by adding transactions.</p>
                            </div>
                        ) : (
                            holdings.map((stock, idx) => (
                                <div key={stock.symbol} className="bg-gray-50 hover:bg-white p-5 rounded-xl border border-transparent hover:border-gray-100 hover:shadow-card transition-all flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gold-main font-bold text-sm shadow-sm">
                                            {stock.symbol.substring(0, 2)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sidebar-bg">{stock.symbol}</h4>
                                            <p className="text-xs text-text-light font-medium">
                                                {stock.quantity} units @ ₹{stock.avgPrice.toFixed(0)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-sidebar-bg font-serif text-lg">
                                            ₹{stock.totalInvested.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                                        </p>
                                        <p className="text-xs text-text-light font-medium">Invested</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Portfolio Distribution Chart */}
                <div>
                    <h2 className="font-serif text-xl font-bold text-sidebar-bg mb-6">Portfolio Distribution</h2>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[300px]">
                        {portfolioData.length > 0 ? (
                            <div className="w-full h-64 relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={portfolioData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {portfolioData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>

                            </div>
                        ) : (
                            <p className="text-gray-400 text-sm">No data to display</p>
                        )}

                        {/* Legend */}
                        <div className="w-full mt-6 space-y-2">
                            {portfolioData.map((entry, index) => (
                                <div key={entry.name} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                        <span className="text-text-dark font-medium">{entry.name}</span>
                                    </div>
                                    <span className="text-text-light">{((entry.value / totalInvested) * 100).toFixed(0)}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
