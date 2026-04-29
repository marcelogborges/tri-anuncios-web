import { api, setToken, removeToken } from "@/lib/api"

export type SignInPayload = {
  email: string
  password: string
}

export type SignUpPayload = {
  name: string
  email: string
  document: string
  password: string
  password_confirmation: string
  invite_code?: string
  organization_attributes?: { name: string }
}

export type AuthUser = {
  id: number
  email: string
  name: string
  role: string
  organization_id: number
  organization_name: string
}

type SignInResponse = {
  user: AuthUser
}

type MeResponse = {
  user: AuthUser
}

export const signIn = async (payload: SignInPayload): Promise<AuthUser> => {
  const response = await api<SignInResponse>("/api/v1/auth/sign_in", {
    method: "POST",
    body: {
      user: payload,
    },
  })

  return response.user
}

export const signOut = async () => {
  await api<null>("/api/v1/auth/sign_out", {
    method: "DELETE",
  })
  removeToken()
}

export const signUp = async (payload: SignUpPayload): Promise<AuthUser> => {
  const response = await api<SignInResponse>("/api/v1/auth/sign_up", {
    method: "POST",
    body: {
      user: payload,
    },
  })

  return response.user
}

export const getMe = async (): Promise<AuthUser> => {
  const response = await api<MeResponse>("/api/v1/auth/me")
  return response.user
}

export { setToken, removeToken }
