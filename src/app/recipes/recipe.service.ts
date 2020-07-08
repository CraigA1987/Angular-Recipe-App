import { Injectable} from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredients.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';

@Injectable({providedIn: "root"}) // all components share the same instance of the service now.
export class RecipeService{
   // Array of recipe data
   private recipes: Recipe[] = [
        new Recipe('Home Made Pizza Recipe',
         'Delicious helathy home made pizza',
          'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/delish-homemade-pizza-horizontal-1542312378.png?crop=1.00xw:1.00xh;0,0&resize=768:*',
        [
            new Ingredient('BBQ Sauce', 1),
            new Ingredient('BBQ Base', 3),
            new Ingredient('ALLLLL the Meats', 5),
        ],),
        new Recipe('Luxury Ice Cream',
         'Delicious creamy thick ice cream',
          'https://2w0efl3n42tqerdhhgd4ug13-wpengine.netdna-ssl.com/wp-content/uploads/2016/09/Dairy-free-icecream-that-makes-you-go-mmm-1920x1080-1130x570.jpg',
          [
            new Ingredient('Cream', 1),
            new Ingredient('Vanilla Extract', 1),
            new Ingredient('Sugar', 1),
          ])
      ]; //typescript knows only an array of recipe objects will be stored in the array
    
      // Injecting a service into a service - we need access to the shopping-list service from the recipes service
      constructor(private slService: ShoppingListService){}


    // method to allow recipes array to be accessed from outside this file, as a copy
    getRecipes(){
        return this.recipes.slice(); //returns a new array, but an exact copy of it, so that no changes effect the original array (array is reference type!)
    }

    getRecipe(index: number){
        return this.recipes[index]; // used to get the recipe based on the recipes URL id
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]){
        this.slService.addIngredients(ingredients);
    }
}