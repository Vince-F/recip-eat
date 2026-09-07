import { Page } from "@playwright/test";

export class RecipeViewHeader {
  static readonly rootSelector = "[data-test='recipe-view-header']";
  constructor(readonly page: Page) {}

  get root() {
    return this.page.locator(RecipeViewHeader.rootSelector);
  }

  get backToRecipeListButton() {
    return this.root.locator("[data-test='back-to-recipe-list-button']");
  }

  get recipeTitle() {
    return this.root.locator("[data-test='recipe-title']");
  }

  get actionMenuButton() {
    return this.root.locator("[data-test='recipe-actions-menu-button']");
  }
}