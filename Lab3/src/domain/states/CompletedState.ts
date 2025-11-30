import type { Order } from "../models/Order";
import type { OrderState } from "./OrderState";

export class CompletedState implements OrderState {
    confirm(order: Order): void {
        throw new Error("Order is already completed.");
    }

    prepare(order: Order): void {
        throw new Error("Order is already completed.");
    }

    ready(order: Order): void {
        throw new Error("Order is already completed.");
    }

    complete(order: Order): void {
        throw new Error("Order is already completed.");
    }

    cancel(order: Order): void {
        throw new Error("Cannot cancel a completed order.");
    }

    getStateName(): string {
        return "Completed";
    }
}
