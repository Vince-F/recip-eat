import {
  asyncThunkCreator,
  buildCreateSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import type { Recipe } from "../models/recipe";
import type { RootState } from "./store";
import {
  addItem,
  deleteItem,
  openDatabase,
  readAll,
  RECIPE_OBJECT_STORE_NAME,
} from "../services/databaseManager";

export const retrieveRecipes = createAsyncThunk(
  "recipe/retrieveRecipes",
  async () => {
    await openDatabase();
    return await readAll<Recipe>(RECIPE_OBJECT_STORE_NAME);
  },
);

export const addRecipe = createAsyncThunk(
  "recipe/addRecipe",
  async (recipe: Recipe) => {
    await openDatabase();
    await addItem<Recipe>(RECIPE_OBJECT_STORE_NAME, recipe);
    return recipe;
  },
);

export const deleteRecipe = createAsyncThunk(
  "recipe/deleteRecipe",
  async (recipeId: string) => {
    await openDatabase();
    await deleteItem(RECIPE_OBJECT_STORE_NAME, recipeId);
    return recipeId;
  },
);

export const RecipeSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
})({
  name: "recipe",
  initialState: {
    recipes: [] as Array<Recipe>,
    loading: false,
    loaded: false,
    error: null as string | null,
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(retrieveRecipes.pending, (state) => {
        state.loading = true;
      })
      .addCase(retrieveRecipes.fulfilled, (state, action) => {
        state.recipes = action.payload;
        state.loading = false;
        state.loaded = true;
      })
      .addCase(retrieveRecipes.rejected, (state, action) => {
        state.error = action.error.message ?? "Failed to retrieve recipes";
        state.loading = false;
      })
      .addCase(addRecipe.fulfilled, (state, action) => {
        state.recipes.push(action.payload);
      })
      .addCase(deleteRecipe.fulfilled, (state, action) => {
        state.recipes = state.recipes.filter((r) => r.id !== action.payload);
      });
  },
});

export const selectRecipes = (state: RootState) => state.recipe.recipes;
export const selectNeedsLoading = (state: RootState) =>
  state.recipe.loaded === false && state.recipe.loading === false;
