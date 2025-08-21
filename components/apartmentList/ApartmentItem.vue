<template>
  <div class="apartment-item">
    <div class="floor-plan">
      <img :src="apartment.floorPlan" :alt="`Планировка ${apartment.number}`">
    </div>
    <div class="apartment-info">
      <span class="apartment-type">{{ apartment.type }} №{{ apartment.number }}</span>
    </div>
    <div class="area">
      <span>{{ apartment.area }}</span>
    </div>
    <div class="floor">
      <span>{{ apartment.floor }} из {{ apartment.totalFloors }}</span>
    </div>
    <div class="price">
      <span>{{ formatPrice(apartment.price) }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  apartment: {
    type: Object,
    required: true,
    default: () => ({
      floorPlan: '',
      type: '',
      number: '',
      area: '',
      floor: '',
      totalFloors: '',
      price: 0
    })
  }
})

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}
</script>
