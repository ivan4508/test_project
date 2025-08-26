<template>
  <div
    class="apartment-filter"
    role="region"
    aria-label="Фильтры для поиска квартир"
  >
    <div
      class="room-selection"
      role="group"
      aria-labelledby="room-selection-label"
    >
      <div id="room-selection-label" class="visually-hidden">
        Выбор количества комнат
      </div>
      <button
        v-for="room in rooms"
        :key="room"
        :class="['room-button', { active: selectedTotalRooms === room }]"
        @click="selectedTotalRooms = room"
        :disabled="
          store.isLoading ||
          !store.roomsAvailability.totalRooms[
            room as keyof typeof store.roomsAvailability.totalRooms
          ]
        "
        :aria-pressed="selectedTotalRooms === room"
        :aria-label="`${room} комната`"
      >
        {{ room }}к
      </button>
    </div>

    <FilterSection
      label="Стоимость квартиры, ₽"
      type="price"
      :range="priceRange"
      :min="priceMin"
      :max="priceMax"
      :format-value="formatPrice"
      :on-range-change="updatePriceRange"
      :disabled="store.isLoading"
    />

    <FilterSection
      label="Площадь, м²"
      type="footage"
      :range="footageRange"
      :min="footageMin"
      :max="footageMax"
      :on-range-change="updateFootageRange"
      :disabled="store.isLoading"
    />

    <button
      class="reset-button"
      @click="resetFilters"
      :disabled="store.isLoading"
      aria-label="Сбросить все фильтры"
    >
      Сбросить параметры
      <span class="reset-icon" aria-hidden="true">×</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import FilterSection from './FilterSection.vue'
import { formatPrice } from '~/utils'
import { useIndexStore } from '~/stores'

const store = useIndexStore()

const rooms: number[] = [1, 2, 3, 4]
const selectedTotalRooms = ref<number>(2)
const isInitialized = ref<boolean>(false)

const priceMin: number = 1000000
const priceMax: number = 50000000
const priceRange = ref<[number, number]>([...store.currentFilters.price])

const footageMin: number = 20
const footageMax: number = 200
const footageRange = ref<[number, number]>([...store.currentFilters.footage])

onMounted(async () => {
  const storeTotalRooms = store.currentFilters.totalRooms
  if (
    rooms.includes(storeTotalRooms) &&
    store.roomsAvailability.totalRooms[
      storeTotalRooms as keyof typeof store.roomsAvailability.totalRooms
    ]
  ) {
    selectedTotalRooms.value = storeTotalRooms
  } else {
    const availableRoom =
      rooms.find(
        room =>
          store.roomsAvailability.totalRooms[
            room as keyof typeof store.roomsAvailability.totalRooms
          ]
      ) || 2
    selectedTotalRooms.value = availableRoom
    store.currentFilters.totalRooms = availableRoom
  }

  priceRange.value = [...store.currentFilters.price]
  footageRange.value = [...store.currentFilters.footage]

  await nextTick()
  if (store.apartmentsAll.length === 0) {
    updateStore()
  }
  isInitialized.value = true
})

onUnmounted(() => {
  if (updateStoreTimeout) {
    clearTimeout(updateStoreTimeout)
  }
})

const updatePriceRange = (newRange: [number, number]): void => {
  priceRange.value = newRange
  updateStore()
}

const updateFootageRange = (newRange: [number, number]): void => {
  footageRange.value = newRange
  updateStore()
}

const resetFilters = (): void => {
  selectedTotalRooms.value = 2
  priceRange.value = [priceMin, priceMax]
  footageRange.value = [footageMin, footageMax]
  updateStore()
}

let updateStoreTimeout: NodeJS.Timeout | null = null

const updateStore = async (): Promise<void> => {
  if (store.isLoading) return

  if (updateStoreTimeout) {
    clearTimeout(updateStoreTimeout)
  }

  updateStoreTimeout = setTimeout(async () => {
    if (store.isLoading) return

    const filters = {
      totalRooms: selectedTotalRooms.value,
      price: priceRange.value,
      footage: footageRange.value,
    }

    await store.updateFilters(filters)

    const newRoomsAvailability = store.roomsAvailability.totalRooms
    if (
      !newRoomsAvailability[
        selectedTotalRooms.value as keyof typeof newRoomsAvailability
      ]
    ) {
      const availableRoom = rooms.find(
        room => newRoomsAvailability[room as keyof typeof newRoomsAvailability]
      )
      if (availableRoom && availableRoom !== selectedTotalRooms.value) {
        selectedTotalRooms.value = availableRoom
        await store.updateFilters({
          ...filters,
          totalRooms: availableRoom,
        })
      }
    }
  }, 300)
}

watch(
  [selectedTotalRooms, priceRange, footageRange],
  () => {
    if (isInitialized.value) {
      updateStore()
    }
  },
  { deep: true }
)

watch(
  () => store.roomsAvailability.totalRooms,
  newRoomsAvailability => {
    if (
      isInitialized.value &&
      !newRoomsAvailability[
        selectedTotalRooms.value as keyof typeof newRoomsAvailability
      ]
    ) {
      const availableRoom = rooms.find(
        room => newRoomsAvailability[room as keyof typeof newRoomsAvailability]
      )
      if (availableRoom) {
        selectedTotalRooms.value = availableRoom
      }
    }
  },
  { deep: true }
)
</script>
