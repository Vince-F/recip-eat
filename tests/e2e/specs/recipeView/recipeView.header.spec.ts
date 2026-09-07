import { test, expect } from "@playwright/test";
import AxeBuilder from '@axe-core/playwright';
import { RecipeViewPage } from "../pageObjectModel/recipiesView/recipeViewPage";
import { RecipeViewHeader } from "../pageObjectModel/recipiesView/recipeViewHeader";
import { IndexedDbHelper } from "../helpers/indexedDbHelper";

test.describe("Recipe view - Header" , () => {
  test("should display non existing for non existing recipe without action menu", async ({ page }) => {
    const recipeViewPage = new RecipeViewPage(page);
    await recipeViewPage.goTo("non-existing-recipe-id");

    const header = recipeViewPage.header;
    await header.root.waitFor();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .include(RecipeViewHeader.rootSelector)
      .analyze();

    await expect(header.root).toBeVisible();
    expect(accessibilityScanResults.violations).toEqual([]);
    expect(header.recipeTitle).toHaveText("Recipe not found");
    expect(header.actionMenuButton).toHaveCount(0);
    await expect(header.root).toMatchAriaSnapshot();
    await expect(header.root).toHaveScreenshot();
  });

  test("should display the title of the recipe with the action menu", async ({ page }) => {
    const recipeId = "6daf90b4-264b-4cd1-b76d-102bdbe172f4";
    const recipeName = "Recipe test";
    const recipeViewPage = new RecipeViewPage(page);
    await recipeViewPage.goTo(recipeId);

    const indexedDbHelper = new IndexedDbHelper(page, "recipiesDB", "recipes");
    await indexedDbHelper.cleanAllObjectStores();
    await indexedDbHelper.addItems([
      { id: recipeId, title: recipeName }
    ]);
    await page.reload();

    const header = recipeViewPage.header;
    await header.root.waitFor();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .include(RecipeViewHeader.rootSelector)
      .analyze();

    await expect(header.root).toBeVisible();
    expect(accessibilityScanResults.violations).toEqual([]);
    expect(header.recipeTitle).toHaveText(recipeName);
    expect(header.actionMenuButton).toHaveCount(1);
    await expect(header.root).toMatchAriaSnapshot();
    await expect(header.root).toHaveScreenshot();
  });

  test("should go back to the recipe list when clicking on the back button", async ({ page }) => {
    const recipeId = "6daf90b4-264b-4cd1-b76d-102bdbe172f4";
    const recipeName = "Recipe test";
    const recipeViewPage = new RecipeViewPage(page);
    await recipeViewPage.goTo(recipeId);

    const indexedDbHelper = new IndexedDbHelper(page, "recipiesDB", "recipes");
    await indexedDbHelper.cleanAllObjectStores();
    await indexedDbHelper.addItems([
      { id: recipeId, title: recipeName }
    ]);
    await page.reload();

    const header = recipeViewPage.header;
    await header.root.waitFor();
    await header.backToRecipeListButton.click();

    await expect(page).toHaveURL("/recip-eat/");
  });
});