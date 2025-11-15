import { MenuItem } from "../models/MenuItem";

export abstract class BurgerDecorator implements MenuItem {
  /**
   * The wrapped MenuItem (can be a Burger or another Decorator)
   * This creates the decorator chain
   */
  protected wrappedItem: MenuItem;

  constructor(item: MenuItem) {
    this.wrappedItem = item;
  }


  // concrete decorators will override to add their name
  get name(): string | null {
    return this.wrappedItem.name;
  }

  /**
   * Abstract methods that concrete decorators must implement
   * Each decorator adds its own price/description to the wrapped item
   */
  abstract getPrice(): number;
  abstract getDescription(): string;
}
