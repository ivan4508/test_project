import { createPersistedState } from 'pinia-plugin-persistedstate'
import type { Pinia } from 'pinia'

export default defineNuxtPlugin(nuxtApp => {
  if (import.meta.client) {
    const pinia = nuxtApp.$pinia as Pinia
    pinia.use(createPersistedState())
  }
})
