import React from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

export default function LineViola({ data = [], big }) {
  return (
    <div className={`bg-white rounded-2xl shadow p-4 ${big ? 'h-96' : 'h-64'}`}>
      <h2 className="font-semibold mb-2">VIOLA (Skor / Bulan)</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="skor" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
