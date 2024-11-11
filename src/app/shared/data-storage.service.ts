import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../models/recipe.model';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  url: string = "https://ng-recipe-book-ad2f7-default-rtdb.firebaseio.com/recipes.json";

  constructor(private http: HttpClient, private recipeService: RecipeService) { }

  storeRecipes(): void {
    this.http.put(this.url, this.recipeService.getRecipes()).subscribe((storedRecipes: Recipe[]) => console.log(storedRecipes));
  }

  fetchRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.url).pipe(
      map((recipes: Recipe[]) => recipes.map(recipe => ({ ...recipe, ingredients: recipe.ingredients || [] }))),
      tap((recipes: Recipe[]) => this.recipeService.setRecipes(recipes)));
  }
}
