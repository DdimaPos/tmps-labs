import { BurgerDecorator } from "./BurgerDecorator";
import { MenuItem } from "../models/MenuItem";
import { Logger } from "../models/Logger";

export class AvocadoDecorator extends BurgerDecorator {
  private readonly AVOCADO_PRICE = 1.5;

  constructor(item: MenuItem) {
    super(item);
    Logger.getLogger().info("Added Avocado decorator (+$1.50)");
  }

  getPrice(): number {
    return this.wrappedItem.getPrice() + this.AVOCADO_PRICE;
  }

  getDescription(): string {
    return this.wrappedItem.getDescription() + ", +Fresh Avocado";
  }
}
