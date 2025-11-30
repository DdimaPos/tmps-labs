import type { MenuItem } from "./MenuItem";
import type { OrderState } from "../states/OrderState";
import { PendingState } from "../states/PendingState";
import { Logger } from "./Logger";
import type { DiscountStrategy } from "../strategies/DiscountStrategy";
import { NoDiscountStrategy } from "../strategies/NoDiscountStrategy";
import type { OrderObserver } from "../observers/OrderObserver";

export class Order {
    private state: OrderState;
    private logger: Logger = Logger.getLogger();
    private orderId: string;
    private item: MenuItem;
    private restaurant: string;
    private createdAt: Date;
    private discountStrategy: DiscountStrategy;
    private observers: OrderObserver[] = [];

    constructor(item: MenuItem, restaurant: string) {
        this.orderId = this.generateOrderId();
        this.item = item;
        this.restaurant = restaurant;
        this.createdAt = new Date();
        this.state = new PendingState(); // Initial state
        this.discountStrategy = new NoDiscountStrategy(); // Default: no discount

        this.logger.info(`Order ${this.orderId} created at ${restaurant} - Status: Pending`);
    }

    setState(state: OrderState): void {
        const oldStateName = this.state.getStateName();
        this.state = state;
        const newStateName = state.getStateName();
        this.logger.info(`Order ${this.orderId} transitioned to: ${newStateName}`);

        this.notifyObservers(newStateName, oldStateName);
    }

    getStatus(): string {
        return this.state.getStateName();
    }

    confirm(): void {
        this.state.confirm(this);
    }

    prepare(): void {
        this.state.prepare(this);
    }

    ready(): void {
        this.state.ready(this);
    }

    complete(): void {
        this.state.complete(this);
    }

    cancel(): void {
        this.state.cancel(this);
    }

    // things related to observer
    attach(observer: OrderObserver): void {
        if (!this.observers.includes(observer)) {
            this.observers.push(observer);
            this.logger.info(`Observer attached to order ${this.orderId}`);
        }
    }

    detach(observer: OrderObserver): void {
        const index = this.observers.indexOf(observer);
        if (index > -1) {
            this.observers.splice(index, 1);
            this.logger.info(`Observer detached from order ${this.orderId}`);
        }
    }

    private notifyObservers(newState: string, oldState: string): void {
        for (const observer of this.observers) {
            observer.onStateChanged(this, newState, oldState);
        }
    }

    //related to strategy
    setDiscountStrategy(strategy: DiscountStrategy): void {
        this.discountStrategy = strategy;
        this.logger.info(`Applied discount: ${strategy.getDescription()}`);
    }

    getBasePrice(): number {
        return this.item.getPrice();
    }

    getFinalPrice(): number {
        return this.discountStrategy.applyDiscount(this.getBasePrice());
    }

    getDetails(): string {
        const basePrice = this.getBasePrice();
        const finalPrice = this.getFinalPrice();
        const discountInfo = finalPrice < basePrice
            ? ` | Discount: ${this.discountStrategy.getDescription()} | Final: $${finalPrice.toFixed(2)}`
            : '';

        return `Order #${this.orderId} | ${this.restaurant} | ${this.item.getDescription()} | Base: $${basePrice.toFixed(2)}${discountInfo} | Status: ${this.getStatus()}`;
    }

    private generateOrderId(): string {
        return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    }
}
