import React from 'react'
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  LabelList,
  Line,
  Cell,
  Brush,
  ReferenceLine,
} from 'recharts'
import { BPJS } from './theme'

// ===== Warna =====
const COLORS = {
  equal: '#22c55e',     // hijau → sama dengan target
  above: '#3b82f6',     // biru  → lebih dari target
  below: '#ef4444',     // merah → kurang dari target
  targetLine: '#f59e0b' // emas → garis target
}

// ===== Util warna bar per nilai vs target =====
function colorByTarget(value, target) {
  if (target == null || isNaN(target)) return BPJS.green
  const v = Number(value) || 0
  const t = Number(target) || 0
  if (v === t) return COLORS.equal
  if (v > t)   return COLORS.above
  return COLORS.below
}

// ===== Tooltip kustom =====
function Tip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const map = Object.fromEntries(payload.map(p => [p.dataKey, p.value]))
  return (
    <div className="rounded-xl bg-white px-3 py-2 text-sm shadow ring-1 ring-slate-200">
      <div className="font-medium mb-1">{label}</div>
      <div className="space-y-0.5">
        <div className="text-slate-700">Target: <b>{Number(map.target ?? 0).toFixed(2)}</b></div>
        <div className="text-slate-600">Wave 1: <b>{Number(map.wave1 ?? 0).toFixed(2)}</b></div>
        <div className="text-slate-600">Wave 2: <b>{Number(map.wave2 ?? 0).toFixed(2)}</b></div>
        <div className="text-slate-600">Wave 3: <b>{Number(map.wave3 ?? 0).toFixed(2)}</b></div>
        <div className="text-slate-600">Wave 4: <b>{Number(map.wave4 ?? 0).toFixed(2)}</b></div>
      </div>
    </div>
  )
}

// ===== Label angka kecil di atas bar =====
const SmallValueLabel = ({ x, y, width, value }) => {
  if (value == null) return null
  const cx = x + width / 2
  const cy = y - 4
  return (
    <text x={cx} y={cy} textAnchor="middle" className="fill-slate-600" fontSize="6">
      {Number(value).toFixed(1)}
    </text>
  )
}

// ===== Tick kustom 2 baris agar semua tanggal tampil rapi =====
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

export default function BarPrima({ data = [], big }) {
  const showBrush = (data?.length || 0) >= 10

  // Ambil satu nilai target tahunan untuk label ReferenceLine
  const targetY = React.useMemo(() => {
    if (!Array.isArray(data)) return undefined
    for (const d of data) {
      const t = Number(d?.target)
      if (Number.isFinite(t)) return t
    }
    return undefined
  }, [data])

  return (
    <div className={`bg-white rounded-2xl shadow p-4 ring-1 ring-slate-200 ${big ? 'h-96' : 'h-64'}`}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 16, left: 0, bottom: 40 }}
          barCategoryGap="24%"
          barGap={4}
        >
          <CartesianGrid stroke={BPJS.grayGrid} strokeDasharray="4 4" />
          <XAxis
            dataKey="month"
            interval={0}
            tick={<MonthTick />}
            height={36}
            tickMargin={0}
          />
          <YAxis />

          <Tooltip content={<Tip />} />
          <Legend
            verticalAlign="bottom"
            align="center"
            layout="horizontal"
            height={40}
            iconType="circle"
            wrapperStyle={{ paddingTop: 6 }}
          />

          {/* Wave 1 */}
          <Bar name="Wave 1" dataKey="wave1" radius={[8,8,0,0]} maxBarSize={26}>
            <LabelList dataKey="wave1" content={<SmallValueLabel />} />
            {data.map((d, i) => (
              <Cell key={`w1-${i}`} fill={colorByTarget(d.wave1, d.target)} />
            ))}
          </Bar>

          {/* Wave 2 */}
          <Bar name="Wave 2" dataKey="wave2" radius={[8,8,0,0]} maxBarSize={26}>
            <LabelList dataKey="wave2" content={<SmallValueLabel />} />
            {data.map((d, i) => (
              <Cell key={`w2-${i}`} fill={colorByTarget(d.wave2, d.target)} />
            ))}
          </Bar>

          {/* Wave 3 */}
          <Bar name="Wave 3" dataKey="wave3" radius={[8,8,0,0]} maxBarSize={26}>
            <LabelList dataKey="wave3" content={<SmallValueLabel />} />
            {data.map((d, i) => (
              <Cell key={`w3-${i}`} fill={colorByTarget(d.wave3, d.target)} />
            ))}
          </Bar>

          {/* Wave 4 */}
          <Bar name="Wave 4" dataKey="wave4" radius={[8,8,0,0]} maxBarSize={26}>
            <LabelList dataKey="wave4" content={<SmallValueLabel />} />
            {data.map((d, i) => (
              <Cell key={`w4-${i}`} fill={colorByTarget(d.wave4, d.target)} />
            ))}
          </Bar>

          {/* Garis Target */}
          <Line
            name="Target"
            type="monotone"
            dataKey="target"
            stroke={COLORS.targetLine}
            strokeWidth={2}
            dot={{ r: 2 }}
            activeDot={{ r: 4 }}
          />

          

          {showBrush && <Brush height={18} travellerWidth={8} />}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
