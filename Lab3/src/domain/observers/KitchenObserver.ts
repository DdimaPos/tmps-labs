import type { Order } from "../models/Order";
import type { OrderObserver } from "./OrderObserver";
import { Logger } from "../models/Logger";

export class KitchenObserver implements OrderObserver {
    private logger: Logger = Logger.getLogger();

    onStateChanged(order: Order, newState: string, oldState: string): void {
        if (newState === "Confirmed") {
            this.logger.info(`[KITCHEN] 🍳 New order received for preparation! Order #${this.getOrderId(order)}`);
            this.logger.info(`[KITCHEN] Items: ${order.getDetails()}`);
        }

        if (newState === "Ready") {
            this.logger.info(`[KITCHEN] ✅ Order #${this.getOrderId(order)} prepared and ready for pickup!`);
        }
    }

    private getOrderId(order: Order): string {
        // Extract order ID from details string
        const details = order.getDetails();
        const match = details.match(/Order #([A-Z0-9-]+)/);
        return match ? match[1] : "UNKNOWN";
    }
}
