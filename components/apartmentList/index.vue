<template>
  <div class="apartment-list" role="table" aria-label="Список квартир">
    <div class="apartment-list__header" role="row">
      <div
        class="apartment-list__header-cell hidden-mobile"
        role="columnheader"
      >
        Планировка
      </div>
      <div
        class="apartment-list__header-cell hidden-mobile"
        role="columnheader"
      >
        Квартира
      </div>
      <ClientOnly>
        <SortableHeader field="footage" title="S, м²" key="footage" />
        <SortableHeader field="floor" title="Этаж" key="floor" />
        <SortableHeader field="price" title="Цена, ₽" key="price" />
      </ClientOnly>
    </div>

    <div class="apartment-list__body" role="rowgroup">
      <ClientOnly>
        <ApartmentListApartmentItem
          v-for="apartment in store.sortedApartments"
          :key="`${apartment.id} ${apartment.title} ${apartment.floor}`"
          v-bind="apartment"
        />
      </ClientOnly>
    </div>

    <div class="apartment-list__footer" role="row">
      <ClientOnly>
        <button
          v-if="!store.isDone"
          class="apartment-list__load-more"
          :disabled="isLoading"
          @click="loadMoreApartments"
          aria-label="Загрузить еще 20 квартир"
          aria-busy="false"
        >
          {{ isLoading ? 'Загрузка...' : 'Загрузить еще 20' }}
        </button>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SortableHeader from './SortableHeader.vue'

const store = useIndexStore()

const isLoading = ref<boolean>(false)
const loadMoreApartments = async (): Promise<void> => {
  if (isLoading.value) return
  isLoading.value = true
  await store.fetchApartments({
    lastId: store.apartmentsAll.at(-1)?.id || null,
  })
  isLoading.value = false
}
</script>
