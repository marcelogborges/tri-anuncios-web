import { openDB } from "idb"

const DB_NAME = "tri-anuncios"
const DB_VERSION = 1
const STORE_NAME = "ad-images"

export const MAX_CAROUSEL_CARDS = 10

export type AdImageSlot = "feed" | "story" | "video" | "thumb" | `carousel-${number}`

export const carouselSlot = (index: number): AdImageSlot => `carousel-${index}`

const getDb = async () => {
  if (typeof window === "undefined" || typeof indexedDB === "undefined") return null

  return openDB(DB_NAME, DB_VERSION, {
    upgrade: (db) => {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    },
  })
}

export const saveAdImageFile = async (slot: AdImageSlot, file: File | null): Promise<void> => {
  try {
    const db = await getDb()

    if (!db) return

    if (file) {
      await db.put(STORE_NAME, file, slot)
    } else {
      await db.delete(STORE_NAME, slot)
    }
  } catch {
    // storage unavailable — ignore
  }
}

export const loadAdImageFile = async (slot: AdImageSlot): Promise<File | null> => {
  try {
    const db = await getDb()

    if (!db) return null

    return (await db.get(STORE_NAME, slot)) ?? null
  } catch {
    return null
  }
}

export const loadAdImageFiles = async (): Promise<{ feed: File | null; story: File | null }> => {
  const [feed, story] = await Promise.all([loadAdImageFile("feed"), loadAdImageFile("story")])
  return { feed, story }
}

export const loadAdVideoFiles = async (): Promise<{ video: File | null; thumb: File | null }> => {
  const [video, thumb] = await Promise.all([loadAdImageFile("video"), loadAdImageFile("thumb")])
  return { video, thumb }
}

export const loadCarouselFiles = async (count: number): Promise<Array<File | null>> => {
  const safeCount = Math.min(count, MAX_CAROUSEL_CARDS)
  return Promise.all(Array.from({ length: safeCount }, (_, i) => loadAdImageFile(carouselSlot(i))))
}

export const clearCarouselFiles = async (): Promise<void> => {
  await Promise.all(Array.from({ length: MAX_CAROUSEL_CARDS }, (_, i) => saveAdImageFile(carouselSlot(i), null)))
}

export const clearAdImageFiles = async (): Promise<void> => {
  try {
    const db = await getDb()

    if (!db) return

    await db.clear(STORE_NAME)
  } catch {
    // storage unavailable — ignore
  }
}
