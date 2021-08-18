export default [
  {
    path: '/',
    redirect: 'home',
  },
  {
    path: '/home',
    component: () => import('src/pages/home'),
    title: '首页',
  },
];
