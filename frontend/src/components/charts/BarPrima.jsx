// import React from 'react'
// import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

// export default function BarPrima({ data = [], big }) {
//   return (
//     <div className={`bg-white rounded-2xl shadow p-4 ${big ? 'h-96' : 'h-64'}`}>
//       {/* <h2 className="font-semibold mb-2">Indeks Pelayanan Prima</h2> */}
//       <ResponsiveContainer width="100%" height="100%">
//         <BarChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="month" />
//           <YAxis />
//           <Tooltip />
//           <Bar dataKey="nilai" />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   )
// }

// Refactore tahap 1
import React from 'react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, Legend, LabelList
} from 'recharts'
import { BPJS } from './theme'

function Tip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const v = payload[0]?.value ?? 0
  return (
    <div className="rounded-xl bg-white px-3 py-2 text-sm shadow ring-1 ring-slate-200">
      <div className="font-medium">{label}</div>
      <div className="text-slate-600">Indeks Prima: <b>{v}</b></div>
    </div>
  )
}

export default function BarPrima({ data = [], big }) {
  return (
    <div className={`bg-white rounded-2xl shadow p-4 ring-1 ring-slate-200 ${big ? 'h-96' : 'h-64'}`}>
      {/* <h2 className="font-semibold mb-2">Indeks Pelayanan Prima</h2> */}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 8 }}>
          <defs>
            <pattern id="primaPattern" width="6" height="6" patternUnits="userSpaceOnUse">
              <rect width="6" height="6" fill={BPJS.green}/>
              <path d="M0,6 l6,-6 M-1,1 l2,-2 M5,7 l2,-2" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <CartesianGrid stroke={BPJS.grayGrid} strokeDasharray="4 4" />
          <XAxis dataKey="month" tickMargin={6}/>
          <YAxis />
          <Tooltip content={<Tip/>}/>
          <Legend />
          <Bar dataKey="nilai" fill="url(#primaPattern)" radius={[8,8,0,0]}>
            <LabelList dataKey="nilai" position="top" className="text-[10px]" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
