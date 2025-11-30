import type { Order } from "../models/Order";
import type { OrderState } from "./OrderState";
import { ConfirmedState } from "./ConfirmedState";
import { Logger } from "../models/Logger";

export class PendingState implements OrderState {
    private logger: Logger = Logger.getLogger();

    confirm(order: Order): void {
        this.logger.info("Order confirmed. Transitioning to Confirmed state.");
        order.setState(new ConfirmedState());
    }

    prepare(order: Order): void {
        throw new Error("Cannot prepare a pending order. Please confirm the order first.");
    }

    ready(order: Order): void {
        throw new Error("Cannot mark a pending order as ready. Please confirm and prepare first.");
    }

    complete(order: Order): void {
        throw new Error("Cannot complete a pending order. Please confirm first.");
    }

    cancel(order: Order): void {
        this.logger.info("Order cancelled from Pending state.");
        // In a real system, this might transition to CancelledState
        // For simplicity, I'll just log it
    }

    getStateName(): string {
        return "Pending";
    }
}
