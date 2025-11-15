import { MenuItem } from "./MenuItem";
import { Logger } from "./Logger";

export class Drink implements MenuItem {
  name: string;
  private price: number;
  private size: string;
  private type: string;

  constructor(type: string = "Coke", size: string = "Medium", price?: number) {
    this.name = "Drink";
    this.type = type;
    this.size = size;

    // price varies by size
    if (price) {
      this.price = price;
    } else {
      this.price = size === "Large" ? 2.49 : size === "Medium" ? 1.99 : 1.49;
    }

    Logger.getLogger().info(`Created ${size} ${type} - $${this.price}`);
  }

  getPrice(): number {
    return this.price;
  }

  getDescription(): string {
    return `${this.size} ${this.type}`;
  }
}
