import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { Category, Gender, Product, ProductQuery, Banner } from '../models/catalog.models';
import { SiteContent } from '../models/site-content';
import { CatalogSource } from './catalog-source';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly source = inject(CatalogSource);

  getCategories(gender?: Gender): Observable<Category[]> {
    return this.source.getCategories().pipe(
      map((categories) => (gender ? categories.filter((category) => category.gender === gender) : categories)),
    );
  }

  getProducts(query?: ProductQuery): Observable<Product[]> {
    return this.source.getProducts(query);
  }

  getFeatured(): Observable<Product[]> {
    return this.source.getProducts().pipe(map((products) => products.filter((product) => product.featured)));
  }

  getRecent(limit = 4): Observable<Product[]> {
    return this.source.getProducts().pipe(
      map((products) =>
        [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit),
      ),
    );
  }

  getProductBySlug(slug: string): Observable<Product | null> {
    return this.source.getProductBySlug(slug);
  }

  getBanners(): Observable<Banner[]> {
    return this.source.getBanners();
  }

  getSite(): Observable<SiteContent> {
    return this.source.getSite();
  }

  getCategory(gender: Gender, slug: string): Observable<Category | null> {
    return this.getCategories(gender).pipe(
      map((categories) => categories.find((category) => category.slug === slug) ?? null),
    );
  }
}
