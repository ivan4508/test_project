<template>
  <div
    class="apartment-item"
    role="row"
    :aria-label="`Квартира ${title}, ${footage} м², ${floor} этаж`"
  >
    <div class="apartment-item__floor-plan" role="cell">
      <img
        :src="`/img/${urlRoomsPlan}`"
        :alt="`Планировка ${totalRooms}-комнатной квартиры`"
      />
    </div>
    <div class="apartment-item__info" role="cell">
      <span class="apartment-item__type">{{ title }}</span>
    </div>
    <div class="apartment-item__footage" role="cell">{{ footage }} м²</div>
    <div class="apartment-item__floor" role="cell">
      <span
        >{{ floor }}
        <span class="light">
          из {{ totalFloor }} <span class="mobile-visible">этаж</span></span
        ></span
      >
    </div>
    <div class="apartment-item__price" role="cell">
      <span
        >{{ formatPrice(price) }} <span class="mobile-visible">₽</span></span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatPrice } from '~/utils'

interface Props {
  totalRooms: number
  urlRoomsPlan: string
  title: string
  floor: number
  price: number
  totalFloor: number
  footage: number
}

defineProps<Props>()
</script>
