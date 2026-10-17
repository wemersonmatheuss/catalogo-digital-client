import { ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonIcon } from '@ionic/angular';

@Component({
  selector: 'app-search-bar',
  imports: [ReactiveFormsModule, IonIcon],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent {
  private readonly router = inject(Router);
  private readonly host = inject(ElementRef<HTMLElement>);

  @Input() variant: 'field' | 'icon' = 'field';

  readonly open = signal(false);
  readonly form = new FormGroup({
    term: new FormControl('', { nonNullable: true }),
  });

  toggle(): void {
    this.open.update((value) => !value);
  }

  @HostListener('document:click', ['$event'])
  closeOnOutside(event: MouseEvent): void {
    if (!this.open()) {
      return;
    }
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
    }
  }

  search(): void {
    const term = this.form.controls.term.value.trim();
    this.open.set(false);
    void this.router.navigate(['/produtos'], {
      queryParams: term ? { busca: term } : {},
    });
  }
}
