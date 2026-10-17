import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface SavedCartItem {
  productId: string;
  name: string;
  price: number;
  size: string | null;
  color: string | null;
}

export interface SavedCart {
  id: string;
  items: SavedCartItem[];
}

@Injectable({ providedIn: 'root' })
export class CartApiService {
  private readonly http = inject(HttpClient);

  create(items: SavedCartItem[]): Observable<SavedCart> {
    return this.http.post<SavedCart>(`${environment.apiUrl}/carts`, { items });
  }
}
