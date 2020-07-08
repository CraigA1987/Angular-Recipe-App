import { Component, OnInit} from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
 recipe: Recipe;
 id: number;

  // inject the service
  constructor(private recipeService: RecipeService,
    private route: ActivatedRoute, //Activated Route gives access to URL parameters
    private router: Router) { } //Router gives access to router methods such as navigate

  ngOnInit(): void { // Subscribe to the route params, so whenever it changes we get the new route id
   this.route.params.subscribe((params: Params) => {
      this.id = +params['id']; // puts params id (+ means coverted into a number) into our id varaible, so we can identify the recipe
      this.recipe = this.recipeService.getRecipe(this.id); // whenever or recipe changes, we get the recipe using a recipeservice method
   })
  }

  onAddToShoppingList(){
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients); // Adds the ingredients for the recipe into the recipe service
  }

  onEditRecipe(){
   this.router.navigate(['edit'], {relativeTo: this.route});
   //this.router.navigate(['../', this.id, 'edit', {relativeTo: this.route}])// more complex way of doing the line of code above if we needed soemthing more dynamic
  }
}
