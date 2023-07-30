import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
})
export class RecipeEditComponent implements OnInit {
  recipeForm: FormGroup;
  editMode: boolean = false;
  id: number;

  constructor( private route: ActivatedRoute, private router: Router, private recipeService: RecipeService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.initForm();
    });
  }

  getIngredientControls(): AbstractControl<any, any>[] { return (<FormArray>this.recipeForm.get('ingredients')).controls; }

  onAddIngredient(): void {
    (<FormArray>this.recipeForm.get('ingredients')).push(new FormGroup({
      "name": new FormControl(null, Validators.required),
      "amount": new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
      }));
  }

  onDeleteIngredient(index: number): void { (<FormArray>this.recipeForm.get('ingredients')).removeAt(index); }

  onSaveRecipe(): void {
    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, this.recipeForm.value);
    } else {
      this.recipeService.addRecipe(this.recipeForm.value);
    }
    (<FormArray>this.recipeForm.get('ingredients')).clear();
    this.recipeForm.reset();
    this.router.navigate(["../"], { relativeTo: this.route });
  }

  onCancel(): void { this.router.navigate(["../"], { relativeTo: this.route }); }

  private initForm(): void {
    const recipe = this.editMode ? this.recipeService.getRecipe(this.id) : null;
    const recipeIngredients = new FormArray([]);
    if (recipe && recipe.ingredients) {
      for (const ingredient of recipe.ingredients) {
        recipeIngredients.push(new FormGroup({
            "name": new FormControl(ingredient.name, Validators.required),
            "amount": new FormControl(ingredient.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
          }));
      }
    }
    this.recipeForm = new FormGroup({
      "name": new FormControl(recipe?.name, Validators.required),
      "description": new FormControl(recipe?.description, Validators.required),
      "imagePath": new FormControl(recipe?.imagePath, Validators.required),
      "ingredients": recipeIngredients
    });
  }
}
