import apartmentsData from '../data/apartments.json'
import type {
  Apartment,
  ApartmentsRequest,
  ApartmentsResponse,
} from '../../types/apartments'
import {
  filterApartments,
  getApartmentsById,
  checkIfLastRecords,
  analyzeRoomsAvailability,
  autoSwitchRoomType,
} from '../../utils'

export default defineEventHandler(
  async (event): Promise<ApartmentsResponse> => {
    const body: ApartmentsRequest = await readBody(event)
    const { isInitial = false, lastId, filters } = body || {}

    const defaultFilters = {
      totalRooms: 2,
      price: [1000000, 50000000] as [number, number],
      footage: [20, 200] as [number, number],
    }

    const appliedFilters = filters || defaultFilters

    const sorted: Apartment[] = [...apartmentsData].sort(
      (a: Apartment, b: Apartment) => a.id - b.id
    )

    const roomsAvailability = analyzeRoomsAvailability(sorted, appliedFilters)

    let filtered: Apartment[] = filterApartments(sorted, appliedFilters)

    if (filtered.length === 0) {
      const updatedFilters = autoSwitchRoomType(
        appliedFilters,
        roomsAvailability
      )
      if (updatedFilters.totalRooms !== appliedFilters.totalRooms) {
        console.log(
          `Auto-switching from totalRooms: ${appliedFilters.totalRooms} to ${updatedFilters.totalRooms}`
        )
        appliedFilters.totalRooms = updatedFilters.totalRooms
        filtered = filterApartments(sorted, appliedFilters)
      }
    }

    let result: Apartment[]

    if (isInitial) {
      result = filtered.slice(0, 5)
    } else {
      result = getApartmentsById(filtered, lastId!)
    }

    const done = result.length === 0 || checkIfLastRecords(result, filtered)

    // await new Promise(resolve => setTimeout(resolve, 1500))

    return {
      result,
      done,
      roomsAvailability,
    }
  }
)
