import type { Order } from "../models/Order";

export interface OrderObserver {
    onStateChanged(order: Order, newState: string, oldState: string): void;
}
