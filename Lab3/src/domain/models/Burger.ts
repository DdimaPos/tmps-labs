import { MenuItem } from "./MenuItem";

export interface Burger extends MenuItem, Clonable<Burger> {
  name: string | null;
  price: number | null;
  meatType: string | null;
  cheeseSlices: number;
  ingredients: Set<string>;
  restaurantName: string;
}

interface Clonable<T> {
  clone(): T;
}
