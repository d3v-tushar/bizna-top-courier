'use client';

import {
  Bar,
  BarChart as BChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

interface DataChartProps {
  data: {
    name: string;
    total: number;
  }[];
}

export function BarChart({ data }: DataChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar
          dataKey="total"
          fill="#048ed6"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BChart>
    </ResponsiveContainer>
  );
}
