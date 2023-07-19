import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Ingredient } from "../../shared/ingredient.model"

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent {
  @Output() ingredientAdded = new EventEmitter<Ingredient>();
  @ViewChild("nameInput") nameInputRef: ElementRef; 
  @ViewChild("amountInput") amountInputRef: ElementRef;

  onAddItem(): void {
    this.ingredientAdded.emit(new Ingredient(this.getInputValue(this.nameInputRef), +this.getInputValue(this.amountInputRef)));
  }

  getInputValue(input: ElementRef): string {
    return input.nativeElement.value;
  }
}
