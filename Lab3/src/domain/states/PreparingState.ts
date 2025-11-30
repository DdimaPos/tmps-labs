import type { Order } from "../models/Order";
import type { OrderState } from "./OrderState";
import { ReadyState } from "./ReadyState";
import { Logger } from "../models/Logger";

export class PreparingState implements OrderState {
    private logger: Logger = Logger.getLogger();

    confirm(order: Order): void {
        throw new Error("Order is already confirmed and being prepared.");
    }

    prepare(order: Order): void {
        throw new Error("Order is already being prepared.");
    }

    ready(order: Order): void {
        this.logger.info("Order preparation complete. Transitioning to Ready state.");
        order.setState(new ReadyState());
    }

    complete(order: Order): void {
        throw new Error("Cannot complete an order that is still being prepared.");
    }

    cancel(order: Order): void {
        this.logger.info("Order cancelled from Preparing state (rare case).");
    }

    getStateName(): string {
        return "Preparing";
    }
}
