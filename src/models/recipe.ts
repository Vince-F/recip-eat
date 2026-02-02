export interface Recipe {
  id: string;
  title: string;
  image: string;
  preparationTimeMinutes: number;
  cookingTimeMinutes: number;
  ingredients: Array<{
    ingredientId: string;
    quantity: number;
  }>;
  steps: string[];
}
