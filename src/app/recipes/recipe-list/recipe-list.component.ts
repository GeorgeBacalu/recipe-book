import { Component, EventEmitter, Output } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent {
  @Output() recipeWasSelected = new EventEmitter<Recipe>();
  recipes: Recipe[] = [
    new Recipe("Test recipe", "This is a test recipe", "https://9968c6ef49dc043599a5-e151928c3d69a5a4a2d07a8bf3efa90a.ssl.cf2.rackcdn.com/140765.jpg"),
    new Recipe("Test recipe2", "This is a test recipe2", "https://th.bing.com/th/id/R.2af8a871485849eed27b518b2362de54?rik=pHVHwpd8%2bebWdQ&pid=ImgRaw&r=0")
  ];

  onRecipeSelected(recipe: Recipe): void {
    this.recipeWasSelected.emit(recipe);
  }
}
