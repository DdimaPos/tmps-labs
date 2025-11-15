import { Logger } from "../domain/models/Logger";
import { FastFoodFacade } from "../domain/facades/FastFoodFacade";
import { BaconDecorator } from "../domain/decorators/BaconDecorator";
import { AvocadoDecorator } from "../domain/decorators/AvocadoDecorator";
import { PremiumCheeseDecorator } from "../domain/decorators/PremiumCheeseDecorator";
import { MenuItem } from "../domain/models/MenuItem";
import { MealCombo } from "../domain/models/MealCombo";
import { Fries } from "../domain/models/Fries";
import { Drink } from "../domain/models/Drink";

/**
 * - Facade (FastFoodFacade) - Simplifies ordering workflow
 * - Decorator (BaconDecorator, etc.) - Dynamically adds premium toppings
 * - Composite (MealCombo) - Creates meal combos as tree structures
 */
class Application {
  public static main() {
    const logger = Logger.getLogger();

    console.log("\n" + "=".repeat(70));
    console.log("FAST FOOD AGGREGATOR SYSTEM - Lab 2: Structural Patterns");
    console.log("=".repeat(70) + "\n");

    const facade = new FastFoodFacade();

    // ========================================================================
    // 1: FACADE PATTERN - Simplified Ordering
    // ========================================================================
    console.log("\n 1: FACADE PATTERN - Simplified Ordering");
    console.log("-".repeat(70));

    const standardBurger = facade.orderStandardBurger("McDonalds");
    console.log(`Ordered: ${standardBurger.getDescription()}`);
    console.log(`Price: $${standardBurger.getPrice().toFixed(2)}`);
    console.log();

    // Custom burger with extra ingredients
    const customBurger = facade.orderCustomBurger("KFC", [
      "extra cheese",
      "jalapeños",
    ]);
    console.log(`Ordered: ${customBurger.getDescription()}`);
    console.log(`Price: $${customBurger.getPrice().toFixed(2)}`);
    console.log();

    // Preset burger using Director
    const veganBurger = facade.orderPresetBurger("McDonalds", "vegan");
    console.log(`Ordered: ${veganBurger.getDescription()}`);
    console.log(`Price: $${veganBurger.getPrice().toFixed(2)}`);

    // ========================================================================
    // DEMO 2: DECORATOR PATTERN - Premium Toppings
    // ========================================================================
    console.log("\n\n2: DECORATOR PATTERN - Premium Toppings");
    console.log("-".repeat(70));
    console.log("Add premium extras dynamically without modifying burger classes");
    console.log();

    // Start with a standard burger
    let premiumBurger: MenuItem = facade.orderStandardBurger("McDonalds");
    console.log(`Base burger: ${premiumBurger.getDescription()}`);
    console.log(`Price: $${premiumBurger.getPrice().toFixed(2)}`);
    console.log();

    // Wrap it with decorators - each adding price and description
    console.log("Adding premium toppings...");
    premiumBurger = new BaconDecorator(premiumBurger);
    console.log(`+ Bacon: ${premiumBurger.getDescription()}`);
    console.log(`  Price: $${premiumBurger.getPrice().toFixed(2)}`);

    premiumBurger = new AvocadoDecorator(premiumBurger);
    console.log(`+ Avocado: ${premiumBurger.getDescription()}`);
    console.log(`  Price: $${premiumBurger.getPrice().toFixed(2)}`);

    premiumBurger = new PremiumCheeseDecorator(premiumBurger, "Swiss");
    console.log(`+ Swiss Cheese: ${premiumBurger.getDescription()}`);
    console.log(`  Price: $${premiumBurger.getPrice().toFixed(2)}`);
    console.log();

    console.log("  Final Premium Burger:");
    console.log(`   ${premiumBurger.getDescription()}`);
    console.log(`   💰 Total: $${premiumBurger.getPrice().toFixed(2)}`);

    // ========================================================================
    // DEMO 3: COMPOSITE PATTERN - Meal Combos
    // ========================================================================
    console.log("\n\nDEMO 3: COMPOSITE PATTERN - Meal Combos");
    console.log("-".repeat(70));
    console.log("Treat individual items and combos uniformly");
    console.log();

    // Create a combo manually to show the pattern
    const manualCombo = new MealCombo("Premium BigMac Meal");

    // Add items one by one - demonstrating uniform interface
    const bigMac = facade.orderStandardBurger("McDonalds");
    manualCombo.add(bigMac);
    manualCombo.add(new Fries("Large", 3.49));
    manualCombo.add(new Drink("Coke", "Large"));

    console.log("Manual combo creation:");
    console.log(`${manualCombo.getDescription()}`);
    console.log(`Total Price: $${manualCombo.getPrice().toFixed(2)}`);
    console.log(`Item Count: ${manualCombo.getItemCount()}`);
    console.log();

    // Use Facade to create a combo quickly
    const quickCombo = facade.orderQuickMeal("KFC", true, true);
    console.log("Quick combo via Facade:");
    console.log(`${quickCombo.getDescription()}`);
    console.log(`Total Price: $${quickCombo.getPrice().toFixed(2)}`);

    // ========================================================================
    // DEMO 4: ALL PATTERNS COMBINED - Ultimate Order
    // ========================================================================
    console.log("\n\n4: ALL PATTERNS COMBINED");
    console.log("-".repeat(70));
    console.log("Facade + Decorator + Composite working together!");
    console.log();

    // Use Facade to order a custom burger
    let deluxeBurger: MenuItem = facade.orderCustomBurger("McDonalds", [
      "pickles",
      "onions",
    ]);

    // Enhance with Decorators
    deluxeBurger = new BaconDecorator(deluxeBurger);
    deluxeBurger = new AvocadoDecorator(deluxeBurger);

    // Create Composite meal
    const ultimateCombo = new MealCombo("Ultimate Deluxe Meal");
    ultimateCombo.add(deluxeBurger);
    ultimateCombo.add(new Fries("Large", 3.49));
    ultimateCombo.add(new Drink("Sprite", "Medium"));

    console.log("  Ultimate Deluxe Meal:");
    console.log(`   ${ultimateCombo.getDescription()}`);
    console.log(`     Total: $${ultimateCombo.getPrice().toFixed(2)}`);
    console.log();

    // Show how you can add more items to the combo
    const dessert = facade.orderPresetBurger("McDonalds", "classic");
    ultimateCombo.add(dessert);
    console.log("Added dessert burger to combo:");
    console.log(`   ${ultimateCombo.getDescription()}`);
    console.log(`     New Total: $${ultimateCombo.getPrice().toFixed(2)}`);

    // ========================================================================
    // DEMO 5: NESTED COMPOSITES - Combos within Combos
    // ========================================================================
    console.log("\n\nDEMO 5: NESTED COMPOSITES - Family Order");
    console.log("-".repeat(70));
    console.log("Demonstrating the true power of Composite: tree structures!");
    console.log();

    // Create individual meals
    const meal1 = facade.createComboMeal(
      facade.orderStandardBurger("McDonalds"),
      "Regular",
      "Medium",
      "Coke"
    );

    const meal2 = facade.createComboMeal(
      facade.orderPresetBurger("KFC", "spicy"),
      "Large",
      "Large",
      "Sprite"
    );

    // Create a family combo that contains other combos!
    const familyOrder = new MealCombo("Family Bundle");
    familyOrder.add(meal1);
    familyOrder.add(meal2);
    familyOrder.add(new Fries("Large", 3.49)); // Extra fries for sharing

    console.log("  Family Bundle (Nested Composite):");
    console.log(`   ${familyOrder.getDescription()}`);
    console.log(`     Total: $${familyOrder.getPrice().toFixed(2)}`);
    console.log(`     Top-level items: ${familyOrder.getItemCount()}`);

    console.log("\n\n" + "=".repeat(70));
    console.log("  STRUCTURAL PATTERNS SUMMARY");
    console.log("=".repeat(70));
    console.log(`
1️⃣  FACADE PATTERN:
    ✓ Simplified complex ordering workflow
    ✓ Single entry point: FastFoodFacade
    ✓ Hides Factory, Builder, Director, Prototype complexity

2️⃣  DECORATOR PATTERN:
    ✓ Dynamically added premium toppings
    ✓ Stackable decorators (bacon + avocado + cheese)
    ✓ No class explosion - flexible and extensible

3️⃣  COMPOSITE PATTERN:
    ✓ Created meal combos as tree structures
    ✓ Uniform interface for items and combos
    ✓ Recursive price calculation and descriptions
    ✓ Supports nesting (combos within combos)
`);

    console.log("=".repeat(70));
    console.log("\n FULL SYSTEM LOG HISTORY:");
    console.log("=".repeat(70));
    logger.seeLogs();

    console.log("\n All structural patterns demonstrated successfully!");
    console.log("=".repeat(70) + "\n");
  }
}

// Run the application
Application.main();
