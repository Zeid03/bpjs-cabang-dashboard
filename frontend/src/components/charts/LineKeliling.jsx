// import React from 'react'
// import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

// export default function LineKeliling({ data = [], big }) {
//   return (
//     <div className={`bg-white rounded-2xl shadow p-4 ${big ? 'h-96' : 'h-64'}`}>
//       {/* <h2 className="font-semibold mb-2">Kegiatan Keliling (Total Peserta / Bulan)</h2> */}
//       <ResponsiveContainer width="100%" height="100%">
//         <LineChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="month" />
//           <YAxis />
//           <Tooltip />
//           <Line type="monotone" dataKey="totalPeserta" />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   )
// }

// Refactore tahap 1

import {
  ResponsiveContainer, LineChart, Line, Area, XAxis, YAxis,
  Tooltip, CartesianGrid, Legend, Brush, ReferenceLine
} from 'recharts'
import React from 'react'
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

export default function LineKeliling({ data = [], big }) {
  return (
    <div className={`bg-white rounded-2xl shadow p-4 ring-1 ring-slate-200 ${big ? 'h-96' : 'h-64'}`}>
      {/* <h2 className="font-semibold mb-2">Kegiatan Keliling (Total Peserta / Bulan)</h2> */}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 8 }}>
          <defs>
            <linearGradient id="kelilingArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={BPJS.green} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={BPJS.green} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid stroke={BPJS.grayGrid} strokeDasharray="4 4" />
          <XAxis dataKey="month" tickMargin={6}/>
          <YAxis allowDecimals={false}/>
          <Tooltip content={<Tip/>}/>
          <Legend />
          <Area type="monotone" dataKey="totalPeserta" stroke="none" fill="url(#kelilingArea)" />
          <Line
            type="monotone"
            dataKey="totalPeserta"
            stroke={BPJS.green}
            strokeWidth={3}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
            animationDuration={600}
          />
          {/* contoh target garis rata-rata */}
          {/* <ReferenceLine y={50} stroke={BPJS.blue} strokeDasharray="3 3" label="Target" /> */}
          {/* <Brush height={18} travellerWidth={8} /> */}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

