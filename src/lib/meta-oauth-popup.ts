export const notifyOAuthParent = (
  type: "meta-oauth-success" | "meta-oauth-error",
  message?: string
): boolean => {
  if (!window.opener) return false
  window.opener.postMessage(
    { type, ...(message ? { message } : {}) },
    window.location.origin
  )
  window.close()
  return true
}
