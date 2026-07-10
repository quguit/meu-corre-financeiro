import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Dashboard from './pages/Dashboard'
import Contas from './pages/Contas'
import Titulos from './pages/Titulos'
import RotaProtegida from './components/RotaProtegida'
import Relatorio from './pages/Relatorio'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas — qualquer um acessa */}
        <Route path="/login"    element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Rotas protegidas — exige login */}
        <Route path="/dashboard" element={
          <RotaProtegida><Dashboard /></RotaProtegida>
        } />
        <Route path="/contas" element={
          <RotaProtegida><Contas /></RotaProtegida>
        } />
        <Route path="/titulos" element={
          <RotaProtegida><Titulos /></RotaProtegida>
        } />
        <Route path="/titulos/novo" element={
          <RotaProtegida><Titulos /></RotaProtegida>
        } />
        <Route path="/relatorio" element={
          <RotaProtegida><Relatorio /></RotaProtegida>
        } />

        {/* Qualquer rota desconhecida → login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)