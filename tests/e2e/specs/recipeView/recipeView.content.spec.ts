import { test, expect } from "@playwright/test";
import AxeBuilder from '@axe-core/playwright';
import { RecipeViewPage } from "../pageObjectModel/recipiesView/recipeViewPage";
import { IndexedDbHelper } from "../helpers/indexedDbHelper";
import { RecipeViewTime } from "../pageObjectModel/recipiesView/recipeViewTime";
import { RecipeViewIngredients } from "../pageObjectModel/recipiesView/recipeViewIngredients";
import { RecipeViewSteps } from "../pageObjectModel/recipiesView/recipeViewSteps";

test.describe("Recipe view - Content" , () => {
  test("should display non existing for non existing recipe", async ({ page }) => {
    const recipeViewPage = new RecipeViewPage(page);
    await recipeViewPage.goTo("non-existing-recipe-id");

    await recipeViewPage.recipeNotFoundContent.waitFor();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .include(RecipeViewPage.recipeNotFoundContentSelector)
      .analyze();

    await expect(recipeViewPage.recipeNotFoundContent).toBeVisible();
    expect(accessibilityScanResults.violations).toEqual([]);
    expect(recipeViewPage.recipeNotFoundContent).toHaveText("This recipe doesn't exist!");
    await expect(recipeViewPage.recipeNotFoundContent).toMatchAriaSnapshot();
    await expect(recipeViewPage.recipeNotFoundContent).toHaveScreenshot();
  });

  test("should display the time section", async ({ page }) => {
    const recipeId = "6daf90b4-264b-4cd1-b76d-102bdbe172f4";
    const recipeName = "Recipe test";
    const recipeViewPage = new RecipeViewPage(page);
    await recipeViewPage.goTo(recipeId);

    const indexedDbHelper = new IndexedDbHelper(page, "recipiesDB", "recipes");
    await indexedDbHelper.cleanAllObjectStores();
    await indexedDbHelper.addItems([
      { id: recipeId, title: recipeName, preparationTimeMinutes: 10, cookingTimeMinutes: 20 }
    ]);
    await page.reload();

    const timeContent = recipeViewPage.time;
    await timeContent.root.waitFor();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .include(RecipeViewTime.rootSelector)
      .analyze();

    await expect(timeContent.root).toBeVisible();
    expect(accessibilityScanResults.violations).toEqual([]);
    expect(timeContent.preparationTimeContent).toContainText("10 minutes");
    expect(timeContent.cookingTimeContent).toContainText("20 minutes");
    await expect(timeContent.root).toMatchAriaSnapshot();
    await expect(timeContent.root).toHaveScreenshot();
  });

  test("should display the ingredients section", async ({ page }) => {
    const recipeId = "6daf90b4-264b-4cd1-b76d-102bdbe172f4";
    const recipeName = "Recipe test";
    const recipeViewPage = new RecipeViewPage(page);
    await recipeViewPage.goTo(recipeId);

    const indexedDbHelper = new IndexedDbHelper(page, "recipiesDB", "recipes");
    await indexedDbHelper.cleanAllObjectStores();
    await indexedDbHelper.addItems([
      { id: recipeId, title: recipeName, ingredients: [
        { ingredientId: "9d7290e4-d437-478b-bec4-9b2af4180cb6", quantity: 125 },
        { ingredientId: "aa2729bf-9436-4d63-8591-8827e7fe9760", quantity: 42 },
        { ingredientId: "c74bfdfb-89e1-4712-a0b6-a0e79b6da59f", quantity: 3 }
      ]}
    ]);
    await page.reload();

    const ingredientsContent = recipeViewPage.ingredients;
    await ingredientsContent.root.waitFor();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .include(RecipeViewIngredients.rootSelector)
      .analyze();

    await expect(ingredientsContent.root).toBeVisible();
    expect(accessibilityScanResults.violations).toEqual([]);
    expect(await ingredientsContent.ingredientListChildrenNumber).toEqual(3);
    expect(ingredientsContent.getIngredientEntry(0)).toHaveText("125 x ingredient.tomato");
    expect(ingredientsContent.getIngredientEntry(1)).toHaveText("42L ingredient.olive_oil");
    expect(ingredientsContent.getIngredientEntry(2)).toHaveText("3g ingredient.salt");
    await expect(ingredientsContent.root).toMatchAriaSnapshot();
    await expect(ingredientsContent.root).toHaveScreenshot();
  });

  test("should display the steps section", async ({ page }) => {
    const recipeId = "6daf90b4-264b-4cd1-b76d-102bdbe172f4";
    const recipeName = "Recipe test";
    const step1 = "test1";
    const step2 = "test2";
    const step3 = "test3";
    const recipeViewPage = new RecipeViewPage(page);
    await recipeViewPage.goTo(recipeId);

    const indexedDbHelper = new IndexedDbHelper(page, "recipiesDB", "recipes");
    await indexedDbHelper.cleanAllObjectStores();
    await indexedDbHelper.addItems([
      { id: recipeId, title: recipeName, steps: [
        step1,
        step2,
        step3
      ]}
    ]);
    await page.reload();

    const stepsContent = recipeViewPage.steps;
    await stepsContent.root.waitFor();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .include(RecipeViewSteps.rootSelector)
      .analyze();

    await expect(stepsContent.root).toBeVisible();
    expect(accessibilityScanResults.violations).toEqual([]);
    await expect(stepsContent.stepEntries).toHaveCount(3);
    expect(stepsContent.getStepEntry(0)).toHaveText(step1);
    expect(stepsContent.getStepEntry(1)).toHaveText(step2);
    expect(stepsContent.getStepEntry(2)).toHaveText(step3);
    await expect(stepsContent.root).toMatchAriaSnapshot();
    await expect(stepsContent.root).toHaveScreenshot();
  });
});