<template>
  <div
    class="filter-section"
    role="group"
    :aria-labelledby="`${type}-filter-label`"
  >
    <label class="filter-label" :id="`${type}-filter-label`">{{ label }}</label>
    <div class="range-display" aria-live="polite" aria-atomic="true">
      <span class="range-value"
        ><span class="light">от</span>&nbsp;
        <span
          :class="`${type}-value-min`"
          :aria-label="`Минимальное значение ${label}`"
        >
          {{ props.formatValue(localRange[0]) }}
        </span>
      </span>
      <span class="range-value"
        ><span class="light">до</span>&nbsp;
        <span
          :class="`${type}-value-max`"
          :aria-label="`Максимальное значение ${label}`"
        >
          {{ props.formatValue(localRange[1]) }}
        </span>
      </span>
    </div>
    <div
      class="range-slider"
      :style="sliderStyle"
      role="group"
      :aria-label="`Настройка диапазона для ${label}`"
    >
      <input
        v-model.number="localRange[0]"
        type="range"
        :min="min"
        :max="max"
        class="slider-input"
        :disabled="props.disabled"
        @input="handleLeftSlider"
        :aria-label="`Минимальное значение ${label}`"
        :aria-valuenow="localRange[0]"
      />
      <input
        v-model.number="localRange[1]"
        type="range"
        :min="min"
        :max="max"
        class="slider-input"
        :disabled="props.disabled"
        @input="handleRightSlider"
        :aria-label="`Максимальное значение ${label}`"
        :aria-valuenow="localRange[1]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

interface Props {
  label: string
  type: 'price' | 'footage'
  range: [number, number]
  min: number
  max: number
  formatValue?: (value: number) => string | number
  onRangeChange: (range: [number, number]) => void
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  formatValue: (value: number): number => value,
  disabled: false,
})

const localRange = ref<[number, number]>([...props.range])

const sliderStyle = computed((): Record<string, string> => {
  const leftPercent = Math.max(
    0,
    ((localRange.value[0] - props.min) / (props.max - props.min)) * 100
  )
  const rightPercent = Math.min(
    100,
    ((localRange.value[1] - props.min) / (props.max - props.min)) * 100
  )

  return {
    '--left-pos': `${leftPercent}%`,
    '--right-pos': `${rightPercent}%`,
    '--slider-color': props.disabled ? '#a4a7a4' : '#66bb6a',
  }
})

const handleLeftSlider = (): void => {
  const minGap = (props.max - props.min) * 0.05
  if (localRange.value[0] > localRange.value[1] - minGap) {
    localRange.value[0] = localRange.value[1] - minGap
  }
  handleInput()
}

const handleRightSlider = (): void => {
  const minGap = (props.max - props.min) * 0.05
  if (localRange.value[1] < localRange.value[0] + minGap) {
    localRange.value[1] = localRange.value[0] + minGap
  }
  handleInput()
}

const handleInput = (): void => {
  const minGap = (props.max - props.min) * 0.05

  if (localRange.value[0] > localRange.value[1] - minGap) {
    localRange.value[0] = localRange.value[1] - minGap
  }

  props.onRangeChange([...localRange.value])
}

onMounted(() => {
  localRange.value = [...props.range]
})

watch(
  () => props.range,
  newRange => {
    localRange.value = [...newRange]
  },
  { deep: true }
)
</script>
