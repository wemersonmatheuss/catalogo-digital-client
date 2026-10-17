import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { BagService } from '../../core/services/bag.service';
import { SeoService } from '../../core/services/seo.service';
import { formatCartMessage, whatsappMessageUrl } from '../../core/utils/whatsapp';
import { BrlPipe } from '../../shared/brl.pipe';

interface SavedCart {
  id: string;
  items: {
    productId: string;
    name: string;
    price: number;
    size: string | null;
    color: string | null;
  }[];
}

@Component({
  selector: 'app-bag-page',
  imports: [RouterLink, FormsModule, BrlPipe],
  templateUrl: './bag.page.html',
  styleUrl: './bag.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BagPage {
  private readonly http = inject(HttpClient);
  readonly bag = inject(BagService);
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
      const cart = await firstValueFrom(
        this.http.post<SavedCart>(`${environment.apiUrl}/carts`, { items: this.bag.items() }),
      );
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
