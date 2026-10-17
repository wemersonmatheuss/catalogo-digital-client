import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IonApp } from '@ionic/angular';

import { StoreFooterComponent } from './layout/store-footer/store-footer.component';
import { StoreHeaderComponent } from './layout/store-header/store-header.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrl: 'app.component.scss',
  imports: [IonApp, RouterOutlet, StoreHeaderComponent, StoreFooterComponent],
})
export class AppComponent {}
