import type { DiscountStrategy } from "./DiscountStrategy";

export class NoDiscountStrategy implements DiscountStrategy {
    applyDiscount(basePrice: number): number {
        return basePrice;
    }

    getDescription(): string {
        return "No discount";
    }
}
