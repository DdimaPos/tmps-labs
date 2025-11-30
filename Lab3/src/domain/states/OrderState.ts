import type { Order } from "../models/Order";

export interface OrderState {
    confirm(order: Order): void;

    prepare(order: Order): void;

    ready(order: Order): void;

    complete(order: Order): void;

    cancel(order: Order): void;

    getStateName(): string;
}

