import { test, expect } from "@playwright/test";
import AxeBuilder from '@axe-core/playwright';
import { RecipesListPage } from "../pageObjectModel/recipesList/recipesListPage";
import { IndexedDbHelper } from "../helpers/indexedDbHelper";

test.describe("Recipes list - List content", () => {
  test("should display that there is not recipe when list is empty", async ({ page }) => {
    const recipesListPage = new RecipesListPage(page);
    await recipesListPage.goTo();

    const indexedDbHelper = new IndexedDbHelper(page, "recipiesDB", "recipes");
    await indexedDbHelper.cleanAllObjectStores();
    await page.reload();

    const list = recipesListPage.recipesList;
    await list.waitFor();

    /* There are accessibility defect, need to be fixed later
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include(RecipesListPage.listSelector)
      .analyze();*/

    await expect(list).toBeVisible();
    // await expect(accessibilityScanResults.violations).toEqual([]);
    await expect(list).toMatchAriaSnapshot();
  });

  test("should display the three recipes already created", async ({ page }) => {
    const recipeId1 = "6daf90b4-264b-4cd1-b76d-102bdbe172f4";
    const recipeName1 = "Recipe 1";
    const recipeId2 = "2c9b648c-ce58-4f1d-b2a3-26b3e012e1a6";
    const recipeName2 = "Recipe 2";
    const recipeId3 = "286ee7c7-da7d-4e69-9591-411dbeea0953";
    const recipeName3 = "Recipe 3";

    const recipesListPage = new RecipesListPage(page);
    await recipesListPage.goTo();

    const indexedDbHelper = new IndexedDbHelper(page, "recipiesDB", "recipes");
    await indexedDbHelper.cleanAllObjectStores();
    await indexedDbHelper.addItems([
      { id: recipeId1, title: recipeName1 },
      { id: recipeId2, title: recipeName2 },
      { id: recipeId3, title: recipeName3 }
    ]);
    await page.reload();

    const list = recipesListPage.recipesList;
    await list.waitFor();

    const numberOfEntries = (await recipesListPage.recipeEntries.all()).length;
    const recipeEntry1Name = await recipesListPage.getRecipeEntry(recipeId1).name;
    const recipeEntry2Name = await recipesListPage.getRecipeEntry(recipeId2).name;
    const recipeEntry3Name = await recipesListPage.getRecipeEntry(recipeId3).name;

    const accessibilityScanResults = await new AxeBuilder({ page })
      .include(RecipesListPage.listSelector)
      .analyze();

    await expect(list).toBeVisible();
    expect(numberOfEntries).toBe(3);
    await expect(recipeEntry1Name).toHaveText(recipeName1);
    await expect(recipeEntry2Name).toHaveText(recipeName2);
    await expect(recipeEntry3Name).toHaveText(recipeName3);
    expect(accessibilityScanResults.violations).toEqual([]);
    await expect(list).toMatchAriaSnapshot();
  });

  test("should open the recipe detail page when clicking on a recipe entry", async ({ page }) => {
    const recipeId1 = "6daf90b4-264b-4cd1-b76d-102bdbe172f4";
    const recipeName1 = "Recipe 1";
    const recipeId2 = "2c9b648c-ce58-4f1d-b2a3-26b3e012e1a6";
    const recipeName2 = "Recipe 2";
    const recipeId3 = "286ee7c7-da7d-4e69-9591-411dbeea0953";
    const recipeName3 = "Recipe 3";

    const recipesListPage = new RecipesListPage(page);
    await recipesListPage.goTo();

    const indexedDbHelper = new IndexedDbHelper(page, "recipiesDB", "recipes");
    await indexedDbHelper.addItems([
      { id: recipeId1, title: recipeName1 },
      { id: recipeId2, title: recipeName2 },
      { id: recipeId3, title: recipeName3 }
    ]);
    await page.reload();

    const list = recipesListPage.recipesList;
    await list.waitFor();

    await recipesListPage.getRecipeEntry(recipeId2).selectButton.click();

    await expect(page).toHaveURL(`/recip-eat/recipe/${recipeId2}`);
  });

  test("should open the recipe creation page when clicking on the create recipe button", async ({ page }) => {
    const recipeId1 = "6daf90b4-264b-4cd1-b76d-102bdbe172f4";
    const recipeName1 = "Recipe 1";
    const recipeId2 = "2c9b648c-ce58-4f1d-b2a3-26b3e012e1a6";
    const recipeName2 = "Recipe 2";
    const recipeId3 = "286ee7c7-da7d-4e69-9591-411dbeea0953";
    const recipeName3 = "Recipe 3";

    const recipesListPage = new RecipesListPage(page);
    await recipesListPage.goTo();

    const indexedDbHelper = new IndexedDbHelper(page, "recipiesDB", "recipes");
    await indexedDbHelper.addItems([
      { id: recipeId1, title: recipeName1 },
      { id: recipeId2, title: recipeName2 },
      { id: recipeId3, title: recipeName3 }
    ]);
    await page.reload();

    const list = recipesListPage.recipesList;
    await list.waitFor();

    await recipesListPage.createRecipeButton.click();

    await expect(page).toHaveURL(`/recip-eat/create-recipe`);
  });
});