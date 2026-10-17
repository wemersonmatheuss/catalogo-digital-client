import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { combineLatest, of } from 'rxjs';
import { catchError, map, startWith, switchMap, tap } from 'rxjs/operators';

import { Category, Gender, Product } from '../../core/models/catalog.models';
import { GENDER_LABEL, genderFromSlug, genderPath } from '../../core/models/catalog.labels';
import { CatalogService } from '../../core/services/catalog.service';
import { SeoService } from '../../core/services/seo.service';
import { EmptyStateComponent } from '../../shared/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/error-state/error-state.component';
import { LoadingStateComponent } from '../../shared/loading-state/loading-state.component';
import { CatalogFilterValue, ProductFiltersComponent } from '../../shared/product-filters/product-filters.component';
import { ProductGridComponent } from '../../shared/product-grid/product-grid.component';

interface ListState {
  status: 'loading' | 'ready' | 'error';
  title: string;
  products: Product[];
  categories: Category[];
  gender?: Gender;
  categorySlug?: string;
  categoryMissing: boolean;
  search: string;
  filters: CatalogFilterValue;
}

@Component({
  selector: 'app-product-list-page',
  imports: [
    ProductFiltersComponent,
    ProductGridComponent,
    LoadingStateComponent,
    EmptyStateComponent,
    ErrorStateComponent,
  ],
  templateUrl: './product-list.page.html',
  styleUrl: './product-list.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly catalog = inject(CatalogService);
  private readonly seo = inject(SeoService);

  readonly filtersOpen = signal(false);
  readonly state = toSignal(
    combineLatest([this.route.paramMap, this.route.queryParamMap]).pipe(
      switchMap(([params, query]) => this.load(params, query)),
    ),
    {
      initialValue: {
        status: 'loading',
        title: 'Produtos',
        products: [],
        categories: [],
        categoryMissing: false,
        search: '',
        filters: { minPrice: null, maxPrice: null, available: 'all' },
      } as ListState,
    },
  );

  toggleFilters(): void {
    this.filtersOpen.update((open) => !open);
  }

  onGender(gender?: Gender): void {
    const path = gender ? genderPath(gender) : ['/produtos'];
    void this.router.navigate(path, { queryParams: this.currentQuery() });
  }

  onCategory(categorySlug?: string): void {
    const gender = this.state().gender;
    const path = gender ? genderPath(gender, categorySlug) : ['/produtos'];
    void this.router.navigate(path, { queryParams: this.currentQuery() });
  }

  onApply(filters: CatalogFilterValue): void {
    this.filtersOpen.set(false);
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        busca: this.state().search || null,
        precoMin: filters.minPrice,
        precoMax: filters.maxPrice,
        disponibilidade:
          filters.available === 'yes' ? 'disponivel' : filters.available === 'no' ? 'indisponivel' : null,
      },
    });
  }

  private currentQuery(): Record<string, string | number | null> {
    const { search, filters } = this.state();
    return {
      busca: search || null,
      precoMin: filters.minPrice,
      precoMax: filters.maxPrice,
      disponibilidade: filters.available === 'yes' ? 'disponivel' : filters.available === 'no' ? 'indisponivel' : null,
    };
  }

  private load(params: ParamMap, query: ParamMap) {
    const genderParam = genderFromSlug(params.get('gender'));
    const filters = readFilters(query);
    const search = query.get('busca')?.trim() ?? '';

    if (genderParam === 'invalid') {
      this.seo.set('Segmento não encontrado', 'Esse segmento não faz parte do catálogo da Sempre-Viva.');
      return of(emptyState('Segmento não encontrado', filters, search, 'error'));
    }

    const gender = genderParam;
    const categorySlug = params.get('category') ?? undefined;

    return this.catalog.getCategories(gender).pipe(
      switchMap((categories) => {
        const category = categorySlug ? categories.find((item) => item.slug === categorySlug) : undefined;
        if (categorySlug && !category) {
          const title = 'Categoria não encontrada';
          this.seo.set(title, 'A categoria informada não está disponível no catálogo.');
          return of({
            ...emptyState(title, filters, search, 'ready'),
            gender,
            categories,
            categorySlug,
            categoryMissing: true,
          } satisfies ListState);
        }

        const title = pageTitle(gender, category?.name, search);
        this.seo.set(title, `Peças ${title.toLocaleLowerCase('pt-BR')} no catálogo da Sempre-Viva, em Gravatá.`);

        return this.catalog
          .getProducts({
            gender,
            categorySlug,
            search: search || undefined,
            minPrice: filters.minPrice ?? undefined,
            maxPrice: filters.maxPrice ?? undefined,
            available: filters.available === 'all' ? undefined : filters.available === 'yes',
          })
          .pipe(
            map(
              (products) =>
                ({
                  status: 'ready',
                  title,
                  products,
                  categories,
                  gender,
                  categorySlug,
                  categoryMissing: false,
                  search,
                  filters,
                }) satisfies ListState,
            ),
          );
      }),
      startWith(emptyState('Produtos', filters, search, 'loading')),
      catchError(() => of(emptyState('Produtos', filters, search, 'error'))),
      tap((state) => {
        if (state.status === 'error') {
          this.seo.set('Catálogo indisponível', 'Não foi possível carregar os produtos da Sempre-Viva.');
        }
      }),
    );
  }
}

function readFilters(query: ParamMap): CatalogFilterValue {
  const disponibilidade = query.get('disponibilidade');
  return {
    minPrice: optionalNumber(query.get('precoMin')),
    maxPrice: optionalNumber(query.get('precoMax')),
    available: disponibilidade === 'disponivel' ? 'yes' : disponibilidade === 'indisponivel' ? 'no' : 'all',
  };
}

function optionalNumber(value: string | null): number | null {
  if (!value?.trim()) {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function pageTitle(gender: Gender | undefined, categoryName?: string, search?: string): string {
  if (search) {
    return `Resultados para “${search}”`;
  }
  if (categoryName && gender) {
    return `${categoryName} · ${GENDER_LABEL[gender]}`;
  }
  if (gender) {
    return GENDER_LABEL[gender];
  }
  return 'Produtos';
}

function emptyState(
  title: string,
  filters: CatalogFilterValue,
  search: string,
  status: ListState['status'],
): ListState {
  return {
    status,
    title,
    products: [],
    categories: [],
    categoryMissing: false,
    search,
    filters,
  };
}
