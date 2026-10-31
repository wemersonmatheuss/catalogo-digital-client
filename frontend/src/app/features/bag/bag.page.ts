import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { defaultSiteContent } from '../../core/models/site-content';
import { CartApiService } from '../../core/api/cart-api.service';
import { BagService } from '../../core/services/bag.service';
import { CatalogService } from '../../core/services/catalog.service';
import { SeoService } from '../../core/services/seo.service';
import { formatCartMessage, whatsappMessageUrl } from '../../core/utils/whatsapp';
import { BrlPipe } from '../../shared/brl.pipe';

@Component({
  selector: 'app-bag-page',
  imports: [RouterLink, FormsModule, BrlPipe],
  templateUrl: './bag.page.html',
  styleUrl: './bag.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BagPage {
  private readonly carts = inject(CartApiService);
  readonly bag = inject(BagService);
  readonly site = toSignal(inject(CatalogService).getSite(), { initialValue: defaultSiteContent() });
  readonly sending = signal(false);
  readonly error = signal<string | null>(null);
  readonly savedId = signal<string | null>(null);
  readonly total = computed(() => this.bag.items().reduce((sum, item) => sum + item.price, 0));

  customerName = '';
  paymentMethod = '';

  constructor() {
    inject(SeoService).set('Carrinho', 'Peças separadas no carrinho da Sempre-Viva.');
  }

  async send(): Promise<void> {
    if (this.bag.items().length === 0 || this.sending()) {
      return;
    }
    this.sending.set(true);
    this.error.set(null);
    try {
      const cart = await firstValueFrom(this.carts.create(this.bag.items()));
      this.savedId.set(cart.id);
      const url = whatsappMessageUrl(formatCartMessage(cart, this.customerName.trim(), this.paymentMethod));
      if (!url) {
        this.error.set('O WhatsApp da loja ainda não foi configurado.');
        return;
      }
      window.open(url, '_blank', 'noopener');
    } catch {
      this.error.set('Não foi possível registrar o carrinho. Confira se a API está no ar.');
    } finally {
      this.sending.set(false);
    }
  }
}
