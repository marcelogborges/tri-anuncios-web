import type { Data } from "@measured/puck"

/**
 * Dynamic Text Replacement (à la Unbounce): replaces {{param|fallback}}
 * tokens in every string of the page data with URL query param values.
 * Example: "Marmitas {{sabor|deliciosas}}" + ?sabor=fitness -> "Marmitas fitness".
 */
export function applyDynamicText(data: Data, params: URLSearchParams): Data {
  const json = JSON.stringify(data).replace(
    /\{\{(\w+)(?:\|([^}]*))?\}\}/g,
    (_match, key: string, fallback = "") => {
      const value = params.get(key) ?? fallback
      // keep the result JSON-safe (quotes, backslashes, newlines)
      return JSON.stringify(value).slice(1, -1)
    },
  )
  return JSON.parse(json) as Data
}
