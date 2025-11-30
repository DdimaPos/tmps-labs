import type { DiscountStrategy } from "./DiscountStrategy";

export class PercentageDiscountStrategy implements DiscountStrategy {
    private percentage: number;

    constructor(percentage: number) {
        if (percentage < 0 || percentage > 100) {
            throw new Error("Percentage must be between 0 and 100");
        }
        this.percentage = percentage;
    }

    applyDiscount(basePrice: number): number {
        const discountAmount = basePrice * (this.percentage / 100);
        return basePrice - discountAmount;
    }

    getDescription(): string {
        return `${this.percentage}% off`;
    }
}
