// Refactore tahap 2
import React from 'react'
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  Tooltip, CartesianGrid, Legend, Area
} from 'recharts'
import { BPJS } from './theme'

function Tip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const v = payload[0]?.value ?? 0
  return (
    <div className="rounded-xl bg-white px-3 py-2 text-sm shadow ring-1 ring-slate-200">
      <div className="font-medium">{label}</div>
      <div className="text-slate-600">Jumlah Peserta: <b>{v}</b></div>
    </div>
  )
}

export default function LineViola({ data = [], big }) {
  return (
    <div className={`bg-white rounded-2xl shadow p-4 ring-1 ring-slate-200 ${big ? 'h-96' : 'h-64'}`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 8 }}>
          <defs>
            <linearGradient id="violaArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={BPJS.blue} stopOpacity={0.25}/>
              <stop offset="95%" stopColor={BPJS.blue} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid stroke={BPJS.grayGrid} strokeDasharray="4 4" />
          <XAxis dataKey="month" tickMargin={6}/>
          <YAxis domain={['auto','auto']}/>
          <Tooltip content={<Tip/>}/>
          <Legend />
          <Area type="monotone" dataKey="jumlahPeserta" stroke="none" fill="url(#violaArea)" />
          <Line
            type="monotone"
            dataKey="jumlahPeserta"
            stroke={BPJS.blue}
            strokeWidth={3}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
            animationDuration={600}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
