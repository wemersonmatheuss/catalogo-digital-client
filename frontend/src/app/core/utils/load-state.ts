import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';

import { CatalogView } from '../models/catalog.models';

export function loadState<T>(source: Observable<T>, empty: T): Observable<CatalogView<T>> {
  return source.pipe(
    map((data) => ({ status: 'ready' as const, data })),
    startWith({ status: 'loading' as const, data: empty }),
    catchError(() => of({ status: 'error' as const, data: empty })),
  );
}
