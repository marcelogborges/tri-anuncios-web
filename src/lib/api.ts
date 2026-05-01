const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL ?? "http://localhost:3000"

type ApiMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE"

type ApiOptions = {
  method?: ApiMethod
  body?: unknown
  headers?: HeadersInit
  cache?: RequestCache
  credentials?: RequestCredentials
}

export class ApiError extends Error {
  status: number
  data: unknown

  constructor(message: string, status: number, data: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.data = data
  }
}

const TOKEN_KEY = "auth_token"

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY)
}

export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const {
    body,
    headers,
    method = "GET",
    cache = "no-store",
    credentials,
  } = options

  const token = getToken()
  const authHeaders: Record<string, string> = {}
  if (token) {
    authHeaders["Authorization"] = `Bearer ${token}`
  }

  const isFormData = body instanceof FormData
  const response = await fetch(`${API_URL}${path}`, {
    method,
    cache,
    credentials,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...authHeaders,
      ...headers,
    },
    body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
  })

  const authorizationHeader = response.headers.get("Authorization")
  if (authorizationHeader) {
    const jwt = authorizationHeader.replace("Bearer ", "")
    setToken(jwt)
  }

  if (response.status === 204) {
    return null as T
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(`Request failed with status ${response.status}`, response.status, data)
  }

  return data as T
}
