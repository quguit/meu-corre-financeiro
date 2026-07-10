import { Navigate } from 'react-router-dom'
import { authService } from '../services/auth'

export default function RotaProtegida({ children }) {
  if (!authService.estaLogado()) {
    return <Navigate to="/login" replace />
  }
  return children
}