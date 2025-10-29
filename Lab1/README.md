# Lab 1 TMPS - Creational Design Patterns

## Author
**Dumitru Postoronca**
Technical University of Moldova
FAF-223

---

## Project Overview

This laboratory work implements a **Fast Food Aggregator System** (similar to Uber Eats or DoorDash) that allows users to order burgers from multiple restaurant chains (McDonald's, KFC) and customize them according to their preferences.

### Purpose
The system demonstrates how **5 creational design patterns** work together to create a flexible, maintainable, and extensible architecture for managing product creation, customization, and reusability across multiple restaurant brands.

### Key Features
- Order standard burgers from different restaurants (Factory Method)
- Customize burgers with flexible ingredient management (Builder)
- Create preset burger configurations (Director)
- Clone and save favorite custom orders (Prototype)
- Centralized logging system (Singleton)

---

## Installation

```shell
git clone https://www.github.com/DdimaPos/tmps-labs.git
cd tmps-labs/
npm i
```

To run the program:

```shell
npx tsc
node dist/client/client.js
```

---

## Project Structure

```
src/
├── client/
│   └── client.ts              # Application entry point
│
└── domain/                     # Business logic layer
    ├── models/                 # Core data entities
    │   ├── Burger.ts          # Burger interface
    │   ├── StandartBurger.ts  # Burger implementation
    │   └── Logger.ts          # Singleton logger
    │
    ├── factories/             # Factory Method pattern
    │   ├── FastFoodFactory.ts     # Abstract factory
    │   ├── McDonaldsFactory.ts    # Concrete factory
    │   └── KFCFactory.ts          # Concrete factory
    │
    ├── builders/              # Builder pattern
    │   └── BurgerBuilder.ts   # Fluent builder for customization
    │
    ├── directors/             # Director pattern
    │   └── BurgerDirector.ts  # Encapsulates construction recipes
    │
    └── services/              # Business logic orchestration
        └── OrderManager.ts    # Manages ordering workflow
```

### Architecture Layers

**Domain Layer** (`domain/`):
- Contains all business logic and design patterns
- Independent of the client interface
- Organized by pattern type (factories, builders, directors, models)

**Client Layer** (`client/`):
- Entry point for the application
- Orchestrates pattern usage
- Demonstrates pattern interactions

---

## Implemented Design Patterns

### 1. Factory Method Pattern

**Purpose:** Define an interface for creating objects, but let subclasses decide which class to instantiate.

**Problem Solved:**
Each restaurant (McDonald's, KFC) creates burgers with different ingredients, recipes, and branding. Without Factory Method, the client would need to know specific details about each restaurant's burger creation process.

**Implementation:**

- **Abstract Factory:** `FastFoodFactory` - defines abstract method `createBurger()`
- **Concrete Factories:**
  - `McDonaldsFactory` - creates McDonald's-specific burgers (BigMac with special sauce, sesame bun)
  - `KFCFactory` - creates KFC-specific burgers (with unique KFC sauce)

**Code Example:**
```typescript
// Abstract factory
abstract class FastFoodFactory {
  abstract createBurger(): Burger;
}

// Concrete factory
class McDonaldsFactory extends FastFoodFactory {
  createBurger(): Burger {
    const burger = new StandartBurger("BigMac", 'McDonalds');
    const burgerBuilder = new BurgerBuilder(burger);
    burgerBuilder.addMeat("Beef");
    burgerBuilder.addIngredient("lettuce")
    return burgerBuilder.build()
  }
}
```

**Benefits:**
- Encapsulates restaurant-specific creation logic
- Easy to add new restaurants without modifying existing code
- Client code doesn't depend on concrete burger implementations

---

### 2. Builder Pattern

**Purpose:** Separate the construction of a complex object from its representation, allowing the same construction process to create different representations.

**Problem Solved:**
Burgers have many optional components (meat type, cheese, vegetables, sauces). Using constructors with many parameters would be unmanageable. Builder provides a fluent, readable API for step-by-step construction.

**Implementation:**

- **Builder:** `BurgerBuilder` - provides methods for adding/removing ingredients
- **Product:** `Burger` interface and `StandartBurger` implementation
- **Fluent API:** All builder methods return `this` for method chaining

**Code Example:**
```typescript
class BurgerBuilder {
  private burger: Burger;

  constructor(burger?: Burger) {
    this.burger = burger || new StandartBurger();
  }

  reset(): BurgerBuilder {
    this.burger = new StandartBurger();
    return this;
  }

  addMeat(type: string): BurgerBuilder {
    this.burger.meatType = type;
    return this; // Enables chaining
  }

  addIngredient(ingredient: string): BurgerBuilder {
    this.burger.ingredients.add(ingredient);
    return this;
  }

  build(): Burger {
    return this.burger;
  }
}

// Usage
const customBurger = new BurgerBuilder(baseBurger)
  .addIngredient("paprica")
  .addIngredient("extra cheese")
  .removeMeat()
  .build();
```

**Benefits:**
- Readable, self-documenting code
- Flexible construction (any combination of optional ingredients)
- Reusable builder via `reset()` method
- Separates construction logic from representation

---

### 3. Director Pattern

**Purpose:** Encapsulate complex construction sequences using a Builder, providing predefined "recipes" for creating specific product configurations.

**Problem Solved:**
Creating preset burger types (vegan, spicy, classic) requires executing the same sequence of builder steps repeatedly. Director encapsulates these recipes, so clients can request "vegan burger" without knowing the construction steps.

**Implementation:**

- **Director:** `BurgerDirector` - orchestrates Builder to create preset configurations
- **Collaboration:** Director receives a Builder and uses it to execute construction recipes

**Code Example:**
```typescript
class BurgerDirector {
  private builder: BurgerBuilder;

  constructor(builder: BurgerBuilder) {
    this.builder = builder;
  }

  createVeganBurger(): Burger {
    return this.builder
      .reset()
      .addIngredient("salad")
      .addIngredient("tomatoes")
      .removeMeat()
      .build();
  }

  createSpicyBurger(): Burger {
    return this.builder
      .reset()
      .addIngredient("jalapeños")
      .addIngredient("hot sauce")
      .addMeat("beef")
      .build();
  }
}

// Usage
const director = new BurgerDirector(builder);
const veganBurger = director.createVeganBurger(); // Simple!
```

**Benefits:**
- Encapsulates construction algorithms
- Consistent preset configurations
- Client doesn't need to know construction steps
- Easy to add new preset recipes

---

### 4. Prototype Pattern

**Purpose:** Specify the kinds of objects to create using a prototypical instance, and create new objects by copying this prototype.

**Problem Solved:**
Creating custom burgers with many ingredients is complex. Users want to save their favorite custom burgers and quickly reorder them. Cloning allows creating a copy of a configured burger instead of rebuilding from scratch.

**Implementation:**

- **Prototype:** `Burger` interface defines `clone()` method
- **Concrete Prototype:** `StandartBurger` implements deep cloning using `structuredClone()`
- **Usage:** Clone burgers before customization to preserve originals

**Code Example:**
```typescript
class StandartBurger implements Burger {
  name: string | null = null;
  meatType: string | null = null;
  ingredients: Set<string>;
  restaurantName: string;

  clone(): StandartBurger {
    return structuredClone(this); // Deep copy including Set
  }
}

// Usage - save and reorder favorites
const customBurger = builder.addIngredient("special sauce").build();

// Save as favorite (original preserved)
const myFavorite = customBurger.clone();

// Later: reorder the same burger
const reordered = myFavorite.clone();
```

**Benefits:**
- Avoid expensive reconstruction of complex objects
- Preserve original configurations
- Enable "favorites" and "reorder" features
- Deep copy ensures modifications don't affect original

---

### 5. Singleton Pattern

**Purpose:** Ensure a class has only one instance and provide a global point of access to it.

**Problem Solved:**
The logging system should maintain a single log history shared across the entire application. Multiple Logger instances would fragment logs. Singleton ensures one centralized logging instance.

**Implementation:**

- **Singleton:** `Logger` class with private constructor and static instance
- **Global Access:** Static `getLogger()` method provides access
- **Lazy Initialization:** Instance created only when first requested

**Code Example:**
```typescript
class Logger {
  private static instance: Logger;
  private logHistory: string[];

  private constructor() { // Private constructor
    this.logHistory = [];
  }

  public static getLogger(): Logger {
    if (!this.instance) {
      this.instance = new Logger(); // Lazy initialization
    }
    return this.instance;
  }

  info(message: string): void {
    const log = new Date().toISOString() + " Info: " + message;
    console.info(log);
    this.logHistory.push(log);
  }

  seeLogs(): void {
    console.table(this.logHistory);
  }
}

// Usage - same instance everywhere
const logger1 = Logger.getLogger();
const logger2 = Logger.getLogger();
console.log(logger1 === logger2); // true - same instance
```

**Benefits:**
- Single source of truth for logging
- Shared log history across application
- Controlled access to global resource
- Memory efficient (one instance only)

---

## Pattern Interactions

The power of these patterns emerges from how they work together:

### Complete User Journey

```
1. User selects restaurant (McDonald's)
   ↓
2. Factory Method creates standard McDonald's burger
   ↓
3. Prototype clones the burger for customization
   ↓
4. Builder customizes the cloned burger OR Director creates preset
   ↓
5. Singleton Logger tracks all operations
   ↓
6. User saves favorite (Prototype stores it)
   ↓
7. User reorders (Prototype clones saved favorite)
```

### Pattern Synergy Example

```typescript
// Factory creates base product
const factory = new McDonaldsFactory();
const baseBurger = factory.createBurger(); // [Factory Method]

// Clone before customization (preserve original)
const cloned = baseBurger.clone(); // [Prototype]

// Option A: Custom build
const custom = new BurgerBuilder(cloned) // [Builder]
  .addIngredient("extra cheese")
  .build();

// Option B: Preset via Director
const builder = new BurgerBuilder(cloned);
const director = new BurgerDirector(builder); // [Director]
const vegan = director.createVeganBurger(); // [Director + Builder]

// Log everything
const logger = Logger.getLogger(); // [Singleton]
logger.info("Order completed");
```

---

## SOLID Principles

### 1. Single Responsibility Principle (SRP)
**Each class has one reason to change:**
- `Burger` - represents burger data only
- `BurgerBuilder` - handles burger construction only
- `BurgerDirector` - encapsulates construction recipes only
- `FastFoodFactory` - handles burger creation only
- `Logger` - handles logging only

### 2. Open/Closed Principle (OCP)
**Open for extension, closed for modification:**
- Adding new restaurant: extend `FastFoodFactory`, no changes to existing factories
- Adding new preset: add method to `BurgerDirector`, existing presets unchanged
- System is extensible (new products like Fries, Drinks) without modifying core classes

### 3. Liskov Substitution Principle (LSP)
**Subclasses can replace parent classes:**
- `McDonaldsFactory` and `KFCFactory` are interchangeable as `FastFoodFactory`
- Client code works with `FastFoodFactory` interface without knowing concrete type
- Any concrete factory can be substituted without breaking functionality

### 4. Interface Segregation Principle (ISP)
**Clients shouldn't depend on interfaces they don't use:**
- `Burger` interface contains only methods all burgers need
- `BurgerBuilder` provides only construction methods
- No "fat" interfaces forcing unnecessary implementations

### 5. Dependency Inversion Principle (DIP)
**Depend on abstractions, not concretions:**
- Client depends on `FastFoodFactory` (abstraction), not `McDonaldsFactory` (concrete)
- Director depends on `BurgerBuilder` (abstraction), not specific builder implementations
- High-level modules (client) don't depend on low-level modules (concrete factories)

---

## Conclusions

This laboratory work successfully demonstrates the implementation and interaction of **5 creational design patterns** in a real-world scenario. Key learnings:

1. **Pattern Composition:** Patterns are more powerful when combined. Factory creates products, Builder customizes them, Director orchestrates construction, Prototype enables reuse, and Singleton manages shared resources.

2. **Flexibility:** The architecture easily extends to new restaurants (new factories), new products (fries, drinks), and new presets (new director methods) without modifying existing code.

3. **Separation of Concerns:** Each pattern addresses a specific aspect of object creation:
   - Factory Method: variant creation (different restaurants)
   - Builder: complex construction (many optional ingredients)
   - Director: construction sequences (preset recipes)
   - Prototype: object copying (favorites/reorder)
   - Singleton: shared resources (logging)

4. **Professional Architecture:** The layered structure (models, factories, builders, directors, services, client) mirrors real-world application design, demonstrating not just pattern implementation but architectural thinking.

5. **SOLID Compliance:** The implementation adheres to all SOLID principles, resulting in maintainable, testable, and extensible code.

The Fast Food Aggregator system showcases how design patterns solve real problems: managing complexity, enabling flexibility, and creating clean, professional code architecture.

---

## Future Extensions

The current architecture easily supports:
- **New Restaurants:** Add new factory extending `FastFoodFactory`
- **New Products:** Add Fries, Drinks with same pattern structure
- **Order Management:** Add Order class to manage multiple items
- **Favorites System:** Extend Prototype pattern with `FavoritesManager` Singleton
- **Restaurant Registry:** Add Singleton registry managing available restaurants
- **Payment System:** Integrate without modifying existing patterns

---

## References

- Refactoring.Guru - Design Patterns: https://refactoring.guru/design-patterns
