import { BurgerDecorator } from "./BurgerDecorator";
import { MenuItem } from "../models/MenuItem";
import { Logger } from "../models/Logger";

export class PremiumCheeseDecorator extends BurgerDecorator {
  private readonly CHEESE_PRICE = 1.0;
  private cheeseType: string;

  constructor(item: MenuItem, cheeseType: string = "Cheddar") {
    super(item);
    this.cheeseType = cheeseType;
    Logger.getLogger().info(`Added ${cheeseType} Cheese decorator (+$1.00)`);
  }

  getPrice(): number {
    return this.wrappedItem.getPrice() + this.CHEESE_PRICE;
  }

  getDescription(): string {
    return this.wrappedItem.getDescription() + `, +Premium ${this.cheeseType} Cheese`;
  }
}
