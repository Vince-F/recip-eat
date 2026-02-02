import { createBrowserRouter, useLoaderData } from "react-router";
import { ReceipesList } from "./components/receipesList/ReceipesList";
import type { Recipe } from "./models/recipe";
import { RecipeView } from "./components/recipeView/RecipeView";
import { RecipeForm } from "./components/recipeForm/RecipeForm";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: ReceipesList,
  },
  {
    path: "/recipe/:id",
    loader: async ({ params }) => {
      // TODO : load recipe by id
      const id = params.id;
      const recipe: Recipe = {
        id: id ?? "1",
        title: "Recipe router",
        image: "https://placehold.co/600x400",
        preparationTimeMinutes: 15,
        cookingTimeMinutes: 30,
        ingredients: [
          {
            ingredientId: "0d948155-bfbe-4223-8f4e-e96580dd5ffb",
            quantity: 0.1,
          },
          {
            ingredientId: "f4e1d2b3-E3b5-4c6c-8f7a-9d6e2c3b4a5f",
            quantity: 200,
          },
          { ingredientId: "d2ba352d-9018-4200-aa29-4421027abbbd", quantity: 2 },
        ],
        steps: ["Step 1", "Step 2", "Step 3"],
      };
      return recipe;
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
]);
