import { MenuItem } from "./MenuItem";
import { Logger } from "./Logger";

export class Fries implements MenuItem {
  name: string;
  private price: number;
  private size: string;

  constructor(size: string = "Regular", price: number = 2.49) {
    this.name = "Fries";
    this.size = size;
    this.price = price;
    Logger.getLogger().info(`Created ${size} Fries - $${price}`);
  }

  getPrice(): number {
    return this.price;
  }

  getDescription(): string {
    return `${this.size} Fries`;
  }
}
