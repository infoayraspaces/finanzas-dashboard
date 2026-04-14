import { useState } from 'react'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import { useSheetData } from './hooks/useSheetData'

export default function App() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem('finanzas_auth') === '1'
  )
  const sheetData = useSheetData()

  if (!authed) {
    return <Login onLogin={() => setAuthed(true)} />
  }

  return <Dashboard {...sheetData} />
}
