import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { defaultSiteContent } from '../../core/models/site-content';
import { GENDER_LABEL, genderPath } from '../../core/models/catalog.labels';
import { CatalogService } from '../../core/services/catalog.service';
import { SeoService } from '../../core/services/seo.service';
import { loadState } from '../../core/utils/load-state';
import { CategoryCardComponent } from '../../shared/category-card/category-card.component';
import { EmptyStateComponent } from '../../shared/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/error-state/error-state.component';
import { LoadingStateComponent } from '../../shared/loading-state/loading-state.component';
import { ProductGridComponent } from '../../shared/product-grid/product-grid.component';

@Component({
  selector: 'app-home-page',
  imports: [
    RouterLink,
    CategoryCardComponent,
    ProductGridComponent,
    LoadingStateComponent,
    EmptyStateComponent,
    ErrorStateComponent,
  ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  private readonly catalog = inject(CatalogService);
  private readonly destroyRef = inject(DestroyRef);
  private carouselTimer: ReturnType<typeof setInterval> | undefined;
  readonly genderLabel = GENDER_LABEL;
  readonly femalePath = genderPath('female');
  readonly malePath = genderPath('male');
  readonly slide = signal(0);

  readonly categories = toSignal(loadState(this.catalog.getCategories(), []), { requireSync: true });
  readonly featured = toSignal(loadState(this.catalog.getFeatured(), []), { requireSync: true });
  readonly recent = toSignal(loadState(this.catalog.getRecent(8), []), { requireSync: true });
  readonly banners = toSignal(loadState(this.catalog.getBanners(), []), { requireSync: true });

  readonly heroes = computed(() => this.banners().data.filter((banner) => banner.placement === 'hero'));
  readonly strips = computed(() => this.banners().data.filter((banner) => banner.placement === 'middle'));

  private readonly seo = inject(SeoService);
  readonly site = toSignal(this.catalog.getSite(), { initialValue: defaultSiteContent() });
  readonly blocks = computed(() => this.site().blocks.filter((block) => block.visible));

  constructor() {
    effect(() => {
      const site = this.site();
      this.seo.set(site.seoTitle, site.seoDescription);
    });
    this.startCarousel();
    this.destroyRef.onDestroy(() => this.stopCarousel());
  }

  categoriesFor(gender: 'female' | 'male') {
    return this.categories().data.filter((category) => category.gender === gender);
  }

  next(): void {
    const total = this.heroes().length;
    if (total < 2) {
      return;
    }
    this.slide.update((index) => (index + 1) % total);
  }

  goTo(index: number): void {
    this.slide.set(index);
    this.startCarousel();
  }

  private startCarousel(): void {
    this.stopCarousel();
    this.carouselTimer = setInterval(() => this.next(), 3000);
  }

  private stopCarousel(): void {
    if (this.carouselTimer) {
      clearInterval(this.carouselTimer);
      this.carouselTimer = undefined;
    }
  }
}
