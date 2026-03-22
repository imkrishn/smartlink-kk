"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type DataItem = {
  date: string;
  clicks: number;
  countries: number;
  uniqueUsers: number;
};

export default function AnalyticsBar({ data }: { data: DataItem[] }) {
  return (
    <div className="w-full h-[400px] my-6">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap={20}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => date.slice(8)}
            interval={0}
            tick={{ fontSize: 12 }}
          />
          <YAxis domain={[0, 8]} />
          <Tooltip />

          {/* 3 bars per group (per date) */}
          <Bar
            dataKey="countries"
            fill="#ef4444" // red
            barSize={5}
            radius={[5, 5, 0, 0]}
          />
          <Bar
            dataKey="clicks"
            fill="#a3e635" // green
            barSize={5}
            radius={[5, 5, 0, 0]}
          />
          <Bar
            dataKey="uniqueUsers"
            fill="#3b82f6" // blue
            barSize={5}
            radius={[5, 5, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
