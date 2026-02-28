import type { StorageLike } from "@/types/storage"
export interface PersistOptions<S> {
  key?: string,
  paths?: (keyof S)[],
  storage?: StorageLike,
  version?:number,
}