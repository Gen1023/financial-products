import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home').then(m => m.Home)
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/product-list').then(m => m.ProductList)
  },
  {
    path: 'products/create',
    loadComponent: () => import('./pages/product-form').then(m => m.ProductForm)
  },
  {
    path: 'products/edit/:id',
    loadComponent: () => import('./pages/product-edit').then(m => m.ProductEdit)
  }
];
