import type { Order } from "../models/Order";
import type { OrderObserver } from "./OrderObserver";
import { Logger } from "../models/Logger";

export class CustomerNotificationObserver implements OrderObserver {
    private logger: Logger = Logger.getLogger();

    onStateChanged(order: Order, newState: string, oldState: string): void {
        const orderId = this.getOrderId(order);

        switch (newState) {
            case "Confirmed":
                this.logger.info(`[CUSTOMER] 📧 "Your order #${orderId} has been confirmed!"`);
                break;
            case "Preparing":
                this.logger.info(`[CUSTOMER] 👨‍🍳 "Your order #${orderId} is being prepared..."`);
                break;
            case "Ready":
                this.logger.info(`[CUSTOMER] 🔔 "Your order #${orderId} is ready for pickup!"`);
                break;
            case "Completed":
                this.logger.info(`[CUSTOMER] ✨ "Thank you! Order #${orderId} completed. Enjoy your meal!"`);
                break;
        }
    }

    private getOrderId(order: Order): string {
        const details = order.getDetails();
        const match = details.match(/Order #([A-Z0-9-]+)/);
        return match ? match[1] : "UNKNOWN";
    }
}
