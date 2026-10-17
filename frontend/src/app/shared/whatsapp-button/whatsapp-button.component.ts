import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { whatsappUrl } from '../../core/utils/whatsapp';

@Component({
  selector: 'app-whatsapp-button',
  templateUrl: './whatsapp-button.component.html',
  styleUrl: './whatsapp-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WhatsappButtonComponent {
  @Input() label = 'Falar no WhatsApp';
  @Input() productName?: string;
  @Input() note?: string;
  @Input() variant: 'primary' | 'quiet' | 'float' | 'block' = 'primary';

  get href(): string | null {
    return whatsappUrl(this.productName, this.note);
  }
}
