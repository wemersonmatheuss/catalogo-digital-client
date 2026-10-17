import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Banner, CatalogSnapshot, Category, Product, ProductQuery } from '../models/catalog.models';
import { CatalogSource } from './catalog-source';

@Injectable()
export class HttpCatalogSource extends CatalogSource {
  private readonly http = inject(HttpClient);

  getCategories(): Observable<Category[]> {
    return this.catalog().pipe(
      map((data) => data.categories.filter((category) => category.status === 'active')),
    );
  }

  getProducts(query: ProductQuery = {}): Observable<Product[]> {
    const term = normalize(query.search ?? '');
    return this.catalog().pipe(
      map((data) =>
        data.products
          .filter((product) => matches(product, data.categories, query, term))
          .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0) || b.createdAt.localeCompare(a.createdAt)),
      ),
    );
  }

  getProductBySlug(slug: string): Observable<Product | null> {
    return this.catalog().pipe(
      map((data) => {
        const product = data.products.find((item) => item.slug === slug) ?? null;
        const category = product ? data.categories.find((item) => item.id === product.categoryId) : undefined;
        return product && category?.status === 'active' ? product : null;
      }),
    );
  }

  getBanners(): Observable<Banner[]> {
    return this.catalog().pipe(
      map((data) =>
        data.banners
          .filter((banner) => banner.active)
          .sort((a, b) => a.displayOrder - b.displayOrder),
      ),
    );
  }

  private catalog(): Observable<CatalogSnapshot> {
    return this.http.get<CatalogSnapshot>(`${environment.apiUrl}/catalog`);
  }
}

function matches(product: Product, categories: Category[], query: ProductQuery, term: string): boolean {
  const category = categories.find((item) => item.id === product.categoryId);
  if (!category || category.status !== 'active') {
    return false;
  }
  if (query.gender && product.gender !== query.gender) {
    return false;
  }
  if (query.categorySlug && category.slug !== query.categorySlug) {
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
  if (term && !normalize(`${product.name} ${product.description}`).includes(term)) {
    return false;
  }
  return true;
}

function normalize(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase('pt-BR')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}
