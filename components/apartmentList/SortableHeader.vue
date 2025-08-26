<template>
  <div
    class="apartment-list__header-cell"
    role="columnheader"
    :aria-sort="getAriaSort()"
  >
    <div
      class="sortable-content sortable"
      :class="sortableContentClass"
      @click="store.updateSort(field)"
      role="button"
      tabindex="0"
      :aria-label="`Сортировать по ${title}`"
      @keydown.enter="store.updateSort(field)"
      @keydown.space.prevent="store.updateSort(field)"
    >
      {{ title }}
      <span class="wrapp_arrow" aria-hidden="true">
        <svg class="icon_arrow" :class="ascArrowClass">
          <use xlink:href="#icon_arrow" />
        </svg>
        <svg class="icon_arrow rotate" :class="descArrowClass">
          <use xlink:href="#icon_arrow" />
        </svg>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  field: 'footage' | 'floor' | 'price'
  title: string
}

const props = defineProps<Props>()
const store = useIndexStore()

const sortableContentClass = computed(() => ({
  active_sort: store.sortState.field === props.field,
}))

const ascArrowClass = computed(() => ({
  icon_arrow_active:
    store.sortState.field === props.field &&
    store.sortState.direction === 'asc',
}))

const descArrowClass = computed(() => ({
  icon_arrow_active:
    store.sortState.field === props.field &&
    store.sortState.direction === 'desc',
}))

const getAriaSort = (): 'none' | 'ascending' | 'descending' => {
  if (store.sortState.field === props.field) {
    return store.sortState.direction === 'asc' ? 'ascending' : 'descending'
  }
  return 'none'
}
</script>
