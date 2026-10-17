import { Injectable, computed, signal } from '@angular/core';

export interface BagItem {
  id: string;
  productId: string;
  slug: string;
  name: string;
  price: number;
  size: string | null;
  color: string | null;
  imageUrl: string;
}

const storageKey = 'sempre-viva.sacola';

@Injectable({ providedIn: 'root' })
export class BagService {
  private readonly itemsState = signal<BagItem[]>(this.read());
  readonly items = this.itemsState.asReadonly();
  readonly count = computed(() => this.itemsState().length);

  add(item: Omit<BagItem, 'id'>): void {
    const current = this.itemsState();
    const existing = current.find(
      (entry) => entry.productId === item.productId && entry.size === item.size && entry.color === item.color,
    );
    if (existing) {
      return;
    }
    this.write([...current, { ...item, id: crypto.randomUUID() }]);
  }

  has(productId: string, size: string | null, color: string | null): boolean {
    return this.itemsState().some(
      (entry) => entry.productId === productId && entry.size === size && entry.color === color,
    );
  }

  remove(id: string): void {
    this.write(this.itemsState().filter((entry) => entry.id !== id));
  }

  private read(): BagItem[] {
    try {
      const raw = localStorage.getItem(storageKey);
      const parsed = raw ? (JSON.parse(raw) as BagItem[]) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private write(items: BagItem[]): void {
    this.itemsState.set(items);
    localStorage.setItem(storageKey, JSON.stringify(items));
  }
}
