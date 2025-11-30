import { BurgerBuilder } from "../builders/BurgerBuilder";
import { Burger } from "../models/Burger";
import { StandartBurger } from "../models/StandartBurger";
import { FastFoodFactory } from "./FastFoodFactory";

export class McDonaldsFactory extends FastFoodFactory {
  createBurger(): Burger {
    const burger = new StandartBurger("BigMac", 'McDonalds', 5.99);
    const burgerBuilder = new BurgerBuilder(burger);
    burgerBuilder.addMeat("Beef");
    burgerBuilder.addIngredient("lettuce")
    burgerBuilder.addIngredient("special sauce")
    burgerBuilder.addIngredient("pickles")
    burgerBuilder.addIngredient("onions")
    burgerBuilder.addIngredient("sesame seed bun")
    return burgerBuilder.build()
  }
}
