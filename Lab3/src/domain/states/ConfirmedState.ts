import type { Order } from "../models/Order";
import type { OrderState } from "./OrderState";
import { PreparingState } from "./PreparingState";
import { Logger } from "../models/Logger";

export class ConfirmedState implements OrderState {
    private logger: Logger = Logger.getLogger();

    confirm(order: Order): void {
        throw new Error("Order is already confirmed.");
    }

    prepare(order: Order): void {
        this.logger.info("Order sent to kitchen. Transitioning to Preparing state.");
        order.setState(new PreparingState());
    }

    ready(order: Order): void {
        throw new Error("Cannot mark order as ready. It must be prepared first.");
    }

    complete(order: Order): void {
        throw new Error("Cannot complete an unfinished order. Please prepare first.");
    }

    cancel(order: Order): void {
        this.logger.info("Order cancelled from Confirmed state.");
    }

    getStateName(): string {
        return "Confirmed";
    }
}
