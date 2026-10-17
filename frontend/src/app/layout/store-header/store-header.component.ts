import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonIcon } from '@ionic/angular';

import { BagService } from '../../core/services/bag.service';
import { SearchBarComponent } from '../../shared/search-bar/search-bar.component';

@Component({
  selector: 'app-store-header',
  imports: [RouterLink, RouterLinkActive, SearchBarComponent, IonIcon],
  templateUrl: './store-header.component.html',
  styleUrl: './store-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreHeaderComponent {
  readonly bag = inject(BagService);
  readonly menuOpen = signal(false);

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
