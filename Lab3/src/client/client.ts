import { Logger } from "../domain/models/Logger";
import { FastFoodFacade } from "../domain/facades/FastFoodFacade";
import { BaconDecorator } from "../domain/decorators/BaconDecorator";
import { AvocadoDecorator } from "../domain/decorators/AvocadoDecorator";
import { PremiumCheeseDecorator } from "../domain/decorators/PremiumCheeseDecorator";
import { MenuItem } from "../domain/models/MenuItem";
import { MealCombo } from "../domain/models/MealCombo";
import { Fries } from "../domain/models/Fries";
import { Drink } from "../domain/models/Drink";
import { Order } from "../domain/models/Order";
import { PercentageDiscountStrategy } from "../domain/strategies/PercentageDiscountStrategy";
import { FixedAmountDiscountStrategy } from "../domain/strategies/FixedAmountDiscountStrategy";
import { LoyaltyPointsDiscountStrategy } from "../domain/strategies/LoyaltyPointsDiscountStrategy";
import { KitchenObserver } from "../domain/observers/KitchenObserver";
import { CustomerNotificationObserver } from "../domain/observers/CustomerNotificationObserver";
import { AnalyticsObserver } from "../domain/observers/AnalyticsObserver";
import { DeliveryObserver } from "../domain/observers/DeliveryObserver";

/**
 * STRUCTURAL PATTERNS (Lab 2):
 * - facade (FastFoodFacade) - simplifies ordering workflow
 * - decorator (BaconDecorator, etc.) - dynamically adds premium toppings
 * - composite (MealCombo) - creates meal combos as tree structures
 *
 * BEHAVIORAL PATTERNS (Lab 3):
 * - state (Order with OrderState) - manages order lifecycle
 * - strategy (DiscountStrategy) - flexible discount calculations
 * - observer (OrderObserver) - event-driven notifications on state changes
 */
class Application {
  public static main() {
    const logger = Logger.getLogger();

    console.log("\n" + "=".repeat(70));
    console.log("FAST FOOD AGGREGATOR - Lab 3: Behavioral Patterns");
    console.log("=".repeat(70) + "\n");

    const facade = new FastFoodFacade();


    // ========================================================================
    // DEMO 4: ALL PATTERNS COMBINED - Ultimate Order
    // ========================================================================
    // console.log("\n\n4: ALL PATTERNS COMBINED");
    // console.log("-".repeat(70));
    // console.log("Facade + Decorator + Composite working together!");
    // console.log();
    //
    // // Use Facade to order a custom burger
    let deluxeBurger: MenuItem = facade.orderCustomBurger("McDonalds", [
      "pickles",
      "onions",
    ]);
    //
    // // Enhance with Decorators
    // deluxeBurger = new BaconDecorator(deluxeBurger);
    // deluxeBurger = new AvocadoDecorator(deluxeBurger);
    //
    // // Create Composite meal
    // const ultimateCombo = new MealCombo("Ultimate Deluxe Meal");
    // ultimateCombo.add(deluxeBurger);
    // ultimateCombo.add(new Fries("Large", 3.49));
    // ultimateCombo.add(new Drink("Sprite", "Medium"));
    //
    // console.log("  Ultimate Deluxe Meal:");
    // console.log(`   ${ultimateCombo.getDescription()}`);
    // console.log(`     Total: $${ultimateCombo.getPrice().toFixed(2)}`);
    // console.log();
    //
    // // you can add more items to the combo
    // const dessert = facade.orderPresetBurger("McDonalds", "classic");
    // ultimateCombo.add(dessert);
    // console.log("Added dessert burger to combo:");
    // console.log(`   ${ultimateCombo.getDescription()}`);
    // console.log(`     New Total: $${ultimateCombo.getPrice().toFixed(2)}`);
    //
    // // ========================================================================
    // // DEMO 5: NESTED COMPOSITES - Combos within Combos
    // // ========================================================================
    // console.log("\n\nDEMO 5: NESTED COMPOSITES - Family Order");
    // console.log("-".repeat(70));
    // console.log("Demonstrating the true power of Composite: tree structures!");
    // console.log();
    //
    // // Create individual meals
    // const meal1 = facade.createComboMeal(
    //   facade.orderStandardBurger("McDonalds"),
    //   "Regular",
    //   "Medium",
    //   "Coke"
    // );
    //
    // const meal2 = facade.createComboMeal(
    //   facade.orderPresetBurger("KFC", "spicy"),
    //   "Large",
    //   "Large",
    //   "Sprite"
    // );
    //
    // // Create a family combo that contains other combos!
    // const familyOrder = new MealCombo("Family Bundle");
    // familyOrder.add(meal1);
    // familyOrder.add(meal2);
    // familyOrder.add(new Fries("Large", 3.49)); // Extra fries for sharing
    //
    // console.log("  Family Bundle (Nested Composite):");
    // console.log(`   ${familyOrder.getDescription()}`);
    // console.log(`     Total: $${familyOrder.getPrice().toFixed(2)}`);
    // console.log(`     Top-level items: ${familyOrder.getItemCount()}`);

    // ========================================================================
    // DEMO 6: STATE PATTERN - Order Lifecycle Management
    // ========================================================================
    console.log("\n\nDEMO 6: STATE PATTERN - Order Lifecycle");
    console.log("-".repeat(70));
    console.log("Demonstrating order state transitions!");
    console.log();

    // Create an order with the deluxe burger from earlier
    const order1 = new Order(deluxeBurger, "McDonalds");
    console.log(`  Created: ${order1.getDetails()}`);
    console.log();

    // Transition through valid states
    console.log("  Transitioning through order lifecycle:");
    order1.confirm();
    console.log(`    → ${order1.getStatus()}: ${order1.getDetails()}`);

    order1.prepare();
    console.log(`    → ${order1.getStatus()}: ${order1.getDetails()}`);

    order1.ready();
    console.log(`    → ${order1.getStatus()}: ${order1.getDetails()}`);

    order1.complete();
    console.log(`    → ${order1.getStatus()}: ${order1.getDetails()}`);
    console.log();

    // invalid state transition (error handling)
    console.log("  Attempting invalid transition (prepare on completed order):");
    try {
      order1.prepare(); // This should throw an error
    } catch (error: any) {
      console.log(`    ✗ Error caught: ${error.message}`);
    }
    console.log();

    // Create another order and show different path
    const simpleOrder = new Order(
      facade.orderStandardBurger("KFC"),
      "KFC"
    );
    console.log(`  Created second order: ${simpleOrder.getDetails()}`);
    console.log("  Attempting to skip confirmation:");
    try {
      simpleOrder.prepare(); // Can't prepare without confirming first
    } catch (error: any) {
      console.log(`    ✗ Error caught: ${error.message}`);
    }
    console.log(`    Current status: ${simpleOrder.getStatus()}`);

    // ========================================================================
    // DEMO 7: STRATEGY PATTERN - Flexible Discount Strategies
    // ========================================================================
    console.log("\n\nDEMO 7: STRATEGY PATTERN - Discount Strategies");
    console.log("-".repeat(70));
    console.log("Demonstrating interchangeable discount algorithms!");
    console.log();

    // Create a high-value order to show discounts clearly
    const premiumMeal = facade.createComboMeal(
      new BaconDecorator(new AvocadoDecorator(facade.orderStandardBurger("McDonalds"))),
      "Large",
      "Large",
      "Coke"
    );

    const discountOrder = new Order(premiumMeal, "McDonalds");
    console.log(`  Created order: ${discountOrder.getDetails()}`);
    console.log(`    Base price: $${discountOrder.getBasePrice().toFixed(2)}`);
    console.log();

    console.log("  Applying different discount strategies:");

    // Strategy 1: Percentage discount
    discountOrder.setDiscountStrategy(new PercentageDiscountStrategy(15));
    console.log(`    → With 15% off: ${discountOrder.getDetails()}`);
    console.log(`       Final price: $${discountOrder.getFinalPrice().toFixed(2)}`);

    // Strategy 2: Fixed amount discount
    discountOrder.setDiscountStrategy(new FixedAmountDiscountStrategy(3.00));
    console.log(`    → With $3 off: ${discountOrder.getDetails()}`);
    console.log(`       Final price: $${discountOrder.getFinalPrice().toFixed(2)}`);

    // Strategy 3: Loyalty points discount
    discountOrder.setDiscountStrategy(new LoyaltyPointsDiscountStrategy(250));
    console.log(`    → With 250 loyalty points: ${discountOrder.getDetails()}`);
    console.log(`       Final price: $${discountOrder.getFinalPrice().toFixed(2)}`);
    console.log();

    // Show how strategies can be combined with state transitions
    console.log("  Combining Strategy + State patterns:");
    discountOrder.confirm();
    console.log(`    Order confirmed with discount: ${discountOrder.getDetails()}`);
    console.log(`    Status: ${discountOrder.getStatus()}, Final price: $${discountOrder.getFinalPrice().toFixed(2)}`);

    // ========================================================================
    // DEMO 8: OBSERVER PATTERN - Event-Driven Notifications
    // ========================================================================
    console.log("\n\nDEMO 8: OBSERVER PATTERN - Event Notifications");
    console.log("-".repeat(70));
    console.log("Demonstrating automatic notifications when order state changes!");
    console.log();

    // Create observers
    const kitchenObserver = new KitchenObserver();
    const customerObserver = new CustomerNotificationObserver();
    const analyticsObserver = new AnalyticsObserver();
    const deliveryObserver = new DeliveryObserver();

    // Create a new order
    const observedOrder = new Order(
      facade.orderStandardBurger("McDonalds"),
      "McDonalds"
    );

    // Attach observers to the order
    console.log("  Attaching observers to order...");
    observedOrder.attach(kitchenObserver);
    observedOrder.attach(customerObserver);
    observedOrder.attach(analyticsObserver);
    observedOrder.attach(deliveryObserver);
    console.log();

    // Now watch as state transitions automatically notify all observers!
    console.log("  Transitioning order through lifecycle:");
    console.log("  ----------------------------------------");

    observedOrder.confirm();
    console.log();

    observedOrder.prepare();
    console.log();

    observedOrder.ready();
    console.log();

    observedOrder.complete();
    console.log();

    // Show analytics metrics collected by the observer
    console.log("  Analytics Summary:");
    const metrics = analyticsObserver.getMetrics();
    console.log(`    Total state transitions tracked: ${metrics.stateTransitions}`);
    console.log(`    Total completed orders: ${metrics.completedOrders}`);

    console.log("=".repeat(70));
    console.log("\n FULL SYSTEM LOG HISTORY:");
    console.log("=".repeat(70));
    logger.seeLogs();
  }
}

// Run the application
Application.main();
