import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'produtos',
    loadComponent: () => import('./pages/product-list/product-list.page').then((m) => m.ProductListPage),
  },
  {
    path: 'produtos/:gender',
    loadComponent: () => import('./pages/product-list/product-list.page').then((m) => m.ProductListPage),
  },
  {
    path: 'produtos/:gender/:category',
    loadComponent: () => import('./pages/product-list/product-list.page').then((m) => m.ProductListPage),
  },
  {
    path: 'produto/:slug',
    loadComponent: () => import('./pages/product-detail/product-detail.page').then((m) => m.ProductDetailPage),
  },
  {
    path: 'sacola',
    loadComponent: () => import('./pages/bag/bag.page').then((m) => m.BagPage),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
