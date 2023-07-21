import { Component, ElementRef, ViewChild } from '@angular/core';
import { ShoppingListService } from '../shopping-list.service';
import { Ingredient } from 'src/app/shared/ingredient.model';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent {
  @ViewChild("nameInput") nameInputRef: ElementRef; 
  @ViewChild("amountInput") amountInputRef: ElementRef;

  constructor(private shoppingListService: ShoppingListService) { }

  onAddItem(): void {
    this.shoppingListService.addIntredient(new Ingredient(this.getInputValue(this.nameInputRef), +this.getInputValue(this.amountInputRef)));
  }

  getInputValue(input: ElementRef): string {
    return input.nativeElement.value;
  }
}
