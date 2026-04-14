import { formatCOP, formatCOPFull, PRESUPUESTO } from '../utils/formatters'

function ProgressBar({ pct }) {
  const color = pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-yellow-500' : 'bg-green-500'
  return (
    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${Math.min(pct, 100)}%` }} />
    </div>
  )
}

export default function VsPresupuesto({ transactions }) {
  const gastos = transactions.filter(t => t.monto < 0 && !t.es_inversion)

  const gastoPorCategoria = {}
  gastos.forEach(t => {
    const cat = t.categoria || 'Otros'
    gastoPorCategoria[cat] = (gastoPorCategoria[cat] || 0) + Math.abs(t.monto)
  })

  const categoriesWithBudget = Object.entries(PRESUPUESTO)
    .filter(([, budget]) => budget > 0)
    .map(([cat, budget]) => {
      const gastado = gastoPorCategoria[cat] || 0
      const pct = (gastado / budget) * 100
      return { cat, budget, gastado, pct }
    })

  const totalBudget = categoriesWithBudget.reduce((s, c) => s + c.budget, 0)
  const totalGastado = categoriesWithBudget.reduce((s, c) => s + c.gastado, 0)
  const globalPct = totalBudget > 0 ? (totalGastado / totalBudget) * 100 : 0

  const sorted = [...categoriesWithBudget].sort((a, b) => b.pct - a.pct)

  return (
    <div className="space-y-4">
      <div className="bg-gray-800 rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Ejecución global</h3>
        <div className="flex items-end gap-3 mb-3">
          <span className="text-3xl font-bold text-white">{globalPct.toFixed(0)}%</span>
          <span className="text-gray-400 text-sm mb-1">
            {formatCOP(totalGastado)} / {formatCOP(totalBudget)}
          </span>
        </div>
        <ProgressBar pct={globalPct} />
        <p className="text-xs text-gray-500 mt-2">
          {globalPct >= 100 ? '⚠️ Presupuesto superado' : `Quedan ${formatCOP(totalBudget - totalGastado)}`}
        </p>
      </div>

      <div className="bg-gray-800 rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-gray-300 mb-4">Por categoría</h3>
        <div className="space-y-4">
          {sorted.map(({ cat, budget, gastado, pct }) => (
            <div key={cat}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-300">{cat}</span>
                <div className="text-right">
                  <span className={`text-xs font-bold ${pct >= 100 ? 'text-red-400' : pct >= 80 ? 'text-yellow-400' : 'text-green-400'}`}>
                    {pct.toFixed(0)}%
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    {formatCOP(gastado)}/{formatCOP(budget)}
                  </span>
                </div>
              </div>
              <ProgressBar pct={pct} />
            </div>
          ))}
        </div>
      </div>

      {/* Categories with spending but no budget */}
      {Object.entries(gastoPorCategoria)
        .filter(([cat]) => !PRESUPUESTO[cat] || PRESUPUESTO[cat] === 0)
        .length > 0 && (
        <div className="bg-gray-800 rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Sin presupuesto asignado</h3>
          <div className="space-y-2">
            {Object.entries(gastoPorCategoria)
              .filter(([cat]) => !PRESUPUESTO[cat] || PRESUPUESTO[cat] === 0)
              .sort(([, a], [, b]) => b - a)
              .map(([cat, gastado]) => (
                <div key={cat} className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">{cat}</span>
                  <span className="text-sm text-gray-300">{formatCOPFull(gastado)}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
