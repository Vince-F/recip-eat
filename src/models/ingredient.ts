import type { QuantityType } from "./quantityType";

export interface Ingredient {
  id: string;
  key: string;
  image: string;
  quantityType: QuantityType;
}
