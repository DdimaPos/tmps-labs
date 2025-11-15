import { BurgerBuilder } from "../builders/BurgerBuilder";
import { Burger } from "../models/Burger";
import { StandartBurger } from "../models/StandartBurger";
import { FastFoodFactory } from "./FastFoodFactory";

export class KFCFactory extends FastFoodFactory {
  createBurger(): Burger {
    const burger = new StandartBurger("Zinger Burger", "KFC", 6.49);
    const burgerBuilder = new BurgerBuilder(burger);
    burgerBuilder.addMeat("Crispy Chicken");
    burgerBuilder.addIngredient("unique KFC sauce")
    burgerBuilder.addIngredient("lettuce")
    burgerBuilder.addIngredient("mayo")
    return burgerBuilder.build();
  }
}
