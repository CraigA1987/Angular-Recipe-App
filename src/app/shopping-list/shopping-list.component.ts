import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/ingredients.model';
import { ShoppingListService } from './shopping-list.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[];
  private subscription: Subscription; // store subscription so that it can be removed on component exit

  // inject the service
  constructor(private slService: ShoppingListService) {}

  // All tasks which require heavy lifting should be done here, good practice
  ngOnInit() {
    this.ingredients = this.slService.getIngredients(); // returns the array of ingredients from the service
    this.subscription = this.slService.ingredientsChanged.subscribe(
      // subscribed to any changes inside the ingredientsChanged variable, pulling the changes into the ingredients varaible
      (ingredients: Ingredient[]) => {
        this.ingredients = ingredients;
      }
    );
  }

  onEditItem(index: number) {
    this.slService.startedEditting.next(index); // omit the new item's index to the shopping list service so that it can be accessed elsewhere
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
