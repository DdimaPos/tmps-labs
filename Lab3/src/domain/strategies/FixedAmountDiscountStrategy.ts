import type { DiscountStrategy } from "./DiscountStrategy";

export class FixedAmountDiscountStrategy implements DiscountStrategy {
    private amount: number;

    constructor(amount: number) {
        if (amount < 0) {
            throw new Error("Discount amount must be positive");
        }
        this.amount = amount;
    }

    applyDiscount(basePrice: number): number {
        const finalPrice = basePrice - this.amount;
        // ensure price doesn't go below 0
        return Math.max(0, finalPrice);
    }

    getDescription(): string {
        return `$${this.amount.toFixed(2)} off`;
    }
}
