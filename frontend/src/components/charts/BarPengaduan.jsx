import React from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

export default function BarPengaduan({ data = [], big }) {
  return (
    <div className={`bg-white rounded-2xl shadow p-4 ${big ? 'h-96' : 'h-64'}`}>
      <h2 className="font-semibold mb-2">Pengaduan Peserta</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="jumlah" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
