import { Injectable, signal } from '@angular/core';

/**
 * Controla o estado visual do cabeçalho.
 * A página inicial define heroMode = true ao carregar e false ao sair,
 * deixando o header transparente sobre o banner principal.
 */
@Injectable({ providedIn: 'root' })
export class HeaderStateService {
  /** Quando true, o header fica transparente e sobreposto ao hero. */
  readonly heroMode = signal(false);
}
