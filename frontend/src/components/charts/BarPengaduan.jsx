// Tampilkan SEMUA tanggal rapi + Brush otomatis bila data panjang
import React from 'react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, Legend, ReferenceLine, LabelList, Brush
} from 'recharts'
import { BPJS } from './theme'

function Tip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const v = payload[0]?.value ?? 0
  return (
    <div className="rounded-xl bg-white px-3 py-2 text-sm shadow ring-1 ring-slate-200">
      <div className="font-medium">{label}</div>
      <div className="text-slate-600">Jumlah Pengaduan: <b>{v}</b></div>
    </div>
  )
}

// Tick kustom 2 baris: tahun / bulan
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

export default function BarPengaduan({ data = [], big, target }) {
  const showBrush = (data?.length || 0) >= 10

  return (
    <div className={`bg-white rounded-2xl shadow p-4 ring-1 ring-slate-200 ${big ? 'h-96' : 'h-64'}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 16, left: 0, bottom: 32 }}
          barCategoryGap="22%"   // jaga jarak antar bar
          barGap={2}
        >
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


          {typeof target === 'number' && (
            <ReferenceLine y={target} stroke={BPJS.blue} strokeDasharray="3 3" label={`Target ${target}`}/>
          )}

          <Bar dataKey="jumlah" fill={BPJS.blue} radius={[8,8,0,0]}>
            <LabelList dataKey="jumlah" position="top" className="text-[10px]" />
          </Bar>

          {showBrush && <Brush height={18} travellerWidth={8} />}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
