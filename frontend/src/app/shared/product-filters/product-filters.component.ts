import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Category, Gender } from '../../core/models/catalog.models';
import { GENDER_LABEL } from '../../core/models/catalog.labels';

export interface CatalogFilterValue {
  minPrice: number | null;
  maxPrice: number | null;
  available: 'all' | 'yes' | 'no';
}

@Component({
  selector: 'app-product-filters',
  imports: [ReactiveFormsModule],
  templateUrl: './product-filters.component.html',
  styleUrl: './product-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFiltersComponent {
  @Input() categories: Category[] = [];
  @Input() gender?: Gender;
  @Input() categorySlug?: string;
  @Output() genderChange = new EventEmitter<Gender | undefined>();
  @Output() categoryChange = new EventEmitter<string | undefined>();
  @Output() apply = new EventEmitter<CatalogFilterValue>();

  readonly labels = GENDER_LABEL;
  readonly form = new FormGroup({
    minPrice: new FormControl<number | null>(null),
    maxPrice: new FormControl<number | null>(null),
    available: new FormControl<'all' | 'yes' | 'no'>('all', { nonNullable: true }),
  });

  @Input() set value(value: CatalogFilterValue) {
    this.form.setValue(value, { emitEvent: false });
  }

  chooseGender(gender?: Gender): void {
    this.genderChange.emit(gender);
  }

  chooseCategory(slug?: string): void {
    this.categoryChange.emit(slug);
  }

  submit(): void {
    const raw = this.form.getRawValue();
    this.apply.emit({
      minPrice: raw.minPrice === null || raw.minPrice === undefined ? null : Number(raw.minPrice),
      maxPrice: raw.maxPrice === null || raw.maxPrice === undefined ? null : Number(raw.maxPrice),
      available: raw.available,
    });
  }
}
