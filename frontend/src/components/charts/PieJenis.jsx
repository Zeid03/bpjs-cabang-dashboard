import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function PieJenis({ data }) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={100} label />
          <Tooltip />
          {data.map((_, i) => (
            <Cell key={i} />
          ))}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
