import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type {
  Apartment,
  ApartmentsRequest,
  ApartmentsResponse,
  FilterData,
  SortState,
  RoomsAvailability,
} from '../types/apartments'

export const useIndexStore = defineStore(
  'index',
  () => {
    const apartmentsAll = ref<Apartment[]>([])
    const isDone = ref<boolean>(false)
    const isLoading = ref<boolean>(false)
    const roomsAvailability = ref<RoomsAvailability>({
      totalRooms: { 1: false, 2: false, 3: false, 4: false },
      price: { min: 0, max: 0 },
      footage: { min: 0, max: 0 },
    })
    const currentFilters = ref<FilterData>({
      totalRooms: 2,
      price: [1000000, 50000000],
      footage: [20, 200],
    })

    const validateFilters = (filters: FilterData): FilterData => {
      const validRooms = [1, 2, 3, 4]
      if (!validRooms.includes(filters.totalRooms)) {
        filters.totalRooms = 2
      }

      if (
        !roomsAvailability.value.totalRooms[
          filters.totalRooms as keyof typeof roomsAvailability.value.totalRooms
        ]
      ) {
        filters.totalRooms = 2
      }

      return filters
    }
    const sortState = ref<SortState>({
      field: null,
      direction: 'desc',
    })

    const sortedApartments = computed(() => {
      const { field, direction } = sortState.value
      if (!field || !apartmentsAll.value.length) return apartmentsAll.value

      const sortMap = {
        footage: (a: Apartment) => a.footage,
        floor: (a: Apartment) => a.floor,
        price: (a: Apartment) => a.price,
      } as const

      const getValue = sortMap[field]
      if (!getValue) return apartmentsAll.value

      return [...apartmentsAll.value].sort((a: Apartment, b: Apartment) => {
        const aValue = getValue(a)
        const bValue = getValue(b)
        return direction === 'asc' ? aValue - bValue : bValue - aValue
      })
    })

    const updateSort = (field: 'footage' | 'floor' | 'price'): void => {
      if (!sortState.value) {
        sortState.value = {
          field: field,
          direction: 'desc',
        }
        return
      }

      if (sortState.value.field === field) {
        sortState.value.direction =
          sortState.value.direction === 'asc' ? 'desc' : 'asc'
      } else {
        sortState.value.field = field
        sortState.value.direction = 'desc'
      }
    }

    const fetchApartments = async (
      params: ApartmentsRequest = {}
    ): Promise<void> => {
      isLoading.value = true
      try {
        const { isInitial = false, lastId = null } = params
        const {
          result,
          done,
          roomsAvailability: newRoomsAvailability,
        } = await $fetch('/api/apartments', {
          method: 'POST',
          body: { isInitial, lastId, filters: currentFilters.value },
        })
        apartmentsAll.value.push(...result)
        isDone.value = done
        roomsAvailability.value = newRoomsAvailability
      } finally {
        isLoading.value = false
      }
    }

    const setInitialData = (data: ApartmentsResponse): void => {
      if (data?.result?.length) {
        apartmentsAll.value = data.result
        isDone.value = data.done
      }
      if (data?.roomsAvailability) {
        roomsAvailability.value = data.roomsAvailability
      }
    }

    const updateFilters = async (filters: FilterData): Promise<void> => {
      const validatedFilters = validateFilters(filters)
      currentFilters.value = validatedFilters
      apartmentsAll.value = []
      isDone.value = false
      await fetchApartments()
    }

    watch(
      currentFilters,
      newFilters => {
        const validatedFilters = validateFilters(newFilters)
        if (validatedFilters.totalRooms !== newFilters.totalRooms) {
          currentFilters.value = validatedFilters
        }
      },
      { deep: true }
    )

    return {
      apartmentsAll,
      sortedApartments,
      fetchApartments,
      isDone,
      isLoading,
      setInitialData,
      currentFilters,
      updateFilters,
      sortState,
      updateSort,
      roomsAvailability,
    }
  },
  {
    persist: {
      storage: import.meta.client ? sessionStorage : undefined,
      pick: [
        'apartmentsAll',
        'isDone',
        'currentFilters',
        'sortState',
        'roomsAvailability',
      ],
    },
  }
)
