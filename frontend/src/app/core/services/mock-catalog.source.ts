import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { DEMO_CATEGORIES, DEMO_PRODUCTS } from '../data/demo-catalog';
import { defaultSiteContent, SiteContent } from '../models/site-content';
import { Banner, Category, Product, ProductQuery } from '../models/catalog.models';
import { CatalogSource } from './catalog-source';

@Injectable()
export class MockCatalogSource extends CatalogSource {
  getCategories(): Observable<Category[]> {
    const categories = DEMO_CATEGORIES.filter((category) => category.status === 'active');
    return of(categories).pipe(delay(120));
  }

  getProducts(query: ProductQuery = {}): Observable<Product[]> {
    const term = normalize(query.search ?? '');
    const products = DEMO_PRODUCTS.filter((product) => {
      const category = DEMO_CATEGORIES.find((item) => item.id === product.categoryId);
      if (!category || category.status !== 'active') {
        return false;
      }
      if (query.gender && product.gender !== query.gender) {
        return false;
      }
      if (query.categorySlug && (category.slug !== query.categorySlug || category.gender !== product.gender)) {
        return false;
      }
      if (query.categorySlug && query.gender && category.gender !== query.gender) {
        return false;
      }
      if (query.available !== undefined && product.available !== query.available) {
        return false;
      }
      if (query.minPrice != null && product.price < query.minPrice) {
        return false;
      }
      if (query.maxPrice != null && product.price > query.maxPrice) {
        return false;
      }
      if (term) {
        const haystack = normalize(`${product.name} ${product.description}`);
        if (!haystack.includes(term)) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0) || b.createdAt.localeCompare(a.createdAt));

    return of(products).pipe(delay(120));
  }

  getProductBySlug(slug: string): Observable<Product | null> {
    const product = DEMO_PRODUCTS.find((item) => item.slug === slug) ?? null;
    const category = product
      ? DEMO_CATEGORIES.find((item) => item.id === product.categoryId)
      : undefined;
    const visible = product && category?.status === 'active' ? product : null;
    return of(visible).pipe(delay(120));
  }

  getBanners(): Observable<Banner[]> {
    return of([]).pipe(delay(120));
  }

  getSite(): Observable<SiteContent> {
    return of(defaultSiteContent()).pipe(delay(120));
  }
}

function normalize(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase('pt-BR')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}
