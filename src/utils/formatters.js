export const CUENTAS = ['Bancolombia', 'Nequi', 'TC Visa', 'TC Nubank', 'Cardiff', 'Davivienda', 'Efectivo']

export const CATEGORIES = [
  'Comida', 'Transporte', 'Gym', 'Servicios públicos', 'Arriendo',
  'Farras', 'Barbería', 'Netflix', 'Celular', 'Icloud', 'Google',
  'Soccer', 'Compras mías', 'Personal brand', 'Diseño de sonrisa',
  'Casa Modelia', 'Criptos', 'AYRA', 'Otros',
]

export const CATEGORY_COLORS = {
  'Comida': '#f59e0b',
  'Transporte': '#3b82f6',
  'Gym': '#10b981',
  'Servicios públicos': '#6366f1',
  'Arriendo': '#ef4444',
  'Farras': '#ec4899',
  'Barbería': '#8b5cf6',
  'Netflix': '#dc2626',
  'Celular': '#0ea5e9',
  'Icloud': '#64748b',
  'Google': '#22c55e',
  'Soccer': '#a3e635',
  'Compras mías': '#fb923c',
  'Personal brand': '#f472b6',
  'Diseño de sonrisa': '#c084fc',
  'Casa Modelia': '#34d399',
  'Criptos': '#fbbf24',
  'AYRA': '#f87171',
  'Otros': '#9ca3af',
}

// Monthly budgets in COP
export const PRESUPUESTO = {
  'Comida': 600000,
  'Transporte': 200000,
  'Gym': 110000,
  'Servicios públicos': 150000,
  'Arriendo': 0,
  'Farras': 300000,
  'Barbería': 50000,
  'Netflix': 20000,
  'Celular': 80000,
  'Icloud': 15000,
  'Google': 10000,
  'Soccer': 50000,
  'Compras mías': 300000,
  'Personal brand': 0,
  'Diseño de sonrisa': 0,
  'Casa Modelia': 0,
  'Criptos': 0,
  'AYRA': 0,
  'Otros': 100000,
}

export function formatCOP(value) {
  const abs = Math.abs(value)
  if (abs >= 1_000_000) {
    return `$${(abs / 1_000_000).toFixed(1)}M`
  }
  if (abs >= 1_000) {
    return `$${(abs / 1_000).toFixed(0)}k`
  }
  return `$${abs.toLocaleString('es-CO')}`
}

export function formatCOPFull(value) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function filterByMonth(transactions, year, month) {
  return transactions.filter(t => {
    const d = t.fechaObj
    if (!d) return false
    return d.getFullYear() === year && d.getMonth() + 1 === month
  })
}

export function parseDate(fechaStr) {
  if (!fechaStr) return null
  // Expected format: DD/MM/YYYY
  const parts = String(fechaStr).split('/')
  if (parts.length !== 3) return null
  const [d, m, y] = parts.map(Number)
  if (!d || !m || !y) return null
  return new Date(y, m - 1, d)
}
