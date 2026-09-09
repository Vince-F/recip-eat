import { createBrowserRouter, useLoaderData } from "react-router";
import { RecipesList } from "./components/recipesList/RecipesList";
import type { Recipe } from "./models/recipe";
import { RecipeView } from "./components/recipeView/RecipeView";
import { RecipeForm } from "./components/recipeForm/RecipeForm";
import { appBaseUrl } from "./constants";
import { store } from "./stores/store";
import { retrieveRecipes } from "./stores/recipeSlice";

async function loadRecipesIfNeeded() {
  const { loaded } = store.getState().recipe;
  if (!loaded) {
    await store.dispatch(retrieveRecipes());
  }
}

export const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: RecipesList,
    },
    {
      path: "/recipe/:id",
      loader: async ({ params }) => {
        await loadRecipesIfNeeded();
        const id = params.id;
        const { recipes } = store.getState().recipe;
        return recipes.find((r) => r.id === id);
      },
      Component: () => {
        const recipe = useLoaderData() as Recipe;
        return <RecipeView recipe={recipe} />;
      },
    },
    {
      path: "/create-recipe",
      loader: async () => {
        await loadRecipesIfNeeded();
        const { recipes } = store.getState().recipe;
        return recipes;
      },
      Component: RecipeForm,
    },
  ],
  { basename: appBaseUrl },
);
