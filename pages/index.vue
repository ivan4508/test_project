<template>
  <div class="apartments-page" role="main" aria-label="Страница квартир">
    <SvgSprite />
    <h1 class="label" aria-level="1">Квартиры</h1>
    <ApartmentList />
    <ClientOnly>
      <ApartmentFilter />
    </ClientOnly>
    <ScrollToTop />
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Квартиры - Поиск и фильтрация недвижимости',
  ogTitle: 'Квартиры - Поиск и фильтрация недвижимости',
  description:
    'Найдите подходящую квартиру с помощью удобных фильтров по цене, площади и этажу. Просматривайте список квартир с возможностью сортировки.',
  ogDescription:
    'Найдите подходящую квартиру с помощью удобных фильтров по цене, площади и этажу. Просматривайте список квартир с возможностью сортировки.',
  ogType: 'website',
  ogImage: '/img/test.png',
})
</script>
