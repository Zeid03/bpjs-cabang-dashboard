// import React from 'react'
// import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

// export default function BarPengaduan({ data = [], big }) {
//   return (
//     <div className={`bg-white rounded-2xl shadow p-4 ${big ? 'h-96' : 'h-64'}`}>
//       {/* <h2 className="font-semibold mb-2">Pengaduan Peserta</h2> */}
//       <ResponsiveContainer width="100%" height="100%">
//         <BarChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="month" />
//           <YAxis />
//           <Tooltip />
//           <Bar dataKey="jumlah" />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   )
// }


// Refactore tahap 1

import React from 'react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, Legend, ReferenceLine, LabelList
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

export default function BarPengaduan({ data = [], big, target }) {
  // target opsional: misal 10 pengaduan/bulan
  return (
    <div className={`bg-white rounded-2xl shadow p-4 ring-1 ring-slate-200 ${big ? 'h-96' : 'h-64'}`}>
      {/* <h2 className="font-semibold mb-2">Pengaduan Peserta</h2> */}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 8 }}>
          <CartesianGrid stroke={BPJS.grayGrid} strokeDasharray="4 4" />
          <XAxis dataKey="month" tickMargin={6}/>
          <YAxis allowDecimals={false}/>
          <Tooltip content={<Tip/>}/>
          <Legend />
          {typeof target === 'number' && (
            <ReferenceLine y={target} stroke={BPJS.blue} strokeDasharray="3 3" label={`Target ${target}`}/>
          )}
          <Bar dataKey="jumlah" fill={BPJS.blue} radius={[8,8,0,0]}>
            <LabelList dataKey="jumlah" position="top" className="text-[10px]" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
