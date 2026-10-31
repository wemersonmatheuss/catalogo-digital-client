import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { defaultSiteContent } from '../../core/models/site-content';
import { CatalogService } from '../../core/services/catalog.service';
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
  readonly site = toSignal(inject(CatalogService).getSite(), { initialValue: defaultSiteContent() });
}
