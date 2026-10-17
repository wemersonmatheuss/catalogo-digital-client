import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { combineLatest, of } from 'rxjs';
import { catchError, map, startWith, switchMap, tap } from 'rxjs/operators';

import { Category, Product } from '../../core/models/catalog.models';
import { GENDER_LABEL, genderPath } from '../../core/models/catalog.labels';
import { CatalogService } from '../../core/services/catalog.service';
import { BagService } from '../../core/services/bag.service';
import { SeoService } from '../../core/services/seo.service';
import { flyProductToCart } from '../../core/utils/fly-to-cart';
import { ErrorStateComponent } from '../../shared/error-state/error-state.component';
import { LoadingStateComponent } from '../../shared/loading-state/loading-state.component';
import { ProductGalleryComponent } from '../../shared/product-gallery/product-gallery.component';
import { ProductGridComponent } from '../../shared/product-grid/product-grid.component';
import { WhatsappButtonComponent } from '../../shared/whatsapp-button/whatsapp-button.component';
import { BrlPipe } from '../../shared/brl.pipe';
import { IonIcon } from '@ionic/angular';

interface DetailState {
  status: 'loading' | 'ready' | 'error';
  product: Product | null;
  category: Category | null;
  categories: Category[];
  related: Product[];
  next: Product | null;
}

const empty: DetailState = {
  status: 'loading',
  product: null,
  category: null,
  categories: [],
  related: [],
  next: null,
};

@Component({
  selector: 'app-product-detail-page',
  imports: [
    RouterLink,
    ProductGalleryComponent,
    ProductGridComponent,
    WhatsappButtonComponent,
    LoadingStateComponent,
    ErrorStateComponent,
    BrlPipe,
    IonIcon,
  ],
  templateUrl: './product-detail.page.html',
  styleUrl: './product-detail.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly catalog = inject(CatalogService);
  private readonly bag = inject(BagService);
  private readonly seo = inject(SeoService);

  readonly labels = GENDER_LABEL;
  readonly pickedSize = signal<string | null>(null);
  readonly pickedColor = signal<string | null>(null);
  readonly state = toSignal(
    this.route.paramMap.pipe(
      switchMap((params) =>
        this.catalog.getProductBySlug(params.get('slug') ?? '').pipe(
          switchMap((product) => {
            if (!product) {
              this.seo.set('Peça não encontrada', 'Essa peça não está no catálogo da Sempre-Viva.');
              return of({ ...empty, status: 'ready' as const });
            }
            return combineLatest([this.catalog.getCategories(), this.catalog.getProducts()]).pipe(
              map(([categories, products]) => {
                const category = categories.find((item) => item.id === product.categoryId) ?? null;
                const others = products.filter((item) => item.id !== product.id && item.gender === product.gender);
                const sameCategory = others.filter((item) => item.categoryId === product.categoryId);
                const index = products.findIndex((item) => item.id === product.id);
                const next = products.length > 1 ? products[(index + 1) % products.length] : null;
                return {
                  status: 'ready' as const,
                  product,
                  category,
                  categories,
                  related: (sameCategory.length ? sameCategory : others).slice(0, 5),
                  next,
                };
              }),
              tap((state) => {
                this.seo.set(state.product.name, state.product.description);
              }),
            );
          }),
          startWith(empty),
          catchError(() => of({ ...empty, status: 'error' as const })),
        ),
      ),
    ),
    { initialValue: empty },
  );

  constructor() {
    let seen = '';
    effect(() => {
      const product = this.state().product;
      if (!product || product.id === seen) {
        return;
      }
      seen = product.id;
      this.pickedSize.set(product.sizes[0] ?? null);
      this.pickedColor.set(product.colors[0] ?? null);
    });
  }

  categoryLink(state: DetailState): string[] | null {
    if (!state.product || !state.category) {
      return null;
    }
    return genderPath(state.product.gender, state.category.slug);
  }

  interestNote(): string {
    const parts = [];
    if (this.pickedSize()) {
      parts.push(`Tamanho ${this.pickedSize()}`);
    }
    if (this.pickedColor()) {
      parts.push(`cor ${this.pickedColor()}`);
    }
    return parts.length ? `${parts.join(', ')}.` : '';
  }

  inBag(): boolean {
    const product = this.state().product;
    if (!product) {
      return false;
    }
    return this.bag.has(product.id, this.pickedSize(), this.pickedColor());
  }

  discount(): number | null {
    const product = this.state().product;
    const original = product?.compareAtPrice;
    if (!product || !original || original <= product.price) {
      return null;
    }
    return Math.round((1 - product.price / original) * 100);
  }

  addToBag(): void {
    const product = this.state().product;
    if (!product || !product.available) {
      return;
    }
    const photo = document.querySelector('.stage img') as HTMLImageElement | null;
    const imageUrl = product.images.find((item) => item.isPrimary)?.url ?? product.images[0]?.url ?? '';
    if (photo && imageUrl) {
      flyProductToCart(photo, imageUrl);
    }
    this.bag.add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      size: this.pickedSize(),
      color: this.pickedColor(),
      imageUrl,
    });
  }
}
