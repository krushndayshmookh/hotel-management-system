
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // { path: '', redirect: '/overview' },
      { path: 'overview', component: () => import('pages/Overview.vue') },
      // { path: 'statistics', component: () => import('pages/Statistics.vue') },
      { path: 'hotels', component: () => import('pages/Hotels.vue') },
      { path: 'hotels/:hotelid', component: () => import('pages/Hotel.vue'), props: true },
      { path: 'login', component: () => import('pages/Login.vue') },
      // { path: 'test', component: () => import('pages/Test.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
