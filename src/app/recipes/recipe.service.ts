import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';

@Injectable()
export class RecipeService {
	recipesChanged = new Subject<Recipe[]>();

	private recipes: Recipe[] = [];
	// private recipes: Recipe[] = [
	// 	new Recipe(
	// 		'Blegh Burger',
	// 		'This one\'s for the undertow',
	// 		'https://cdn.pixabay.com/photo/2014/12/21/23/28/recipe-575434_960_720.png',
	// 		[
	// 			new Ingredient('Splashes of eugh', 3),
	// 			new Ingredient('Hint of ruh', 1),
	// 		]
	// 	),
	// 	new Recipe(
	// 		'Test Recipe',
	// 		'Test description',
	// 		'https://cdn.pixabay.com/photo/2014/12/21/23/28/recipe-575434_960_720.png',
	// 		[
	// 			new Ingredient('Test 1', 1),
	// 			new Ingredient('Test 2', 2),
	// 		]
	// 	),
	// ];

	constructor(private shoppingListService: ShoppingListService) {}

	setRecipes(recipes: Recipe[]) {
		this.recipes = recipes;
		this.recipesChanged.next(this.recipes.slice());
	}

	getRecipes() {
		return this.recipes.slice();
	}

	getRecipe(id: number) {
		return this.recipes[id];
	}

	addIngredientsToShoppingList(ingredients: Ingredient[]) {
		this.shoppingListService.addIngredients(ingredients);
	}

	addRecipe(recipe: Recipe) {
		this.recipes.push(recipe);
		this.recipesChanged.next(this.recipes.slice());
	}

	updateRecipe(index: number, newRecipe: Recipe) {
		this.recipes[index] = newRecipe;
		this.recipesChanged.next(this.recipes.slice());
	}

	deleteRecipe(index: number) {
		this.recipes.splice(index, 1);
		this.recipesChanged.next(this.recipes.slice());
	}
}