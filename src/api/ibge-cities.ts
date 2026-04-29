export type BrazilianCity = {
  id: number
  name: string
  state: string
}

type IBGEMunicipio = {
  id: number
  nome: string
  microrregiao?: {
    mesorregiao?: {
      UF?: {
        sigla?: string
      }
    }
  } | null
}

let cachedCities: BrazilianCity[] | null = null
let fetchPromise: Promise<BrazilianCity[]> | null = null

const fetchAllCities = async (): Promise<BrazilianCity[]> => {
  if (cachedCities) return cachedCities

  if (fetchPromise) return fetchPromise

  fetchPromise = (async () => {
    try {
      const res = await fetch(
        "https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome"
      )

      if (!res.ok) throw new Error("Erro ao buscar cidades")

      const data: IBGEMunicipio[] = await res.json()

      cachedCities = data.map((m) => ({
        id: m.id,
        name: m.nome,
        state: m.microrregiao?.mesorregiao?.UF?.sigla ?? "",
      }))

      return cachedCities
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

export const searchCities = async (query: string): Promise<BrazilianCity[]> => {
  if (query.length < 3) return []

  const cities = await fetchAllCities()
  const normalized = normalize(query)

  return cities
    .filter((c) => normalize(c.name).startsWith(normalized))
    .slice(0, 20)
}
