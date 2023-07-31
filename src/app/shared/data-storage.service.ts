import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { Observable, map, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  url: string = "https://ng-recipe-book-ad2f7-default-rtdb.firebaseio.com/recipes.json";

  constructor(private http: HttpClient, private recipeService: RecipeService) { }

  storeRecipes(): void {
    const recipes = this.recipeService.getRecipes();
    this.http.put(this.url, recipes).subscribe((storedRecipes: Recipe[]) => console.log(storedRecipes));
  }

  fetchRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.url)
    .pipe(map((recipes: Recipe[]) => recipes.map(recipe => ({ ...recipe, ingredients: recipe.ingredients || [] }))),
          tap((recipes: Recipe[]) => this.recipeService.setRecipes(recipes)));
  }
}
