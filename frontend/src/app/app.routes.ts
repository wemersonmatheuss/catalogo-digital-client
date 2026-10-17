import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'produtos',
    loadComponent: () => import('./features/catalog/product-list.page').then((m) => m.ProductListPage),
  },
  {
    path: 'produtos/:gender',
    loadComponent: () => import('./features/catalog/product-list.page').then((m) => m.ProductListPage),
  },
  {
    path: 'produtos/:gender/:category',
    loadComponent: () => import('./features/catalog/product-list.page').then((m) => m.ProductListPage),
  },
  {
    path: 'produto/:slug',
    loadComponent: () => import('./features/product/product-detail.page').then((m) => m.ProductDetailPage),
  },
  {
    path: 'sacola',
    loadComponent: () => import('./features/bag/bag.page').then((m) => m.BagPage),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
