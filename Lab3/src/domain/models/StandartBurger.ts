import { Logger } from "../models/Logger";
import { Burger } from "./Burger";

export class StandartBurger implements Burger {
  name: string | null = null;
  price: number | null = 0;
  meatType: string | null = null;
  cheeseSlices: number = 0;
  ingredients: Set<string>;
  restaurantName: string;

  constructor(name?: string, restaurantName?: string, price?: number) {
    this.name = name || null;
    this.restaurantName = restaurantName || '';
    this.price = price || 5.99; // Default burger price
    this.ingredients = new Set<string>();
    Logger.getLogger().info(`New burger created in the ${restaurantName || "default"} restaurant`)
  }

  getPrice(): number {
    return this.price || 0;
  }

  getDescription(): string {
    const ingredientsList = Array.from(this.ingredients).join(', ');
    const meatInfo = this.meatType ? ` with ${this.meatType}` : ' (no meat)';
    const ingredientsInfo = ingredientsList ? ` - Ingredients: ${ingredientsList}` : '';

    return `${this.name || 'Custom Burger'} from ${this.restaurantName}${meatInfo}${ingredientsInfo}`;
  }

  clone(): StandartBurger {
    const cloned = new StandartBurger(this.name || undefined, this.restaurantName, this.price || undefined);
    cloned.meatType = this.meatType;
    cloned.cheeseSlices = this.cheeseSlices;
    cloned.ingredients = new Set(this.ingredients);
    Logger.getLogger().info(`Cloned ${this.name} burger`)
    return cloned;
  }
}
