import { useState } from 'react'
import ResumenGeneral from './ResumenGeneral'
import GastosPorCategoria from './GastosPorCategoria'
import FlujoPorCuenta from './FlujoPorCuenta'
import Timeline from './Timeline'
import VsPresupuesto from './VsPresupuesto'
import { filterByMonth } from '../utils/formatters'

const TABS = [
  { id: 'resumen', label: 'Resumen', icon: '📊' },
  { id: 'categorias', label: 'Categorías', icon: '🏷️' },
  { id: 'cuentas', label: 'Cuentas', icon: '🏦' },
  { id: 'timeline', label: 'Timeline', icon: '📈' },
  { id: 'presupuesto', label: 'Presupuesto', icon: '🎯' },
]

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

export default function Dashboard({ transactions, flujo, loading, error, refetch, lastUpdated }) {
  const now = new Date()
  const [tab, setTab] = useState('resumen')
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())

  const filtered = filterByMonth(transactions, year, month)

  function handleLogout() {
    sessionStorage.removeItem('finanzas_auth')
    window.location.reload()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-pulse">💰</div>
          <p className="text-gray-400">Cargando datos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-gray-800 rounded-2xl p-6 max-w-sm w-full text-center">
          <p className="text-red-400 mb-2">Error al cargar datos</p>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <button
            onClick={refetch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-bold text-white">💰 Finanzas James</h1>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-xs text-gray-500">
                {lastUpdated.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            <button
              onClick={refetch}
              className="text-gray-400 hover:text-white transition-colors p-1"
              title="Actualizar"
            >
              🔄
            </button>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-400 transition-colors text-sm"
            >
              Salir
            </button>
          </div>
        </div>

        {/* Month/Year filter */}
        <div className="flex gap-2">
          <select
            value={month}
            onChange={e => setMonth(Number(e.target.value))}
            className="flex-1 bg-gray-800 text-white rounded-xl px-3 py-2 text-sm outline-none"
          >
            {MONTHS.map((m, i) => (
              <option key={i + 1} value={i + 1}>{m}</option>
            ))}
          </select>
          <select
            value={year}
            onChange={e => setYear(Number(e.target.value))}
            className="bg-gray-800 text-white rounded-xl px-3 py-2 text-sm outline-none w-24"
          >
            {[2025, 2026, 2027].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-4">
        {tab === 'resumen' && <ResumenGeneral transactions={filtered} />}
        {tab === 'categorias' && <GastosPorCategoria transactions={filtered} />}
        {tab === 'cuentas' && <FlujoPorCuenta flujo={flujo} transactions={filtered} />}
        {tab === 'timeline' && <Timeline transactions={filtered} />}
        {tab === 'presupuesto' && <VsPresupuesto transactions={filtered} />}
      </div>

      {/* Bottom tab bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-3 flex flex-col items-center gap-0.5 transition-colors ${
              tab === t.id ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <span className="text-base">{t.icon}</span>
            <span className="text-xs">{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
