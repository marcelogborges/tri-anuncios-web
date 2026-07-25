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

export type UpdateUserPayload = {
  name?: string
  email?: string
  password?: string
  password_confirmation?: string
}

export async function createUser(payload: UserPayload) {
  return api<User>("/api/v1/users", {
    method: "POST",
    body: {
      user: payload,
    },
  })
}

export async function updateUser(id: number | string, payload: UpdateUserPayload) {
  return api<User>(`/api/v1/users/${id}`, {
    method: "PATCH",
    body: {
      user: payload,
    },
  })
}
