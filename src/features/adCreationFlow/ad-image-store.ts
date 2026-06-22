import { openDB } from "idb"

const DB_NAME = "tri-anuncios"
const DB_VERSION = 1
const STORE_NAME = "ad-images"

export type AdImageSlot = "feed" | "story"

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

export const loadAdImageFiles = async (): Promise<{ feed: File | null; story: File | null }> => {
  try {
    const db = await getDb()

    if (!db) return { feed: null, story: null }

    const feed = (await db.get(STORE_NAME, "feed")) ?? null
    const story = (await db.get(STORE_NAME, "story")) ?? null

    return { feed, story }
  } catch {
    return { feed: null, story: null }
  }
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
