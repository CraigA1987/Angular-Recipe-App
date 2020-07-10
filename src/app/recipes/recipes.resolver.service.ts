// resolver runs before a route is loaded, to ensure certain data the route depends on is there
import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Recipe } from './recipe.model';
import { DataStorageService } from '../shared/data-storage.service';
import { RecipeService } from './recipe.service';

@Injectable({ providedIn: 'root' })
export class RecipesResolverService implements Resolve<Recipe[]> {
  // need to implement the resolve interface

  constructor(
    private dataStorageService: DataStorageService,
    private recipesService: RecipeService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // Every time certain routes are run, we run the data storage service fetch recipes method, ensuring data is there when we need it
    // need to add this method when using a resolver.
    // Resolver now loads the data before it gets to the page!

    // need to first check to see if we have any editted recipes which havent been saved, only fetching new recipes if not
    const recipes = this.recipesService.getRecipes();

    if (recipes.length === 0) {
      // if no recipes, we should fetch them!
      return this.dataStorageService.fetchRecipes();
    } else {
      return recipes; // no need to fetch recipes if we already have them
    }
  }
}
