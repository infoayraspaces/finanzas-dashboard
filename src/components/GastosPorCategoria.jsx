import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatCOP, formatCOPFull, CATEGORY_COLORS } from '../utils/formatters'

export default function GastosPorCategoria({ transactions }) {
  const gastos = transactions.filter(t => t.tipo === 'gasto')

  const byCategory = {}
  gastos.forEach(t => {
    const cat = t.categoria || 'Otros'
    byCategory[cat] = (byCategory[cat] || 0) + Math.abs(t.monto)
  })

  const data = Object.entries(byCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  const total = data.reduce((s, d) => s + d.value, 0)

  if (data.length === 0) {
    return (
      <div className="bg-gray-800 rounded-2xl p-8 text-center">
        <p className="text-gray-500">Sin gastos registrados este mes</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-800 rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-gray-300 mb-4">Distribución</h3>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || '#9ca3af'} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [formatCOPFull(value), '']}
              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
              labelStyle={{ color: '#fff' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gray-800 rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">Detalle por categoría</h3>
        <div className="space-y-3">
          {data.map(({ name, value }) => {
            const pct = total > 0 ? (value / total) * 100 : 0
            const color = CATEGORY_COLORS[name] || '#9ca3af'
            return (
              <div key={name}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: color }} />
                    <span className="text-sm text-gray-300">{name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-white">{formatCOP(value)}</span>
                    <span className="text-xs text-gray-500 ml-2">{pct.toFixed(0)}%</span>
                  </div>
                </div>
                <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
