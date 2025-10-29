export interface Burger extends Clonable<Burger> {
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
