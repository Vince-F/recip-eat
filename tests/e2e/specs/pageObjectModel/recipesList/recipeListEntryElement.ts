import { type Page } from "@playwright/test";

export class RecipeListEntryElement {
  constructor(readonly page: Page, readonly recipeId: string) {}

  get root() {
    return this.page.locator(`[data-test='recipe-entry-${this.recipeId}']`);
  }

  get name() {
    return this.root.locator("[data-test='recipe-name']");
  }

  get selectButton() {
    return this.root.locator("[data-test='select-recipe-button']");
  }

  get actionsMenuButton() {
    return this.root.locator("[data-test='recipe-actions-menu-button']");
  }
}