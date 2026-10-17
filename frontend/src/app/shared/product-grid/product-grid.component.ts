import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Category, Product } from '../../core/models/catalog.models';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-product-grid',
  imports: [ProductCardComponent],
  templateUrl: './product-grid.component.html',
  styleUrl: './product-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductGridComponent {
  @Input({ required: true }) products: Product[] = [];
  @Input() categories: Category[] = [];
  @Input() layout: 'grid' | 'rail' = 'grid';

  categoryName(product: Product): string {
    return this.categories.find((category) => category.id === product.categoryId)?.name ?? '';
  }
}
