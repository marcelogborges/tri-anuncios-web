import { api } from "@/lib/api"

import type { Organization } from "@/api/organization"

export type UserRole = "admin" | "manager" | "member"

export type User = {
  id: number
  name: string
  document: string | null
  email: string
  role: UserRole
  organization_id: number | null
  created_at: string
  updated_at: string
  organization: Organization | null
}

export type UserPayload = {
  name: string
  document?: string | null
  email: string
  password: string
  password_confirmation: string
  role: UserRole
  organization_id?: number | null
}

export async function createUser(payload: UserPayload) {
  return api<User>("/api/v1/users", {
    method: "POST",
    body: {
      user: payload,
    },
  })
}
