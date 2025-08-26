<template>
  <button
    class="icon_arrow_up scroll-to-top"
    v-show="isVisible"
    type="button"
    aria-label="Прокрутить вверх"
    @click="scrollToTop"
    :aria-hidden="!isVisible"
  >
    <img
      src="/assets/img/svg/icon_arrow_up.svg"
      alt="Стрелка вверх"
      aria-hidden="false"
    />
  </button>
</template>

<script setup lang="ts">
const isVisible = ref<boolean>(false)

const checkScrollPosition = (): void => {
  const scrollHeight: number = document.documentElement.scrollHeight
  const clientHeight: number = document.documentElement.clientHeight
  const scrollTop: number = window.scrollY

  isVisible.value = scrollHeight > clientHeight && scrollTop > 0
}

const scrollToTop = (): void => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

onMounted((): void => {
  window.addEventListener('scroll', checkScrollPosition)
})

onUnmounted((): void => {
  window.removeEventListener('scroll', checkScrollPosition)
})
</script>
<style lang="scss" scoped>
.scroll-to-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  border: none;
  outline: none;
  background: none;
  cursor: pointer;

  svg {
    width: 40px;
    height: 40px;
  }
}
</style>
