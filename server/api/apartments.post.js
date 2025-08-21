export default defineEventHandler((event) => {
  const apartments = [
    {
      id: 1,
      url: '/test.png',
      квартира: '1-комнатная',
      метраж: 45,
      этаж: 5,
      цена: 2500000
    },
    {
      id: 2,
      url: '/test.png',
      квартира: '2-комнатная',
      метраж: 65,
      этаж: 8,
      цена: 3800000
    },
    {
      id: 3,
      url: '/test.png',
      квартира: '3-комнатная',
      метраж: 85,
      этаж: 12,
      цена: 5200000
    },
    {
      id: 4,
      url: '/test.png',
      квартира: 'Студия',
      метраж: 30,
      этаж: 3,
      цена: 1800000
    }
  ];

  return apartments;
})
