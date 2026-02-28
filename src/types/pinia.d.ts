import 'pinia'
import type { PersistOptions } from '@/types/persist'

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S, Store> {
    persist?: PersistOptions<S>
  }
}