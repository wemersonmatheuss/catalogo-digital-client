import { ChangeDetectionStrategy, Component, ElementRef, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonIcon } from '@ionic/angular';

import { Product } from '../../core/models/catalog.models';
import { BagService } from '../../core/services/bag.service';
import { flyProductToCart } from '../../core/utils/fly-to-cart';
import { BrlPipe } from '../brl.pipe';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, BrlPipe, IonIcon],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  private readonly bag = inject(BagService);
  private readonly host = inject(ElementRef<HTMLElement>);

  @Input({ required: true }) product!: Product;
  @Input() categoryName = '';

  get image() {
    return this.product.images.find((item) => item.isPrimary) ?? this.product.images[0];
  }

  get discount(): number | null {
    const original = this.product.compareAtPrice;
    if (!original || original <= this.product.price) {
      return null;
    }
    return Math.round((1 - this.product.price / original) * 100);
  }

  addToBag(): void {
    if (!this.product.available) {
      return;
    }
    const source = this.host.nativeElement.querySelector('.media img') as HTMLImageElement | null;
    if (source && this.image) {
      flyProductToCart(source, this.image.url);
    }
    this.bag.add({
      productId: this.product.id,
      slug: this.product.slug,
      name: this.product.name,
      price: this.product.price,
      size: this.product.sizes[0] ?? null,
      color: this.product.colors[0] ?? null,
      imageUrl: this.image?.url ?? '',
    });
  }
}
