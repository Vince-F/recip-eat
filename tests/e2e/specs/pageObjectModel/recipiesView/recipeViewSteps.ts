import { Page } from "@playwright/test";

export class RecipeViewSteps {
  static readonly rootSelector = "[data-test='recipe-steps-content']";
  constructor(readonly page: Page) {}

  get root() {
    return this.page.locator(RecipeViewSteps.rootSelector);
  }

  get stepList() {
    return this.root.locator("[data-test='recipe-steps-list']");
  }

  get stepEntries() {
    return this.stepList.locator("[data-test^='recipe-step-']");
  }

  getStepEntry(index: number) {
    return this.root.locator(`[data-test='recipe-step-${index}']`);
  }
}