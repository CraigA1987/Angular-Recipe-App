// class bundles all of the apps Routing functionality

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipesComponent } from './recipes/recipes.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { RecipeStartComponent } from './recipes/recipe-start/recipe-start.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { RecipesResolverService } from './recipes/recipes.resolver.service';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';

const appRoutes: Routes = [
  // array of objects, where the objects are the routes we need - can also be child routes
  { path: '', redirectTo: '/recipes', pathMatch: 'full' }, // Default path on load, redirect to the recipes route - pathMatch: full overides default and only redirects if the full path is empty
  {
    path: 'recipes',
    component: RecipesComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: RecipeStartComponent },
      { path: 'new', component: RecipeEditComponent },
      {
        path: ':id',
        component: RecipeDetailComponent,
        resolve: [RecipesResolverService],
      }, // angular runs resolvers before running the route
      {
        path: ':id/edit',
        component: RecipeEditComponent,
        resolve: [RecipesResolverService],
      },
    ],
  }, // path is displayed in the URL, which loads a certain component
  { path: 'shopping-list', component: ShoppingListComponent },
  { path: 'auth', component: AuthComponent },
];

@NgModule({
  // turn from a normal Angular Class into a module
  imports: [RouterModule.forRoot(appRoutes)], // this adds our routes into Angular Router, so that Angular knows about them
  exports: [RouterModule], // exports our configured Router.
})
export class AppRoutingModule {
  // Remember to then add RouterModule as an import in app.module.ts
}
