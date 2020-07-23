// class bundles all of the apps Routing functionality

import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthComponent } from './auth/auth.component';

const appRoutes: Routes = [
  // array of objects, where the objects are the routes we need - can also be child routes
  { path: '', redirectTo: '/recipes', pathMatch: 'full' }, // Default path on load, redirect to the recipes route - pathMatch: full overides default and only redirects if the full path is empty
  {
    path: 'recipes',
    loadChildren: () =>
      import('./recipes/recipes.module').then((m) => m.RecipesModule),
  },
  {
    path: 'shopping-list',
    loadChildren: () =>
      import('./shopping-list/shopping-list.module').then(
        (m) => m.ShoppingListModule
      ),
  },
  { path: 'auth', component: AuthComponent },
];

@NgModule({
  // turn from a normal Angular Class into a module
  imports: [
    RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules }),
  ], // this adds our routes into Angular Router, so that Angular knows about them
  // preLoad Strategy: Preload all modules --> Modules still broken into chunks, but chunks start loading after initial page load, so will be faster when needed!
  exports: [RouterModule], // exports our configured Router.
})
export class AppRoutingModule {
  // Remember to then add RouterModule as an import in app.module.ts
}
