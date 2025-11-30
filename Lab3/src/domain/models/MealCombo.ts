import { MenuItem } from "./MenuItem";
import { Logger } from "./Logger";

export class MealCombo implements MenuItem {
  name: string;
  private items: MenuItem[] = [];

  constructor(name: string) {
    this.name = name;
    Logger.getLogger().info(`Created meal combo: ${name}`);
  }

  add(item: MenuItem): void {
    this.items.push(item);
    Logger.getLogger().info(`Added ${item.getDescription()} to ${this.name}`);
  }

  remove(item: MenuItem): void {
    const index = this.items.indexOf(item);
    if (index > -1) {
      this.items.splice(index, 1);
      Logger.getLogger().info(`Removed ${item.getDescription()} from ${this.name}`);
    }
  }

  getItems(): MenuItem[] {
    return structuredClone(this.items);
  }

  getPrice(): number {
    return this.items.reduce((total, item) => total + item.getPrice(), 0);
  }

  getDescription(): string {
    if (this.items.length === 0) {
      return `${this.name} (empty)`;
    }

    const itemDescriptions = this.items
      .map(item => item.getDescription())
      .join(', ');

    return `${this.name} [${itemDescriptions}]`;
  }

  getItemCount(): number {
    return this.items.length;
  }
}
