import { formatCOP, formatCOPFull } from '../utils/formatters'

export default function FlujoPorCuenta({ flujo, transactions }) {
  const totalSaldo = flujo.reduce((s, f) => s + f.saldo, 0)
  const positivos = flujo.filter(f => f.saldo > 0)
  const negativos = flujo.filter(f => f.saldo < 0)
  const totalDeuda = negativos.reduce((s, f) => s + Math.abs(f.saldo), 0)

  const maxAbs = Math.max(...flujo.map(f => Math.abs(f.saldo)), 1)

  // Activity per account this month
  const activityByCuenta = {}
  transactions.forEach(t => {
    const c = t.cuenta_origen
    if (!c) return
    activityByCuenta[c] = (activityByCuenta[c] || 0) + 1
  })

  const sorted = [...flujo].sort((a, b) => b.saldo - a.saldo)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-800 rounded-2xl p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">Patrimonio neto</p>
          <p className={`text-lg font-bold ${totalSaldo >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatCOP(totalSaldo)}
          </p>
        </div>
        <div className="bg-gray-800 rounded-2xl p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">Activos</p>
          <p className="text-lg font-bold text-blue-400">
            {formatCOP(positivos.reduce((s, f) => s + f.saldo, 0))}
          </p>
        </div>
        <div className="bg-gray-800 rounded-2xl p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">Deudas</p>
          <p className="text-lg font-bold text-orange-400">{formatCOP(totalDeuda)}</p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-gray-300 mb-4">Saldo por cuenta</h3>
        <div className="space-y-4">
          {sorted.map(({ cuenta, saldo }) => {
            const isPositive = saldo >= 0
            const barPct = maxAbs > 0 ? (Math.abs(saldo) / maxAbs) * 100 : 0
            return (
              <div key={cuenta}>
                <div className="flex justify-between items-center mb-1">
                  <div>
                    <span className="text-sm text-gray-200">{cuenta}</span>
                    {activityByCuenta[cuenta] && (
                      <span className="ml-2 text-xs text-gray-500">{activityByCuenta[cuenta]} mov.</span>
                    )}
                  </div>
                  <span className={`text-sm font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {formatCOPFull(saldo)}
                  </span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isPositive ? 'bg-blue-500' : 'bg-red-500'}`}
                    style={{ width: `${barPct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
