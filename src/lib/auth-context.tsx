"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useRouter } from "next/navigation"
import {
  type AuthUser,
  type SignInPayload,
  type SignUpPayload,
  signIn as apiSignIn,
  signOut as apiSignOut,
  signUp as apiSignUp,
  getMe,
} from "@/api/auth"
import { getToken, removeToken } from "@/lib/api"

type AuthState = {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: (payload: SignInPayload) => Promise<void>
  signUp: (payload: SignUpPayload) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      setIsLoading(false)
      return
    }
    const loadMe = async () => {
      try {
        setUser(await getMe())
      } catch {
        removeToken()
      } finally {
        setIsLoading(false)
      }
    }
    loadMe()
  }, [])

  const signIn = useCallback(
    async (payload: SignInPayload) => {
      const authUser = await apiSignIn(payload)
      setUser(authUser)
      router.push("/")
    },
    [router]
  )

  const signUp = useCallback(
    async (payload: SignUpPayload) => {
      const authUser = await apiSignUp(payload)
      setUser(authUser)
      router.push("/")
    },
    [router]
  )

  const signOut = useCallback(async () => {
    await apiSignOut()
    setUser(null)
    router.push("/login")
  }, [router])

  const value = useMemo<AuthState>(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      signIn,
      signUp,
      signOut,
    }),
    [user, isLoading, signIn, signUp, signOut]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthState => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
