import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'reactive',
    // Necesario cuando no se exporta el modulo desde el routes.ts
    loadChildren: () => import('./reactive/reactive.routes').then((module) => module.reactiveRoutes),
  },
  {
    path: 'auth',
    // Cuando se exporta queda así
    loadChildren: () => import('./auth/auth.routes'),
  },
  {
    path: 'country',
    loadChildren: () => import('./country/country.routes').then((module) => module.countryRoutes),
  },
  {
    path: '**',
    redirectTo: 'reactive',
  }
];
