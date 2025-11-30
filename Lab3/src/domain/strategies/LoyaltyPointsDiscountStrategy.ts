import type { DiscountStrategy } from "./DiscountStrategy";

export class LoyaltyPointsDiscountStrategy implements DiscountStrategy {
    private points: number;
    private conversionRate: number;

    constructor(points: number, conversionRate: number = 100) {
        if (points < 0) {
            throw new Error("Points must be positive");
        }
        if (conversionRate <= 0) {
            throw new Error("Conversion rate must be positive");
        }
        this.points = points;
        this.conversionRate = conversionRate;
    }

    applyDiscount(basePrice: number): number {
        const discountAmount = this.points / this.conversionRate;
        const finalPrice = basePrice - discountAmount;
        // ensure price doesn't go below 0
        return Math.max(0, finalPrice);
    }

    getDescription(): string {
        const discountValue = (this.points / this.conversionRate).toFixed(2);
        return `${this.points} loyalty points ($${discountValue} off)`;
    }
}
