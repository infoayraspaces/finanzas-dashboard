import { useState } from 'react'

const CORRECT_PASSWORD = import.meta.env.VITE_DASHBOARD_PASSWORD || 'Jamesbarrios1.'

export default function Login({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (password === CORRECT_PASSWORD) {
      sessionStorage.setItem('finanzas_auth', '1')
      onLogin()
    } else {
      setError('Contraseña incorrecta')
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">💰</div>
          <h1 className="text-2xl font-bold text-white">Finanzas James</h1>
          <p className="text-gray-400 text-sm mt-1">Dashboard personal</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-2xl p-6 shadow-xl">
          <label className="block text-sm text-gray-400 mb-2">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError('') }}
            className="w-full bg-gray-700 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-base"
            placeholder="••••••••"
            autoFocus
          />
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}
