import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Banner, Category, Product, ProductQuery } from '../models/catalog.models';

/**
 * Contrato da fonte de dados do catálogo público.
 */
@Injectable()
export abstract class CatalogSource {
  abstract getCategories(): Observable<Category[]>;
  abstract getProducts(query?: ProductQuery): Observable<Product[]>;
  abstract getProductBySlug(slug: string): Observable<Product | null>;
  abstract getBanners(): Observable<Banner[]>;
}
