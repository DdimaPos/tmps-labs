import { BurgerDecorator } from "./BurgerDecorator";
import { MenuItem } from "../models/MenuItem";
import { Logger } from "../models/Logger";

export class BaconDecorator extends BurgerDecorator {
  private readonly BACON_PRICE = 2.0;

  constructor(item: MenuItem) {
    super(item);
    Logger.getLogger().info("Added Bacon decorator (+$2.00)");
  }

  getPrice(): number {
    return this.wrappedItem.getPrice() + this.BACON_PRICE;
  }

  getDescription(): string {
    return this.wrappedItem.getDescription() + ", +Extra Bacon";
  }
}
