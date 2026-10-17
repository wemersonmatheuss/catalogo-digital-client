import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

import { ProductImage } from '../../core/models/catalog.models';

@Component({
  selector: 'app-product-gallery',
  templateUrl: './product-gallery.component.html',
  styleUrl: './product-gallery.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductGalleryComponent implements OnChanges {
  @Input({ required: true }) images: ProductImage[] = [];
  selected = 0;
  zoom = false;
  origin = '50% 50%';

  ngOnChanges(): void {
    this.selected = 0;
    this.zoom = false;
  }

  select(index: number): void {
    this.selected = index;
    this.zoom = false;
  }

  get current(): ProductImage | undefined {
    return this.images[this.selected] ?? this.images[0];
  }

  move(event: MouseEvent): void {
    const frame = event.currentTarget as HTMLElement;
    const bounds = frame.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    this.origin = `${x}% ${y}%`;
  }
}
