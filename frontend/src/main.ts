import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { RouteReuseStrategy, provideRouter, withComponentInputBinding } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular';

import { addIcons } from 'ionicons';
import { cartOutline, closeOutline, menuOutline, searchOutline } from 'ionicons/icons';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { CatalogSource } from './app/core/services/catalog-source';
import { HttpCatalogSource } from './app/core/services/http-catalog.source';
import { MockCatalogSource } from './app/core/services/mock-catalog.source';
import { environment } from './environments/environment';

addIcons({ cartOutline, closeOutline, menuOutline, searchOutline });

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular({ mode: 'md' }),
    provideHttpClient(),
    provideRouter(routes, withComponentInputBinding()),
    {
      provide: CatalogSource,
      useClass: environment.useMockData ? MockCatalogSource : HttpCatalogSource,
    },
  ],
});
