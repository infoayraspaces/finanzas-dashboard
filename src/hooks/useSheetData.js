import { useState, useEffect, useCallback } from 'react'
import { parseDate } from '../utils/formatters'

const SHEET_ID = '1Z8SoJ1MirUm85_ypVAcww1UK2khSNTFaCdr4UrxLqgY'
const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY || 'AIzaSyCO8aLMwZWONGYMFxO55vv2ePy_MDRLe4I'

async function fetchSheet(sheetName) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(sheetName)}?key=${API_KEY}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Error ${res.status} al cargar ${sheetName}`)
  const data = await res.json()
  return data.values || []
}

function parseTransactions(rows) {
  if (rows.length < 2) return []
  const [header, ...body] = rows
  return body
    .map(row => {
      const obj = {}
      header.forEach((col, i) => { obj[col] = row[i] || '' })
      const monto = parseFloat(String(obj.monto || '0').replace(/[^0-9.-]/g, '')) || 0
      return {
        ...obj,
        monto,
        fechaObj: parseDate(obj.fecha),
        es_inversion: obj.es_inversion === 'true' || obj.es_inversion === true,
      }
    })
    .filter(t => t.fechaObj !== null)
}

function parseFlujo(rows) {
  if (rows.length < 2) return []
  const [, ...body] = rows
  return body.map(row => ({
    cuenta: row[0] || '',
    saldo: parseFloat(String(row[1] || '0').replace(/[^0-9.-]/g, '')) || 0,
  }))
}

export function useSheetData() {
  const [transactions, setTransactions] = useState([])
  const [flujo, setFlujo] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [txRows, flujoRows] = await Promise.all([
        fetchSheet('Hoja 1'),
        fetchSheet('flujo'),
      ])
      setTransactions(parseTransactions(txRows))
      setFlujo(parseFlujo(flujoRows))
      setLastUpdated(new Date())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  return { transactions, flujo, loading, error, refetch: load, lastUpdated }
}
