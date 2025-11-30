import type { Order } from "../models/Order";
import type { OrderState } from "./OrderState";
import { CompletedState } from "./CompletedState";
import { Logger } from "../models/Logger";

export class ReadyState implements OrderState {
    private logger: Logger = Logger.getLogger();

    confirm(order: Order): void {
        throw new Error("Order is already confirmed and ready.");
    }

    prepare(order: Order): void {
        throw new Error("Order is already prepared.");
    }

    ready(order: Order): void {
        throw new Error("Order is already marked as ready.");
    }

    complete(order: Order): void {
        this.logger.info("Order picked up/delivered. Transitioning to Completed state.");
        order.setState(new CompletedState());
    }

    cancel(order: Order): void {
        throw new Error("Cannot cancel an order that is already ready for pickup/delivery.");
    }

    getStateName(): string {
        return "Ready";
    }
}
