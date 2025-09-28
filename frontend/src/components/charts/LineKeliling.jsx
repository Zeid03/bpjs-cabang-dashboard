// Tampilkan SEMUA tanggal rapi + Brush otomatis bila data panjang
import React from 'react'
import {
  ResponsiveContainer, LineChart, Line, Area, XAxis, YAxis,
  Tooltip, CartesianGrid, Legend, Brush
} from 'recharts'
import { BPJS } from './theme'

function Tip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const v = payload[0]?.value ?? 0
  return (
    <div className="rounded-xl bg-white px-3 py-2 text-sm shadow ring-1 ring-slate-200">
      <div className="font-medium">{label}</div>
      <div className="text-slate-600">Total Peserta: <b>{v}</b></div>
    </div>
  )
}

// Tick kustom 2 baris: tahun di atas, bulan di bawah -> menjaga kerapian
function MonthTick({ x, y, payload }) {
  const raw = String(payload?.value ?? '')
  const [yy, mm] = raw.split('-')
  return (
    <g transform={`translate(${x},${y})`}>
      <text textAnchor="middle" fontSize="11" fill="#334155">
        <tspan x="0" dy="14">{yy || raw}</tspan>
        {mm && <tspan x="0" dy="12">{mm}</tspan>}
      </text>
    </g>
  )
}

export default function LineKeliling({ data = [], big }) {
  const showBrush = (data?.length || 0) >= 10

  return (
    <div className={`bg-white rounded-2xl shadow p-4 ring-1 ring-slate-200 ${big ? 'h-96' : 'h-64'}`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 32 }}>
          <defs>
            <linearGradient id="kelilingArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={BPJS.green} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={BPJS.green} stopOpacity={0}/>
            </linearGradient>
          </defs>

          <CartesianGrid stroke={BPJS.grayGrid} strokeDasharray="4 4" />
          <XAxis
            dataKey="month"
            interval={0}
            tick={<MonthTick />}
            height={36}
            tickMargin={0}
          />
          <YAxis allowDecimals={false} />
          <Legend verticalAlign="bottom" align="center" height={28} iconType="circle"
                  wrapperStyle={{ paddingTop: 6 }} />

          <Area type="monotone" dataKey="totalPeserta" stroke="none" fill="url(#kelilingArea)" />
          <Line
            type="monotone"
            dataKey="totalPeserta"
            stroke={BPJS.green}
            strokeWidth={3}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
            animationDuration={500}
          />

          {showBrush && <Brush height={18} travellerWidth={8} />}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
