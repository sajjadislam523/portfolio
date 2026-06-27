import jwt from 'jsonwebtoken'
import type { JWTPayload, AuthSession } from '@/types'

const JWT_EXPIRES_IN = '7d'
export const AUTH_COOKIE = 'portfolio_auth'

function getSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not defined.')
  return secret
}

export function signToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, getSecret(), { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, getSecret()) as JWTPayload
  } catch {
    return null
  }
}

export function getSessionFromToken(token: string): AuthSession | null {
  const payload = verifyToken(token)
  if (!payload) return null
  return {
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
  }
}
