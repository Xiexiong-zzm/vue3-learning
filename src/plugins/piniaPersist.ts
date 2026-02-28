import type { PiniaPluginContext } from 'pinia'
import type { PersistOptions } from '@/types/persist'
import { localStrategy } from './storageStrategies'

function safeParse(value: string): unknown | null {
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

export function createPersistPlugin() {
  return ({ options, store }: PiniaPluginContext) => {
    const persist = options.persist as PersistOptions<typeof store.$state> | undefined

    if (!persist) return

    const key = persist.key ?? store.$id
    const version = persist.version ?? 1
    const storage = persist.storage ?? localStrategy

    // ====== 读取缓存 ======
    const raw = storage.getItem(key)

    if (raw) {
      const parsed = safeParse(raw) as
        | {
            version: number
            data: typeof store.$state
          }
        | null

      if (parsed && parsed.version === version) {
        store.$patch(parsed.data)
      } else if (parsed && parsed.version !== version) {
        storage.removeItem(key)
      }
    }

    // ====== 订阅状态变化 ======
    store.$subscribe((_, state) => {
      let dataToStore: Partial<typeof state> = state

      if (persist.paths?.length) {
        dataToStore = persist.paths.reduce((acc, path) => {
          acc[path] = state[path]
          return acc
        }, {} as Partial<typeof state>)
      }

      storage.setItem(
        key,
        JSON.stringify({
          version,
          data: dataToStore
        })
      )
    })
  }
}