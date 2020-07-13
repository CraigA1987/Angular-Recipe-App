import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { map, tap, take, exhaustMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' }) // we are injecting the recipeService / httpService into this service, so we need injectable
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipesService: RecipeService,
    private authService: AuthService
  ) {} // when using 'private' typescript automatically creates a property of the same name, so it doesnt need explicitly declared

  storeRecipes() {
    const recipes = this.recipesService.getRecipes();
    // on a PUT request firebase overides all of the data currently in the collection!

    // return this.http.put('https://recipe-book-app-a1372.firebaseio.com/recipes.json', recipes);
    // // request needs to be subscribed to in the component for it to work - can use that subscription in the component to trigger loading spinners etc

    // OR  if you dont want to put it into a component... AS long as you have no interest in the response in the component, subscribe in this service
    this.http
      .put('https://recipe-book-app-a1372.firebaseio.com/recipes.json', recipes)
      .subscribe((response) => {
        console.log(response); // tells us what goes into firebase db
      });
  }

  fetchRecipes() {
    // we need to subscribe to the response in the place we are interested in the response, so subscribe here, then move data into the already linked RecipesService
    return this.http
      .get<Recipe[]>(
        'https://recipe-book-app-a1372.firebaseio.com/recipes.json'
      )
      .pipe(
        // Using rxjs map to protect from unexpected errors where data is missing in some cases
        map((recipes) => {
          return recipes.map((recipe) => {
            // if recipe.ingrediets is true, there is something in its array, if not, set to blank array
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : [],
            }; // spreas operator copies all exsisting data
          }); // array map method, different to rxks operator! map lets you transform each componenet
        }),
        tap((recipes) => {
          this.recipesService.setRecipes(recipes);
        }) // tap allows us to run some code without altering observable data
        //   ) // checing to make sure a recipe has ingredients, if not we want to add an empty array to avoid any issues. Map lets you edit the data before subscription
        //   .subscribe((recipes) => {
        //     this.recipesService.setRecipes(recipes);
      );
  }
  // get user once, then clear subscription... allowed due to BehaviourSubject rather than normal subject
  // take tells rxjs that i only want to take 1 value from the observable, then it is autmoatically unsubscribed
  // exhaustMap waits for the first observable to complete (so gets user), then we can pass data from previous observable into second one
}
