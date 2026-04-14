import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatCOP, formatCOPFull } from '../utils/formatters'

export default function Timeline({ transactions }) {
  const gastos = transactions.filter(t => t.tipo === 'gasto')

  // Group by day
  const byDay = {}
  gastos.forEach(t => {
    if (!t.fechaObj) return
    const key = t.fecha // DD/MM/YYYY
    byDay[key] = (byDay[key] || 0) + Math.abs(t.monto)
  })

  const sortedDays = Object.entries(byDay)
    .map(([fecha, total]) => {
      const parts = fecha.split('/')
      return { fecha, total, sortKey: `${parts[2]}-${parts[1]}-${parts[0]}` }
    })
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))

  // Build cumulative data
  let cumulative = 0
  const chartData = sortedDays.map(({ fecha, total }) => {
    cumulative += total
    const day = fecha.split('/')[0]
    return { day, diario: total, acumulado: cumulative }
  })

  // Top spending days
  const topDays = [...sortedDays].sort((a, b) => b.total - a.total).slice(0, 5)

  if (chartData.length === 0) {
    return (
      <div className="bg-gray-800 rounded-2xl p-8 text-center">
        <p className="text-gray-500">Sin datos para mostrar este mes</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-800 rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-gray-300 mb-4">Gasto diario y acumulado</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="day" stroke="#6b7280" tick={{ fontSize: 11 }} />
            <YAxis stroke="#6b7280" tick={{ fontSize: 10 }} tickFormatter={v => formatCOP(v)} width={55} />
            <Tooltip
              formatter={(value, name) => [formatCOPFull(value), name === 'diario' ? 'Día' : 'Acumulado']}
              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
              labelStyle={{ color: '#9ca3af', fontSize: 12 }}
            />
            <Line type="monotone" dataKey="diario" stroke="#3b82f6" strokeWidth={2} dot={false} name="diario" />
            <Line type="monotone" dataKey="acumulado" stroke="#f59e0b" strokeWidth={2} dot={false} name="acumulado" />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2 justify-center">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-blue-500 inline-block rounded" />
            <span className="text-xs text-gray-400">Diario</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-amber-500 inline-block rounded" />
            <span className="text-xs text-gray-400">Acumulado</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">Días de mayor gasto</h3>
        <div className="space-y-2">
          {topDays.map(({ fecha, total }, i) => (
            <div key={fecha} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-4">{i + 1}</span>
                <span className="text-sm text-gray-300">{fecha}</span>
              </div>
              <span className="text-sm font-semibold text-red-400">{formatCOPFull(total)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
