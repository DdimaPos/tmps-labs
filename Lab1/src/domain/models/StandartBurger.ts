import { Logger } from "../models/Logger";
import { Burger } from "./Burger";

export class StandartBurger implements Burger {
  name: string | null = null;
  price: number | null = 0;
  meatType: string | null = null;
  cheeseSlices: number = 0;
  ingredients: Set<string>;
  restaurantName: string;

  constructor(name?: string, restaurantName?: string) {
    this.name = name || null;
    this.restaurantName = restaurantName || '';
    this.ingredients = new Set<string>();
    Logger.getLogger().info(`New burger created in the ${restaurantName || "default"} restaurant`)
  }

  clone(): StandartBurger {
    const clone = structuredClone(this)
    Logger.getLogger().info(`Cloned ${this.name} burger`)
    return clone;
  }
}
