import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[];

  constructor(private recipeService: RecipeService, // provides access to our recipe service.ts, used to share and manage recipe data
    private router: Router,// Injects the router so that component knows about the routes, and can use the navigate method
    private route: ActivatedRoute) { } // Tells component about the components URL and its details (not the current URL on screen!), so this component sits inside the recipe-list component, which is accessed /recipe

  ngOnInit() {
    this.recipes = this.recipeService.getRecipes(); // on init we get a copy of the recipes data array, placing it into the recipes array
  }

  onNewRecipe(){
    this.router.navigate(['new'], {relativeTo: this.route }) // adds /new onto the end of the current route (which will always be /recipes/)
  }
}
