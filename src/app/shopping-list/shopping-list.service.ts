import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredients.model';

@Injectable({ providedIn: 'root' }) // all components share the same instance of the service now.
export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>(); // emitted event looks for changes to the ingredient array when new ingredient is added
  startedEditting = new Subject<number>();
  private ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('tomatoes', 12),
  ];

  // Return a copy of the array, so that the original isnt modified
  getIngredients() {
    return this.ingredients.slice();
  }

  getIngredient(index: number) {
    return this.ingredients[index];
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  addIngredients(ingredients: Ingredient[]) {
    // for loop is viable, but this will cause alot of event emittions so not recommded for scaling well
    // for (let ingredient of ingredients){
    //     this.addIngredient(ingredient);
    // }

    // Add all ingredients in one go, then emit the event once at the end - using es6 spread operator to turn an array of elements into a list of elements
    this.ingredients.push(...ingredients);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  updateIngredient(index: number, newIngredient: Ingredient) {
    this.ingredients[index] = newIngredient;
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  deleteIngredient(index: number) {
    this.ingredients.splice(index, 1);
    this.ingredientsChanged.next(this.ingredients.slice());
  }
}
