export interface DiscountStrategy {
    applyDiscount(basePrice: number): number;

    getDescription(): string;
}
