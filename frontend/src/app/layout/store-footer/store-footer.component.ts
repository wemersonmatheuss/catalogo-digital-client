import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { whatsappUrl } from '../../core/utils/whatsapp';
import { WhatsappButtonComponent } from '../../shared/whatsapp-button/whatsapp-button.component';

@Component({
  selector: 'app-store-footer',
  imports: [RouterLink, WhatsappButtonComponent],
  templateUrl: './store-footer.component.html',
  styleUrl: './store-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreFooterComponent {
  readonly whatsapp = whatsappUrl();
}
