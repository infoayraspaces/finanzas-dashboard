import { formatCOP, formatCOPFull } from '../utils/formatters'

function StatCard({ label, value, color, sub }) {
  return (
    <div className="bg-gray-800 rounded-2xl p-4">
      <p className="text-gray-400 text-xs mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{formatCOP(value)}</p>
      {sub && <p className="text-gray-500 text-xs mt-1">{sub}</p>}
    </div>
  )
}

export default function ResumenGeneral({ transactions }) {
  const gastos = transactions.filter(t => t.monto < 0 && !t.es_inversion)
  const ingresos = transactions.filter(t => t.monto > 0)
  const inversiones = transactions.filter(t => t.es_inversion)

  const totalGastos = gastos.reduce((s, t) => s + t.monto, 0)
  const totalIngresos = ingresos.reduce((s, t) => s + t.monto, 0)
  const totalInversiones = inversiones.reduce((s, t) => s + Math.abs(t.monto), 0)
  const neto = totalIngresos + totalGastos

  const recent = [...transactions]
    .sort((a, b) => (b.fechaObj?.getTime() || 0) - (a.fechaObj?.getTime() || 0))
    .slice(0, 10)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Gastos" value={Math.abs(totalGastos)} color="text-red-400" sub={`${gastos.length} transacciones`} />
        <StatCard label="Ingresos" value={totalIngresos} color="text-green-400" sub={`${ingresos.length} transacciones`} />
        <StatCard label="Saldo neto" value={neto} color={neto >= 0 ? 'text-blue-400' : 'text-orange-400'} />
        <StatCard label="Inversiones" value={totalInversiones} color="text-purple-400" sub={`${inversiones.length} mov.`} />
      </div>

      <div className="bg-gray-800 rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">Últimas transacciones</h3>
        <div className="space-y-2">
          {recent.map((t, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-0">
              <div className="flex-1 min-w-0 mr-3">
                <p className="text-sm text-white truncate">{t.descripcion || '—'}</p>
                <p className="text-xs text-gray-500">{t.fecha} · {t.categoria}</p>
              </div>
              <div className="text-right shrink-0">
                <p className={`text-sm font-semibold ${t.monto >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {t.monto >= 0 ? '+' : ''}{formatCOPFull(t.monto)}
                </p>
                <p className="text-xs text-gray-500">{t.cuenta_origen}</p>
              </div>
            </div>
          ))}
          {recent.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-4">Sin transacciones este mes</p>
          )}
        </div>
      </div>
    </div>
  )
}
