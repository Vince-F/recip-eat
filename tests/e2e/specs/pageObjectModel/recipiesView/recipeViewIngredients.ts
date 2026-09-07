import { Page } from "@playwright/test";

export class RecipeViewIngredients {
  static readonly rootSelector = "[data-test='recipe-ingredients-content']";
  constructor(readonly page: Page) {}

  get root() {
    return this.page.locator(RecipeViewIngredients.rootSelector);
  }

  get ingredientList() {
    return this.root.locator("[data-test='recipe-ingredients-list']");
  }

  get ingredientListChildrenNumber() {
    return this.ingredientList.locator("[data-test^='recipe-ingredient-']").count();
  }

  getIngredientEntry(index: number) {
    return this.root.locator(`[data-test='recipe-ingredient-${index}']`);
  }
}