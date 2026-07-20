import { api } from "@/lib/api"

export type Organization = {
  id: number
  name: string
  slug: string
  document: string | null
  sector: string | null
  niche: string | null
  created_at: string
  updated_at: string
}

export type OrganizationPayload = {
  name: string
  document?: string | null
  sector?: string | null
  niche?: string | null
}

export async function getOrganizations() {
  return api<Organization[]>("/api/v1/organizations")
}

export async function getOrganization(id: number | string) {
  const response = await api<{ organization: Organization }>(`/api/v1/organizations/${id}`)
  return response.organization
}

export async function createOrganization(payload: OrganizationPayload) {
  return api<Organization>("/api/v1/organizations", {
    method: "POST",
    body: {
      organization: payload,
    },
  })
}

export async function updateOrganization(
  id: number | string,
  payload: Partial<OrganizationPayload>
) {
  const response = await api<{ organization: Organization }>(`/api/v1/organizations/${id}`, {
    method: "PATCH",
    body: {
      organization: payload,
    },
  })
  return response.organization
}

export async function deleteOrganization(id: number | string) {
  return api<null>(`/api/v1/organizations/${id}`, {
    method: "DELETE",
  })
}

export type InviteLookup = {
  organization: { id: number; name: string }
}

export async function lookupInviteCode(inviteCode: string) {
  return api<InviteLookup>(`/api/v1/organizations/invite/${encodeURIComponent(inviteCode)}`)
}
