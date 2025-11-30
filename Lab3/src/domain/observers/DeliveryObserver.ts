import type { Order } from "../models/Order";
import type { OrderObserver } from "./OrderObserver";
import { Logger } from "../models/Logger";

export class DeliveryObserver implements OrderObserver {
    private logger: Logger = Logger.getLogger();

    onStateChanged(order: Order, newState: string, oldState: string): void {
        if (newState === "Ready") {
            const orderId = this.getOrderId(order);
            this.logger.info(`[DELIVERY] 🚗 Delivery scheduled for order #${orderId}`);
            this.logger.info(`[DELIVERY] Estimated delivery time: 15-20 minutes`);
        }

        if (newState === "Completed") {
            const orderId = this.getOrderId(order);
            this.logger.info(`[DELIVERY] 📦 Order #${orderId} delivered successfully!`);
        }
    }

    private getOrderId(order: Order): string {
        const details = order.getDetails();
        const match = details.match(/Order #([A-Z0-9-]+)/);
        return match ? match[1] : "UNKNOWN";
    }
}
