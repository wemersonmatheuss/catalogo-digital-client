import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Category } from '../../core/models/catalog.models';
import { genderPath } from '../../core/models/catalog.labels';
import { categoryCover } from './category-images';

@Component({
  selector: 'app-category-card',
  imports: [RouterLink],
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryCardComponent {
  @Input({ required: true }) category!: Category;

  get link(): string[] {
    return genderPath(this.category.gender, this.category.slug);
  }

  get cover(): string {
    return categoryCover(this.category.gender, this.category.slug);
  }
}
