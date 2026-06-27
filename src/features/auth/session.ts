import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getSessionFromToken, AUTH_COOKIE } from '@/lib/auth/jwt'
import type { AuthSession } from '@/types'

/**
 * Returns the current admin session from the httpOnly cookie.
 * Returns null if no valid session exists.
 * Use this in Server Components that should gracefully handle unauthenticated state.
 */
export async function getSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE)?.value
  if (!token) return null
  return getSessionFromToken(token)
}

/**
 * Returns the current session or redirects to login.
 * Use this in all admin Server Components and Server Actions that require auth.
 */
export async function requireSession(): Promise<AuthSession> {
  const session = await getSession()
  if (!session) {
    redirect('/admin/login')
  }
  return session
}
