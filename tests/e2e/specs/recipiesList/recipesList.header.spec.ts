import { test, expect } from "@playwright/test";
import AxeBuilder from '@axe-core/playwright';
import { RecipesListPage } from "../pageObjectModel/recipesList/recipesListPage";

test.describe("Recipes list - Header" , () => {
  test("should display the header", async ({ page }) => {
    const recipesListPage = new RecipesListPage(page);
    await recipesListPage.goTo();

    const header = recipesListPage.header;
    await header.waitFor();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .include(RecipesListPage.headerSelector)
      .analyze();

    await expect(header).toBeVisible();
    await expect(accessibilityScanResults.violations).toEqual([]);
    await expect(header).toMatchAriaSnapshot();
    await expect(header).toHaveScreenshot();
  });
});