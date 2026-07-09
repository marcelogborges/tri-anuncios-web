export type BrazilianState = {
  id: number
  name: string
  uf: string
}

type IBGEEstado = {
  id: number
  sigla: string
  nome: string
}

let cachedStates: BrazilianState[] | null = null
let fetchPromise: Promise<BrazilianState[]> | null = null

const fetchAllStates = async (): Promise<BrazilianState[]> => {
  if (cachedStates) return cachedStates

  if (fetchPromise) return fetchPromise

  fetchPromise = (async () => {
    try {
      const res = await fetch(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
      )

      if (!res.ok) throw new Error("Erro ao buscar estados")

      const data: IBGEEstado[] = await res.json()

      cachedStates = data.map((s) => ({
        id: s.id,
        name: s.nome,
        uf: s.sigla,
      }))

      return cachedStates
    } catch (err) {
      fetchPromise = null
      throw err
    }
  })()

  return fetchPromise
}

const normalize = (str: string) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()

export const searchStates = async (query: string): Promise<BrazilianState[]> => {
  if (query.length < 2) return []

  const states = await fetchAllStates()
  const normalized = normalize(query)

  return states.filter(
    (s) => normalize(s.name).startsWith(normalized) || normalize(s.uf) === normalized
  )
}
