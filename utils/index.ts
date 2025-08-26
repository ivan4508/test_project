import type {
  Apartment,
  FilterData,
  RoomsAvailability,
} from '~/types/apartments'

export const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export const analyzeRoomsAvailability = (
  apartments: Apartment[],
  filters: FilterData
): RoomsAvailability => {
  if (!apartments.length) {
    return {
      totalRooms: { 1: false, 2: false, 3: false, 4: false },
      price: { min: filters.price[0], max: filters.price[1] },
      footage: { min: filters.footage[0], max: filters.footage[1] },
    }
  }

  const priceAndFootageFiltered = apartments.filter((apartment: Apartment) => {
    const priceMatch =
      apartment.price >= filters.price[0] && apartment.price <= filters.price[1]
    const footageMatch =
      apartment.footage >= filters.footage[0] &&
      apartment.footage <= filters.footage[1]

    return priceMatch && footageMatch
  })

  if (!priceAndFootageFiltered.length) {
    return {
      totalRooms: { 1: false, 2: false, 3: false, 4: false },
      price: { min: filters.price[0], max: filters.price[1] },
      footage: { min: filters.footage[0], max: filters.footage[1] },
    }
  }

  const totalRoomsCounts = priceAndFootageFiltered.reduce(
    (acc, apt) => {
      acc[apt.totalRooms as keyof typeof acc] = true
      return acc
    },
    { 1: false, 2: false, 3: false, 4: false }
  )

  return {
    totalRooms: totalRoomsCounts,
    price: {
      min: filters.price[0],
      max: filters.price[1],
    },
    footage: {
      min: filters.footage[0],
      max: filters.footage[1],
    },
  }
}

export const filterApartments = (
  apartments: Apartment[],
  filters: FilterData
): Apartment[] => {
  return apartments.filter((apartment: Apartment) => {
    const roomsMatch = apartment.totalRooms === filters.totalRooms
    const priceMatch =
      apartment.price >= filters.price[0] && apartment.price <= filters.price[1]
    const footageMatch =
      apartment.footage >= filters.footage[0] &&
      apartment.footage <= filters.footage[1]

    return roomsMatch && priceMatch && footageMatch
  })
}

export const getApartmentsById = (
  filteredData: Apartment[],
  lastId: number
): Apartment[] => {
  const idx = filteredData.findIndex((item: Apartment) => item.id === lastId)
  const start = idx + 1
  return filteredData.slice(start, start + 20)
}

export const checkIfLastRecords = (
  result: Apartment[],
  filteredData: Apartment[]
): boolean => {
  if (!result.length || !filteredData.length) {
    return true
  }

  const lastElementId = filteredData.at(-1)?.id
  return result.some((item: Apartment) => item.id === lastElementId)
}

export const autoSwitchRoomType = (
  filters: FilterData,
  roomsAvailability: RoomsAvailability
): FilterData => {
  if (
    roomsAvailability.totalRooms[
      filters.totalRooms as keyof typeof roomsAvailability.totalRooms
    ]
  ) {
    return filters
  }

  const availableRoomType = [1, 2, 3, 4].find(
    room =>
      roomsAvailability.totalRooms[
        room as keyof typeof roomsAvailability.totalRooms
      ]
  )

  if (availableRoomType) {
    return {
      ...filters,
      totalRooms: availableRoomType,
    }
  }

  return filters
}
