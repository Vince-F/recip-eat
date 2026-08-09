import { type Page } from "@playwright/test";
import { RecipeListEntryElement } from "./recipeListEntryElement";

export class RecipesListPage {
  static readonly headerSelector = "[data-test='recipes-list-header']";
  static readonly listSelector = "[data-test='recipes-list']";

  constructor(readonly page: Page) {}

  get header() {
    return this.page.locator(RecipesListPage.headerSelector);
  }

  get recipesList() {
    return this.page.locator(RecipesListPage.listSelector);
  }

  get recipeEntries() {
    return this.recipesList.locator("[data-test^='recipe-entry-']");
  }

  get createRecipeButton() {
    return this.page.locator("[data-test='create-recipe-button']");
  }

  getRecipeEntry(recipeId: string) {
    return new RecipeListEntryElement(this.page, recipeId);
  }

  goTo() {
    return this.page.goto("");
  }
}