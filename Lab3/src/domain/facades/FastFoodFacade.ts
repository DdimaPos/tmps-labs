import { Burger } from "../models/Burger";
import { MenuItem } from "../models/MenuItem";
import { MealCombo } from "../models/MealCombo";
import { Fries } from "../models/Fries";
import { Drink } from "../models/Drink";
import { FastFoodFactory } from "../factories/FastFoodFactory";
import { McDonaldsFactory } from "../factories/McDonaldsFactory";
import { KFCFactory } from "../factories/KFCFactory";
import { BurgerBuilder } from "../builders/BurgerBuilder";
import { BurgerDirector } from "../directors/BurgerDirector";
import { Logger } from "../models/Logger";

export class FastFoodFacade {
  private factories: Map<string, FastFoodFactory>;
  private logger: Logger;

  constructor() {
    this.factories = new Map([
      ["McDonalds", new McDonaldsFactory()],
      ["KFC", new KFCFactory()],
    ]);
    this.logger = Logger.getLogger();
    this.logger.info("FastFoodFacade initialized - Simplified ordering interface ready");
  }

  /*
    Order a standard burger from a restaurant
    Simplifies: factory creation + createBurger()
   */
  orderStandardBurger(restaurant: string): Burger {
    this.logger.info(`Ordering standard burger from ${restaurant}`);

    const factory = this.getFactory(restaurant);
    return factory.createBurger();
  }

  // simplifies: factory + createBurger + clone + builder + addIngredients + build
  orderCustomBurger(restaurant: string, extraIngredients: string[]): Burger {
    this.logger.info(
      `Ordering custom burger from ${restaurant} with extras: ${extraIngredients.join(", ")}`
    );

    // complex workflow hidden from client:
    const factory = this.getFactory(restaurant);
    const baseBurger = factory.createBurger();
    const cloned = baseBurger.clone(); // Preserve original
    const builder = new BurgerBuilder(cloned);

    extraIngredients.forEach((ingredient) =>
      builder.addIngredient(ingredient)
    );

    return builder.build();
  }


  // simplifies: factory + createBurger + clone + builder + director + createPreset
  orderPresetBurger(
    restaurant: string,
    presetType: "vegan" | "spicy" | "classic"
  ): Burger {
    this.logger.info(`Ordering ${presetType} burger from ${restaurant}`);

    const factory = this.getFactory(restaurant);
    const baseBurger = factory.createBurger();
    const builder = new BurgerBuilder(baseBurger.clone());
    const director = new BurgerDirector(builder);

    // Use director to create preset configurations
    switch (presetType) {
      case "vegan":
        return director.createVeganBurger();
      case "spicy":
        return director.createSpicyBurger();
      case "classic":
        return director.createClassicBurger();
      default:
        throw new Error(`Unknown preset type: ${presetType}`);
    }
  }

  // simplifies: creating multiple items + MealCombo + adding items
  createComboMeal(
    burger: MenuItem,
    friesSize?: "Small" | "Regular" | "Large",
    drinkSize?: "Small" | "Medium" | "Large",
    drinkType?: string
  ): MealCombo {
    this.logger.info("Creating combo meal");

    const combo = new MealCombo("Value Meal");
    combo.add(burger);

    // Add fries if requested
    if (friesSize) {
      const friesPrice =
        friesSize === "Large" ? 3.49 : friesSize === "Regular" ? 2.49 : 1.99;
      combo.add(new Fries(friesSize, friesPrice));
    }

    // Add drink if requested
    if (drinkSize) {
      combo.add(new Drink(drinkType || "Coke", drinkSize));
    }

    return combo;
  }

  // ultimate simplification - entire meal in one method
  orderQuickMeal(
    restaurant: string,
    includeFries: boolean = true,
    includeDrink: boolean = true
  ): MealCombo {
    this.logger.info(`Quick meal order from ${restaurant}`);

    const burger = this.orderStandardBurger(restaurant);

    return this.createComboMeal(
      burger,
      includeFries ? "Regular" : undefined,
      includeDrink ? "Medium" : undefined
    );
  }

  getAvailableRestaurants(): string[] {
    return Array.from(this.factories.keys());
  }

  private getFactory(restaurant: string): FastFoodFactory {
    const factory = this.factories.get(restaurant);
    if (!factory) {
      throw new Error(
        `Restaurant "${restaurant}" not found. Available: ${this.getAvailableRestaurants().join(", ")}`
      );
    }
    return factory;
  }
}
