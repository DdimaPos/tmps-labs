# Lab 2 TMPS - Structural Design Patterns

## Author
**Dumitru Postoronca**
Technical University of Moldova
FAF-233

---

## Introduction

### Motivation

Building upon Lab 1's creational patterns, this laboratory work extends the **Fast Food Aggregator System** with structural design patterns. While creational patterns focus on *how objects are created*, structural patterns focus on *how objects are composed* to form larger, more complex structures.

The Fast Food Aggregator system previously handled burger creation through factories, builders, directors, and prototypes. However, real-world food ordering systems need:
- **Dynamic customization**: Adding premium toppings without creating dozens of burger subclasses
- **Simplified interfaces**: Making the complex creation workflow easy for clients
- **Composite structures**: Supporting meal combos (burger + fries + drink) as unified entities

These requirements are perfectly addressed by structural design patterns.

### Theory

**Structural Design Patterns** deal with object composition - creating relationships between objects to form larger structures. They focus on:
- Simplifying relationships between entities
- Providing flexible ways to compose objects
- Creating new functionality by combining objects

The three patterns implemented in this lab are:

1. **Facade Pattern** - Provides a unified interface to a set of interfaces in a subsystem
2. **Decorator Pattern** - Dynamically adds responsibilities to objects
3. **Composite Pattern** - Composes objects into tree structures to represent part-whole hierarchies

---

## Implementation & Explanation

### 1. Facade Pattern

**Location**: `src/domain/facades/FastFoodFacade.ts`

#### Purpose
The Facade Pattern provides a simplified interface to the complex fast-food ordering subsystem, hiding the interactions between Factory, Builder, Director, and Prototype patterns.

#### Problem Solved
Without Facade, ordering a custom burger requires:
```typescript
// Complex workflow without Facade
const factory = new McDonaldsFactory();
const baseBurger = factory.createBurger();
const cloned = baseBurger.clone();
const builder = new BurgerBuilder(cloned);
builder.addIngredient("cheese");
builder.addIngredient("bacon");
const burger = builder.build();
```

With Facade, this becomes:
```typescript
// Simple workflow with Facade
const facade = new FastFoodFacade();
const burger = facade.orderCustomBurger("McDonalds", ["cheese", "bacon"]);
```

#### Implementation

```typescript
export class FastFoodFacade {
  private factories: Map<string, FastFoodFactory>;

  constructor() {
    this.factories = new Map([
      ["McDonalds", new McDonaldsFactory()],
      ["KFC", new KFCFactory()],
    ]);
  }

  // Simplified ordering methods
  orderStandardBurger(restaurant: string): Burger {
    const factory = this.getFactory(restaurant);
    return factory.createBurger();
  }

  orderCustomBurger(restaurant: string, extraIngredients: string[]): Burger {
    const factory = this.getFactory(restaurant);
    const baseBurger = factory.createBurger();
    const cloned = baseBurger.clone();
    const builder = new BurgerBuilder(cloned);

    extraIngredients.forEach(ingredient => builder.addIngredient(ingredient));
    return builder.build();
  }

  orderQuickMeal(restaurant: string, includeFries: boolean, includeDrink: boolean): MealCombo {
    const burger = this.orderStandardBurger(restaurant);
    return this.createComboMeal(
      burger,
      includeFries ? "Regular" : undefined,
      includeDrink ? "Medium" : undefined
    );
  }
}
```

#### Key Benefits
- **Simplified API**: Complex subsystem hidden behind simple methods
- **Reduced coupling**: Client depends only on Facade, not on Factory/Builder/Director
- **Principle of Least Knowledge**: Clients interact with minimal interfaces
- **Easy to extend**: Adding new ordering workflows doesn't affect clients

#### Usage Example
```typescript
const facade = new FastFoodFacade();

// Simple orders
const burger = facade.orderStandardBurger("McDonalds");
const custom = facade.orderCustomBurger("KFC", ["jalapeños", "extra cheese"]);
const preset = facade.orderPresetBurger("McDonalds", "vegan");
const quickMeal = facade.orderQuickMeal("KFC", true, true);
```

---

### 2. Decorator Pattern

**Location**: `src/domain/decorators/`

#### Purpose
The Decorator Pattern dynamically adds premium toppings and extras to menu items without modifying their classes or creating an explosion of subclasses.

#### Problem Solved
Without Decorator, supporting all topping combinations would require:
```
BurgerWithBacon
BurgerWithAvocado
BurgerWithBaconAndAvocado
BurgerWithBaconAndAvocadoAndCheese
... (dozens of classes!)
```

With Decorator, we wrap objects in layers:
```typescript
let burger = baseBurger;
burger = new BaconDecorator(burger);
burger = new AvocadoDecorator(burger);
burger = new PremiumCheeseDecorator(burger);
```

#### Implementation

**Abstract Decorator** (`BurgerDecorator.ts`):
```typescript
export abstract class BurgerDecorator implements MenuItem {
  protected wrappedItem: MenuItem;

  constructor(item: MenuItem) {
    this.wrappedItem = item;
  }

  abstract getPrice(): number;
  abstract getDescription(): string;
}
```

**Concrete Decorator** (`BaconDecorator.ts`):
```typescript
export class BaconDecorator extends BurgerDecorator {
  private readonly BACON_PRICE = 2.0;

  getPrice(): number {
    return this.wrappedItem.getPrice() + this.BACON_PRICE;
  }

  getDescription(): string {
    return this.wrappedItem.getDescription() + ", +Extra Bacon";
  }
}
```

**Other Decorators**:
- `AvocadoDecorator` - Adds fresh avocado (+$1.50)
- `PremiumCheeseDecorator` - Adds premium cheese (+$1.00)

#### Key Mechanism
Each decorator:
1. **Wraps** a MenuItem (which could be a Burger or another Decorator)
2. **Delegates** to the wrapped item
3. **Adds** its own contribution (price, description)

This creates a chain: `BaseBurger → +Bacon → +Avocado → +Cheese`

#### Key Benefits
- **Flexible composition**: Stack any number of decorators
- **No class explosion**: Three decorators instead of 2³ = 8 subclasses
- **Open/Closed Principle**: Add new decorators without modifying existing code
- **Transparent**: Decorated items have the same interface as base items

#### Usage Example
```typescript
let burger: MenuItem = facade.orderStandardBurger("McDonalds");
console.log(burger.getPrice()); // $5.99

burger = new BaconDecorator(burger);
console.log(burger.getPrice()); // $7.99

burger = new AvocadoDecorator(burger);
console.log(burger.getPrice()); // $9.49

burger = new PremiumCheeseDecorator(burger, "Swiss");
console.log(burger.getPrice()); // $10.49
console.log(burger.getDescription());
// "BigMac from McDonalds with Beef - Ingredients: ..., +Extra Bacon, +Fresh Avocado, +Premium Swiss Cheese"
```

---

### 3. Composite Pattern

**Location**: `src/domain/models/MealCombo.ts`

#### Purpose
The Composite Pattern treats individual items (Burger, Fries, Drink) and compositions (MealCombo) uniformly, allowing creation of tree structures like meal bundles.

#### Problem Solved
Real fast-food systems have:
- Individual items (burger, fries, drink)
- Combos (burger + fries + drink)
- Family meals (multiple combos + extras)

These need uniform operations:
- Get total price (recursive sum)
- Get description (recursive concatenation)
- Add/remove items

#### Implementation

**Common Interface** (`MenuItem.ts`):
```typescript
export interface MenuItem {
  name: string | null;
  getPrice(): number;
  getDescription(): string;
}
```

**Leaf Nodes** (Individual Items):
```typescript
// Burger already implements MenuItem from Lab 1 extension
export class StandartBurger implements Burger {
  getPrice(): number {
    return this.price || 0;
  }

  getDescription(): string {
    return `${this.name} from ${this.restaurantName} with ${this.meatType}...`;
  }
}

// New leaf: Fries
export class Fries implements MenuItem {
  constructor(private size: string, private price: number) {}

  getPrice(): number {
    return this.price;
  }

  getDescription(): string {
    return `${this.size} Fries`;
  }
}

// New leaf: Drink
export class Drink implements MenuItem {
  constructor(private type: string, private size: string, private price: number) {}

  getPrice(): number {
    return this.price;
  }

  getDescription(): string {
    return `${this.size} ${this.type}`;
  }
}
```

**Composite Node** (`MealCombo.ts`):
```typescript
export class MealCombo implements MenuItem {
  name: string;
  private items: MenuItem[] = [];

  add(item: MenuItem): void {
    this.items.push(item);
  }

  remove(item: MenuItem): void {
    const index = this.items.indexOf(item);
    if (index > -1) this.items.splice(index, 1);
  }

  // Recursive price calculation
  getPrice(): number {
    return this.items.reduce((total, item) => total + item.getPrice(), 0);
  }

  // Recursive description building
  getDescription(): string {
    const itemDescriptions = this.items
      .map(item => item.getDescription())
      .join(', ');
    return `${this.name} [${itemDescriptions}]`;
  }
}
```

#### Key Mechanism
1. **Uniform Interface**: Both leaves and composites implement `MenuItem`
2. **Recursive Operations**: `getPrice()` recursively sums all contained items
3. **Tree Structure**: Composites can contain other composites

```
Family Bundle (Composite)
├── Value Meal 1 (Composite)
│   ├── BigMac (Leaf)
│   ├── Fries (Leaf)
│   └── Coke (Leaf)
├── Value Meal 2 (Composite)
│   ├── Zinger (Leaf)
│   ├── Fries (Leaf)
│   └── Sprite (Leaf)
└── Extra Fries (Leaf)
```

#### Key Benefits
- **Uniform treatment**: Client code treats items and combos identically
- **Recursive operations**: Price/description calculated automatically for any depth
- **Flexible hierarchy**: Can nest combos within combos
- **Easy to extend**: Adding new menu items just requires implementing `MenuItem`

#### Usage Example
```typescript
// Create a combo manually
const combo = new MealCombo("BigMac Meal");
combo.add(facade.orderStandardBurger("McDonalds"));
combo.add(new Fries("Large", 3.49));
combo.add(new Drink("Coke", "Large", 2.49));

console.log(combo.getPrice()); // Automatically sums: 5.99 + 3.49 + 2.49 = $11.97
console.log(combo.getDescription());
// "BigMac Meal [BigMac from McDonalds..., Large Fries, Large Coke]"

// Nested composites - Family Order
const familyOrder = new MealCombo("Family Bundle");
familyOrder.add(combo); // Add entire combo as one item!
familyOrder.add(anotherCombo);
familyOrder.add(new Fries("Large", 3.49));

console.log(familyOrder.getPrice()); // Recursively sums everything!
```

---

## Pattern Interactions

The true power emerges when these patterns work together:

### Example: Ultimate Premium Combo
```typescript
const facade = new FastFoodFacade();

// 1. FACADE: Simplify ordering
let burger: MenuItem = facade.orderCustomBurger("McDonalds", ["pickles"]);

// 2. DECORATOR: Add premium toppings
burger = new BaconDecorator(burger);
burger = new AvocadoDecorator(burger);

// 3. COMPOSITE: Create combo
const combo = new MealCombo("Ultimate Meal");
combo.add(burger); // Decorated burger
combo.add(new Fries("Large", 3.49));
combo.add(new Drink("Sprite", "Medium", 1.99));

console.log(combo.getPrice()); // $14.97 (5.99 + 2.00 + 1.50 + 3.49 + 1.99)
console.log(combo.getDescription());
// "Ultimate Meal [BigMac from McDonalds..., +Extra Bacon, +Fresh Avocado, Large Fries, Medium Sprite]"
```

### Pattern Synergy
- **Facade** provides easy access to base burgers
- **Decorator** enhances burgers with premium toppings
- **Composite** bundles everything into meals
- All patterns respect **SOLID principles** and work seamlessly

---

## Project Structure

```
src/
├── client/
│   └── client.ts              # Single entry point demonstrating all patterns
│
└── domain/
    ├── models/                 # Core entities
    │   ├── MenuItem.ts        # [NEW] Composite interface
    │   ├── Burger.ts          # [UPDATED] Extends MenuItem
    │   ├── StandartBurger.ts  # [UPDATED] Implements MenuItem methods
    │   ├── Fries.ts           # [NEW] Leaf node
    │   ├── Drink.ts           # [NEW] Leaf node
    │   ├── MealCombo.ts       # [NEW] Composite container
    │   └── Logger.ts          # Singleton from Lab 1
    │
    ├── decorators/            # [NEW] Decorator pattern
    │   ├── BurgerDecorator.ts       # Abstract decorator
    │   ├── BaconDecorator.ts        # Concrete decorator
    │   ├── AvocadoDecorator.ts      # Concrete decorator
    │   └── PremiumCheeseDecorator.ts # Concrete decorator
    │
    ├── facades/               # [NEW] Facade pattern
    │   └── FastFoodFacade.ts  # Simplified ordering interface
    │
    ├── factories/             # From Lab 1
    │   ├── FastFoodFactory.ts
    │   ├── McDonaldsFactory.ts
    │   └── KFCFactory.ts
    │
    ├── builders/              # From Lab 1
    │   └── BurgerBuilder.ts
    │
    └── directors/             # From Lab 1
        └── BurgerDirector.ts
```

---

## Results & Demonstration

### Execution Output Highlights

```
======================================================================
FAST FOOD AGGREGATOR SYSTEM - Lab 2: Structural Patterns 🍔
======================================================================

DEMO 1: FACADE PATTERN
----------------------------------------------------------------------
Ordered: BigMac from McDonalds with Beef - Ingredients: lettuce, special sauce...
Price: $5.99

DEMO 2: DECORATOR PATTERN
----------------------------------------------------------------------
Base burger: BigMac from McDonalds with Beef...
Price: $5.99

+ Bacon: ...+Extra Bacon
  Price: $7.99
+ Avocado: ...+Extra Bacon, +Fresh Avocado
  Price: $9.49
+ Swiss Cheese: ...+Extra Bacon, +Fresh Avocado, +Premium Swiss Cheese
  Price: $10.49

DEMO 3: COMPOSITE PATTERN
----------------------------------------------------------------------
Premium BigMac Meal [BigMac..., Large Fries, Large Coke]
Total Price: $11.97
Item Count: 3

DEMO 5: NESTED COMPOSITES
----------------------------------------------------------------------
Family Bundle [Value Meal [...], Value Meal [...], Large Fries]
Total: $25.93
```

### Key Observations
1. **Facade** reduced 6+ lines of code to 1 simple method call
2. **Decorator** allowed stacking 3 toppings with 3 wraps instead of 8 classes
3. **Composite** calculated nested prices correctly (Family Bundle contains Combos)
4. All patterns work together seamlessly in the final demo

---

## SOLID Principles Adherence

### Single Responsibility Principle (SRP)
- `FastFoodFacade`: Only responsible for simplifying ordering
- `BaconDecorator`: Only responsible for adding bacon
- `MealCombo`: Only responsible for composing items

### Open/Closed Principle (OCP)
- New decorators can be added without modifying existing code
- New menu items just need to implement `MenuItem`
- Facade can be extended with new methods without changing existing ones

### Liskov Substitution Principle (LSP)
- Any `MenuItem` can be used where `MenuItem` is expected
- Decorators can substitute for the items they decorate
- Composites can substitute for individual items

### Interface Segregation Principle (ISP)
- `MenuItem` interface is minimal (only price and description)
- Decorators only implement what they need
- No fat interfaces forcing unnecessary implementations

### Dependency Inversion Principle (DIP)
- Facade depends on abstractions (`FastFoodFactory`, not `McDonaldsFactory`)
- Decorators depend on `MenuItem` interface, not concrete classes
- Composites work with `MenuItem`, not specific burger types

---

## Conclusions

This laboratory work successfully extended the Fast Food Aggregator system with three structural design patterns, demonstrating how **composition** complements **creation**:

### Key Achievements

1. **Facade Pattern Implementation**
   - Reduced client complexity from 6+ steps to single method calls
   - Encapsulated all creational patterns behind a unified interface
   - Applied the Principle of Least Knowledge successfully

2. **Decorator Pattern Implementation**
   - Enabled dynamic topping additions without class explosion
   - Supported unlimited decorator stacking (bacon + avocado + cheese + ...)
   - Maintained transparent interfaces (decorated items look like base items)

3. **Composite Pattern Implementation**
   - Created tree structures for meal combos
   - Enabled recursive operations (pricing, descriptions)
   - Supported nesting (combos within combos within family bundles)

### Lessons Learned

**Structural patterns solve different problems than creational patterns:**
- Creational: *How do we build objects?*
- Structural: *How do we compose objects?*

**Pattern synergy is powerful:**
- Facade simplifies access to complex subsystems
- Decorator enhances objects flexibly
- Composite organizes objects hierarchically
- Together, they create a robust, extensible architecture

**Real-world applicability:**
- These patterns mirror actual food delivery apps (Uber Eats, DoorDash)
- The architecture could easily extend to:
  - Multiple restaurant chains
  - Different product categories (pizza, sushi, desserts)
  - Discount systems (decorator for coupons)
  - Delivery zones (composite for multi-restaurant orders)

### Future Enhancements

Potential additions using other structural patterns:
- **Adapter**: Integrate third-party payment systems
- **Bridge**: Separate burger abstraction from cooking methods
- **Proxy**: Cache expensive restaurant menu operations
- **Flyweight**: Share common ingredient objects to reduce memory

---

## Running the Project

### Prerequisites
```bash
npm install
```

### Compile and Run
```bash
# Compile TypeScript
npx tsc

# Run the application
node dist/client/client.js
```

### Expected Output
The application will demonstrate all three structural patterns with detailed logging, pricing calculations, and pattern interactions.
