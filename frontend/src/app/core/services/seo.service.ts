import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  set(pageTitle: string, description: string): void {
    const fullTitle = pageTitle === 'Sempre-Viva' ? pageTitle : `${pageTitle} · Sempre-Viva`;
    this.title.setTitle(fullTitle);
    this.meta.updateTag({ name: 'description', content: description });
  }
}
