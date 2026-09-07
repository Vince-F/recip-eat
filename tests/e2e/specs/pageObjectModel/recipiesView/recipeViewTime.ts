import { Page } from "@playwright/test";

export class RecipeViewTime {
  static readonly rootSelector = "[data-test='recipe-time-content']";
  constructor(readonly page: Page) {}

  get root() {
    return this.page.locator(RecipeViewTime.rootSelector);
  }

  get preparationTimeContent() {
    return this.root.locator("[data-test='recipe-preparation-time-content']");
  }

  get cookingTimeContent() {
    return this.root.locator("[data-test='recipe-cooking-time-content']");
  }
}