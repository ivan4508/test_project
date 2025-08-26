export interface Apartment {
  id: number
  urlRoomsPlan: string
  title: string
  totalRooms: number
  footage: number
  floor: number
  totalFloor: number
  price: number
}

export interface FilterData {
  totalRooms: number
  price: [number, number]
  footage: [number, number]
}

export interface RoomsAvailability {
  totalRooms: {
    1: boolean
    2: boolean
    3: boolean
    4: boolean
  }
  price: {
    min: number
    max: number
  }
  footage: {
    min: number
    max: number
  }
}

export interface SortState {
  field: 'footage' | 'floor' | 'price' | null
  direction: 'asc' | 'desc'
}

export interface ApartmentsRequest {
  isInitial?: boolean
  lastId?: number | null
  filters?: FilterData
}

export interface ApartmentsResponse {
  result: Apartment[]
  done: boolean
  roomsAvailability: RoomsAvailability
}
