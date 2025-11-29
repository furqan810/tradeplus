import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { TradeResult } from '../types';

interface ResultChartProps {
  result: TradeResult;
}

const ResultChart: React.FC<ResultChartProps> = ({ result }) => {
  const data = [
    {
      name: 'Investment',
      amount: result.initialInvestment,
      fill: '#6366f1', // Indigo
    },
    {
      name: 'Fees',
      amount: result.totalFees,
      fill: '#94a3b8', // Slate 400
    },
    {
      name: 'Final Value',
      amount: result.grossSale - result.totalFees, // Net Return
      fill: result.isProfitable ? '#10b981' : '#ef4444', // Emerald or Red
    },
  ];

  return (
    <div className="h-64 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#94a3b8" 
            tick={{ fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            contentStyle={{ 
              backgroundColor: '#1e293b', 
              borderColor: '#334155',
              color: '#f1f5f9'
            }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
          />
          <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
             {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResultChart;