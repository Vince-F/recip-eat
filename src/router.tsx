import { createBrowserRouter, useLoaderData } from "react-router";
import { ReceipesList } from "./components/receipesList/ReceipesList";
import type { Recipe } from "./models/recipe";
import { RecipeView } from "./components/recipeView/RecipeView";
import { RecipeForm } from "./components/recipeForm/RecipeForm";
import { appBaseUrl } from "./constants";
import { store } from "./stores/store";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: ReceipesList,
  },
  {
    path: "/recipe/:id",
    loader: async ({ params }) => {
      const id = params.id;
      const { recipes } = store.getState().recipe;
      return recipes.find(r => r.id === id);
    },
    Component: () => {
      const recipe = useLoaderData() as Recipe;
      return <RecipeView recipe={recipe} />;
    },
  },
  {
    path: "/create-recipe",
    Component: RecipeForm,
  },
], { basename: appBaseUrl });
