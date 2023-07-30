import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild("shoppingListForm") shoppingListForm: NgForm;
  startedEditingSubscription: Subscription;
  editMode: boolean = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit(): void {
    this.startedEditingSubscription = this.shoppingListService.startedEditing.subscribe((index: number) => {
      this.editMode = true;
      this.editedItemIndex = index;
      this.editedItem = this.shoppingListService.getIngredient(index);
      const { name, amount } = this.editedItem;
      this.shoppingListForm.setValue({ name, amount });
    });
  }

  ngOnDestroy(): void { this.startedEditingSubscription.unsubscribe(); }

  onClear(): void {
    this.editMode = false;
    this.shoppingListForm.reset();
  }

  onSaveItem(): void {
    const { name, amount } = this.shoppingListForm.value;
    const newIngredient = new Ingredient(name, amount);
    if (this.editMode) {
      this.shoppingListService.updateIngredient(this.editedItemIndex, newIngredient);
    } else {
      this.shoppingListService.addIntredient(newIngredient);
    }
    this.onClear();
  }

  onDelete(): void {
    this.shoppingListService.deleteIngredient(this.editedItemIndex);
    this.onClear();
  }
}
