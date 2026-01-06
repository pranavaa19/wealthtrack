import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { usePortfolio } from '../store/usePortfolio';

const COLORS = ['#FFD700', '#00F0FF', '#FF00E6', '#00FF9D', '#FFFFFF'];

export default function AllocationChart() {
    const { holdings } = usePortfolio();

    const data = holdings.map(h => ({
        name: h.symbol,
        value: h.totalInvested
    })).filter(d => d.value > 0);

    if (data.length === 0) {
        return (
            <div className="glass-card p-6 h-80 flex items-center justify-center text-gray-500">
                No holdings to display
            </div>
        );
    }

    return (
        <div className="glass-card p-6 h-80">
            <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-4">Allocation</h3>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                            animationBegin={0}
                            animationDuration={1500}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#050505', borderColor: '#333' }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value) => `₹${value.toLocaleString()}`}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
