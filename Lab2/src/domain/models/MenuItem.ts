/**
 * MenuItem Interface
 *
 * Part of the Composite Pattern - defines the common interface for all menu items
 * (individual items like Burger, Fries, Drink) and composite items (MealCombo)
 */
export interface MenuItem {
  name: string | null;

  getPrice(): number;
  getDescription(): string;
}
