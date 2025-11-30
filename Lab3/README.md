# Lab 3 TMPS - Behavioral Design Patterns

## Author
**Dumitru Postoronca**
Technical University of Moldova
FAF-233

---

## Introduction

### Motivation

Building upon Labs 1-2 (creational and structural patterns), this laboratory extends the **Fast Food Aggregator System** with behavioral design patterns. While previous patterns focused on object creation and composition, behavioral patterns address *communication between objects* and *delegation of responsibilities*.

Real food delivery systems need:
- **Order lifecycle management**: Tracking orders through states (Pending → Confirmed → Preparing → Ready → Completed)
- **Flexible pricing**: Different discount strategies (percentage, fixed amount, loyalty points)
- **Event notifications**: Automatically notifying kitchen, customer, delivery, and analytics

### Theory

**Behavioral Design Patterns** deal with algorithms and responsibility assignment between objects. The three patterns implemented:

1. **State Pattern** - Allows behavior changes based on internal state
2. **Strategy Pattern** - Makes algorithms interchangeable
3. **Observer Pattern** - Establishes one-to-many dependencies for automatic notifications

---

## Implementation & Explanation

### 1. State Pattern

**Location**: `src/domain/states/`

#### Purpose
Allows Order to change behavior based on current state without complex conditional logic.

#### Problem vs Solution
**Without State Pattern:**
```typescript
class Order {
  prepare() {
    if (this.status === "pending") throw new Error("Can't prepare");
    else if (this.status === "confirmed") this.status = "preparing";
    // ... messy conditionals
  }
}
```

**With State Pattern:**
```typescript
class Order {
  private state: OrderState;
  prepare() { this.state.prepare(this); } // State knows what's valid
}
```

#### Implementation

**State Interface:**
```typescript
export interface OrderState {
    confirm(order: Order): void;
    prepare(order: Order): void;
    ready(order: Order): void;
    complete(order: Order): void;
    getStateName(): string;
}
```

**Concrete State Example** (`ConfirmedState.ts`):
```typescript
export class ConfirmedState implements OrderState {
    confirm(order: Order): void {
        throw new Error("Already confirmed.");
    }

    prepare(order: Order): void {
        this.logger.info("Order sent to kitchen.");
        order.setState(new PreparingState());
    }
    // ...
}
```

**States Implemented**: `PendingState`, `ConfirmedState`, `PreparingState`, `ReadyState`, `CompletedState`

#### Key Benefits
- No conditional logic - each state encapsulates its own rules
- Easy to extend - add new states without modifying existing code
- Type-safe transitions - invalid transitions throw errors

---

### 2. Strategy Pattern

**Location**: `src/domain/strategies/`

#### Purpose
Enables Orders to use different discount algorithms interchangeably.

#### Problem vs Solution
**Without Strategy:**
```typescript
getFinalPrice(discountType: string): number {
  if (discountType === "percentage") return this.basePrice * 0.85;
  else if (discountType === "fixed") return this.basePrice - 5.00;
  // ... adding types requires modifying this method
}
```

**With Strategy:**
```typescript
setDiscountStrategy(strategy: DiscountStrategy): void {
  this.discountStrategy = strategy;
}
getFinalPrice(): number {
  return this.discountStrategy.applyDiscount(this.basePrice);
}
```

#### Implementation

**Strategy Interface:**
```typescript
export interface DiscountStrategy {
    applyDiscount(basePrice: number): number;
    getDescription(): string;
}
```

**Concrete Strategies**:

1. **PercentageDiscountStrategy**:
```typescript
export class PercentageDiscountStrategy implements DiscountStrategy {
    constructor(private percentage: number) {}

    applyDiscount(basePrice: number): number {
        return basePrice - (basePrice * (this.percentage / 100));
    }

    getDescription(): string {
        return `${this.percentage}% off`;
    }
}
```

2. **FixedAmountDiscountStrategy**: Subtracts fixed dollar amount
3. **LoyaltyPointsDiscountStrategy**: Converts points to discount (100 points = $1)
4. **NoDiscountStrategy**: Returns original price (default)

#### Usage
```typescript
const order = new Order(meal, "McDonalds");
console.log(`Base: $${order.getBasePrice()}`); // $15.47

order.setDiscountStrategy(new PercentageDiscountStrategy(15));
console.log(`Final: $${order.getFinalPrice()}`); // $13.15

order.setDiscountStrategy(new FixedAmountDiscountStrategy(3.00));
console.log(`Final: $${order.getFinalPrice()}`); // $12.47
```

#### Key Benefits
- Interchangeable algorithms at runtime
- Open/Closed Principle - add strategies without modifying Order
- Each strategy independently testable

---

### 3. Observer Pattern

**Location**: `src/domain/observers/`

#### Purpose
Establishes one-to-many dependency where Order notifies multiple systems automatically on state changes.

#### Problem vs Solution
**Without Observer:**
```typescript
setState(newState: OrderState): void {
  this.state = newState;
  this.kitchen.notify(this);
  this.customer.notify(this);
  this.delivery.notify(this);
  // Adding systems requires modifying Order
}
```

**With Observer:**
```typescript
setState(newState: OrderState): void {
  this.state = newState;
  this.notifyObservers(); // All observers automatically notified
}
```

#### Implementation

**Observer Interface:**
```typescript
export interface OrderObserver {
    onStateChanged(order: Order, newState: string, oldState: string): void;
}
```

**Concrete Observers**:

1. **KitchenObserver** - Receives orders for cooking:
```typescript
export class KitchenObserver implements OrderObserver {
    onStateChanged(order: Order, newState: string, oldState: string): void {
        if (newState === "Confirmed") {
            this.logger.info(`[KITCHEN] 🍳 New order received!`);
        }
        if (newState === "Ready") {
            this.logger.info(`[KITCHEN] ✅ Order ready for pickup!`);
        }
    }
}
```

2. **CustomerNotificationObserver** - Sends notifications at each state:
   - Confirmed: "Your order has been confirmed!"
   - Preparing: "Your order is being prepared..."
   - Ready: "Your order is ready for pickup!"
   - Completed: "Thank you! Enjoy your meal!"

3. **AnalyticsObserver** - Tracks metrics and transitions:
```typescript
export class AnalyticsObserver implements OrderObserver {
    private stateTransitions: number = 0;
    private completedOrders: number = 0;

    onStateChanged(order: Order, newState: string, oldState: string): void {
        this.stateTransitions++;
        if (newState === "Completed") {
            this.completedOrders++;
        }
        this.logger.info(`[ANALYTICS] 📈 ${oldState} → ${newState}`);
    }
}
```

4. **DeliveryObserver** - Schedules delivery when Ready

**Subject Integration in Order:**
```typescript
export class Order {
    private observers: OrderObserver[] = [];

    attach(observer: OrderObserver): void {
        this.observers.push(observer);
    }

    private notifyObservers(newState: string, oldState: string): void {
        for (const observer of this.observers) {
            observer.onStateChanged(this, newState, oldState);
        }
    }

    setState(state: OrderState): void {
        const oldState = this.state.getStateName();
        this.state = state;
        this.notifyObservers(state.getStateName(), oldState);
    }
}
```

#### Usage
```typescript
// Create observers
const kitchen = new KitchenObserver();
const customer = new CustomerNotificationObserver();
const analytics = new AnalyticsObserver();
const delivery = new DeliveryObserver();

// Attach to order
const order = new Order(burger, "McDonalds");
order.attach(kitchen);
order.attach(customer);
order.attach(analytics);
order.attach(delivery);

// State changes automatically notify all observers
order.confirm();
// Output:
// [KITCHEN] 🍳 New order received!
// [CUSTOMER] 📧 "Your order has been confirmed!"
// [ANALYTICS] 📈 Pending → Confirmed

order.ready();
// [KITCHEN] ✅ Order ready!
// [CUSTOMER] 🔔 "Your order is ready!"
// [DELIVERY] 🚗 Delivery scheduled
// [ANALYTICS] 📈 Preparing → Ready
```

#### Key Benefits
- Loose coupling - Order doesn't know specific observers
- Dynamic subscription - attach/detach at runtime
- Broadcast communication - one change notifies all
- Extensible - add observers without modifying Order

---

## Pattern Integration & Synergy

### Complete System Flow
```typescript
const facade = new FastFoodFacade();

// 1. Create order (STATE: starts Pending)
const order = new Order(facade.orderStandardBurger("McDonalds"), "McDonalds");

// 2. Attach observers (OBSERVER)
order.attach(new KitchenObserver());
order.attach(new CustomerNotificationObserver());
order.attach(new AnalyticsObserver());

// 3. Apply discount (STRATEGY)
order.setDiscountStrategy(new PercentageDiscountStrategy(15));

// 4. Transition states (STATE + OBSERVER work together)
order.confirm();  // Notifies all observers
order.prepare();  // Notifies all observers
order.ready();    // Notifies all observers
order.complete(); // Notifies all observers

// 5. Get final price (STRATEGY)
console.log(`Final: $${order.getFinalPrice()}`); // $5.09 (15% off from $5.99)
```

### Pattern Responsibilities
```
Order changes STATE → Notifies OBSERVERS → Final price via STRATEGY
```

### Complete Architecture (All 3 Labs)
```
CREATIONAL (Lab 1): Factory, Builder, Director, Prototype, Singleton
STRUCTURAL (Lab 2): Facade, Decorator, Composite
BEHAVIORAL (Lab 3): State, Strategy, Observer
```

---

## Project Structure

New additions for Lab 3:

```
src/domain/
├── states/                      # State Pattern
│   ├── OrderState.ts           # Interface
│   ├── PendingState.ts         # Initial
│   ├── ConfirmedState.ts       # After confirmation
│   ├── PreparingState.ts       # Being prepared
│   ├── ReadyState.ts           # Ready for pickup
│   └── CompletedState.ts       # Terminal
│
├── strategies/                  # Strategy Pattern
│   ├── DiscountStrategy.ts     # Interface
│   ├── NoDiscountStrategy.ts   # Default
│   ├── PercentageDiscountStrategy.ts
│   ├── FixedAmountDiscountStrategy.ts
│   └── LoyaltyPointsDiscountStrategy.ts
│
├── observers/                   # Observer Pattern
│   ├── OrderObserver.ts        # Interface
│   ├── KitchenObserver.ts
│   ├── CustomerNotificationObserver.ts
│   ├── AnalyticsObserver.ts
│   └── DeliveryObserver.ts
│
└── models/
    └── Order.ts                # Context for all three patterns
```

---

## Results & Demonstration

### Execution Output (Condensed)

```
DEMO 6: STATE PATTERN
----------------------------------------------------------------------
Order #ORD-123 | Status: Pending
  → Confirmed
  → Preparing
  → Ready
  → Completed

Invalid transition test:
  ✗ Error: Order is already completed.

DEMO 7: STRATEGY PATTERN
----------------------------------------------------------------------
Base price: $15.47
  → With 15% off: $13.15
  → With $3 off: $12.47
  → With 250 points: $12.97

DEMO 8: OBSERVER PATTERN
----------------------------------------------------------------------
[KITCHEN] 🍳 New order received!
[CUSTOMER] 📧 "Your order has been confirmed!"
[ANALYTICS] 📈 Pending → Confirmed (Total: 1)

[CUSTOMER] 👨‍🍳 "Your order is being prepared..."
[ANALYTICS] 📈 Confirmed → Preparing (Total: 2)

[KITCHEN] ✅ Order ready!
[CUSTOMER] 🔔 "Your order is ready!"
[DELIVERY] 🚗 Delivery scheduled (15-20 min)
[ANALYTICS] 📈 Preparing → Ready (Total: 3)

[CUSTOMER] ✨ "Thank you! Enjoy!"
[ANALYTICS] 📊 Completed | Revenue: $5.99
[DELIVERY] 📦 Delivered!
[ANALYTICS] 📈 Ready → Completed (Total: 4)

Analytics: 4 transitions, 1 completed order
```

---

## SOLID Principles Adherence

### Single Responsibility Principle (SRP)
- Each state class handles one state's behavior
- Each strategy handles one discount algorithm
- Each observer handles one system's notifications

### Open/Closed Principle (OCP)
- New states: Add StateClass, don't modify Order
- New strategies: Add StrategyClass, don't modify Order
- New observers: Add ObserverClass, don't modify Order

### Liskov Substitution Principle (LSP)
- Any OrderState can substitute for another
- Any DiscountStrategy is interchangeable
- Any OrderObserver can be used in observer list

### Dependency Inversion Principle (DIP)
- Order depends on OrderState interface, not concrete states
- Order depends on DiscountStrategy interface, not concrete strategies
- Order depends on OrderObserver interface, not concrete observers

---

## Conclusions

### Key Achievements

1. **State Pattern** - 5 states managing order lifecycle without conditionals
2. **Strategy Pattern** - 4 interchangeable discount algorithms
3. **Observer Pattern** - 4 observers with automatic event propagation

### Pattern Synergy
All 9 patterns (3 labs) work together:
- **Creational**: Build objects
- **Structural**: Compose objects
- **Behavioral**: Coordinate objects

Result: Enterprise-grade, extensible architecture mirroring real food delivery systems.

### Real-World Applicability
- **State**: React state machines, game AI, TCP connections
- **Strategy**: Payment methods, sorting algorithms, compression
- **Observer**: React/Vue reactivity, event systems, pub-sub architecture

### Lessons Learned
1. Behavioral patterns eliminate complex conditionals
2. Decoupling enables extensibility
3. Patterns compose naturally (State triggers Observers)
4. TypeScript interfaces ensure compile-time safety

---

## Running the Project

```bash
npm install
npx ts-node src/client/client.ts
```

Expected output demonstrates all 9 patterns with state transitions, discounts, and observer notifications.

---

**Project Summary**
- **Total Patterns**: 9 (3 creational, 3 structural, 3 behavioral)
- **Lines of Code**: ~2000
- **Architecture**: SOLID-compliant, fully extensible, production-ready
