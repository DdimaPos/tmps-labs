import type { Order } from "../models/Order";
import type { OrderObserver } from "./OrderObserver";
import { Logger } from "../models/Logger";

export class AnalyticsObserver implements OrderObserver {
    private logger: Logger = Logger.getLogger();
    private stateTransitions: number = 0;
    private completedOrders: number = 0;

    onStateChanged(order: Order, newState: string, oldState: string): void {
        this.stateTransitions++;

        if (newState === "Completed") {
            this.completedOrders++;
            const revenue = order.getFinalPrice();
            this.logger.info(`[ANALYTICS] 📊 Order completed | Total completed: ${this.completedOrders} | Revenue: $${revenue.toFixed(2)}`);
        }

        this.logger.info(`[ANALYTICS] 📈 State transition: ${oldState} → ${newState} | Total transitions: ${this.stateTransitions}`);
    }

    getMetrics() {
        return {
            stateTransitions: this.stateTransitions,
            completedOrders: this.completedOrders
        };
    }
}
