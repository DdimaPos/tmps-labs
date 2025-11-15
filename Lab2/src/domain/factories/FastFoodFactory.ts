import { Burger } from "../models/Burger";

export abstract class FastFoodFactory {
  abstract createBurger(): Burger;
}
