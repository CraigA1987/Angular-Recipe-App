// Module to hold the recipe app feature ... app split up into modules based on features. Dont need to break up smaller apps but good practice!
import { NgModule } from '@angular/core';
import { ShoppingListComponent } from './shopping-list.component';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// add in all components inside the recipes area, removing them from the main app.modules.ts file
@NgModule({
  declarations: [ShoppingListComponent, ShoppingEditComponent],
  imports: [
    // need to import other modules in to be able to use them in componenets! Import and export is important
    CommonModule, //BrowserModule - this can only be added once, in the main app.modules! We use the commonModule instead in all other non top level modules. Gives access to NgIf and NgFor etc
    RouterModule.forChild([{ path: '', component: ShoppingListComponent }]), // child routes autmoatically merged with app.module root routes once this module is imported
    FormsModule,
    // services only need to be setup once in the app module, and cna then be accessed anywhere!
  ],
  //   exports: [ // no need to export these anymore, as they are only being used internally in the recipes module!
  // Our recipes routing has been put into this module, so no need to load componeents from app.module
  //     RecipesComponent,
  //     RecipeListComponent,
  //     RecipeDetailComponent,
  //     RecipeItemComponent,
  //     RecipeStartComponent,
  //     RecipeEditComponent,
  //   ],
})
export class ShoppingListModule {}

// Recipes module then needs to be added to the top level app module! Angular needs to be told about all modules.
// Adding an exports array means any module which imports the recipes module can then use these componenets
