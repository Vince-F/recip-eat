import { type Page } from "@playwright/test";
import { RecipeViewHeader } from "./recipeViewHeader";
import { RecipeViewIngredients } from "./recipeViewIngredients";
import { RecipeViewSteps } from "./recipeViewSteps";
import { RecipeViewTime } from "./recipeViewTime";

export class RecipeViewPage {
  static readonly headerSelector = "[data-test='recipes-list-header']";
  static readonly listSelector = "[data-test='recipes-list']";
  static readonly recipeNotFoundContentSelector = "[data-test='recipe-not-found-content']";

  constructor(readonly page: Page) {}

  get header() {
    return new RecipeViewHeader(this.page);
  }

  get ingredients() {
    return new RecipeViewIngredients(this.page);
  }

  get steps() {
    return new RecipeViewSteps(this.page);
  }

  get time() {
    return new RecipeViewTime(this.page);
  }

  get recipeNotFoundContent() {
    return this.page.locator(RecipeViewPage.recipeNotFoundContentSelector);
  }

  goTo(recipeId: string) {
    return this.page.goto(`/recip-eat/recipe/${recipeId}`);
  }
}