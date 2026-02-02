import ingredients from "../assets/ingredients.json";
import type { Ingredient } from "../models/ingredient";

const cachedFoundIngredients: Map<string, Ingredient> = new Map();

export const allIngredients: Ingredient[] = ingredients as Ingredient[];

export function getIngredientById(id: string): Ingredient | undefined {
  if (cachedFoundIngredients.has(id)) {
    return cachedFoundIngredients.get(id);
  }
  const result = (ingredients.find(ingredient => ingredient.id === id)) as Ingredient | undefined;
  if (result) {
    cachedFoundIngredients.set(id, result);
  }
  return result;
}

export function findIngredientsMatching(query: string): Ingredient[] {
  // TODO we should use translated key here
  return (ingredients as Ingredient[]).filter(ingredient =>
    ingredient.key
      .replace("ingredient.", "")
      .toLowerCase()
      .includes(query.toLowerCase())
  );
}