import { BurgerBuilder } from "../builders/BurgerBuilder";
import { Burger } from "../models/Burger";
import { StandartBurger } from "../models/StandartBurger";
import { FastFoodFactory } from "./FastFoodFactory";

export class McDonaldsFactory extends FastFoodFactory {
  createBurger(): Burger {
    const burger = new StandartBurger("BigMac", 'McDonalds');
    const burgerBuilder = new BurgerBuilder(burger);
    burgerBuilder.addMeat("Beef");
    burgerBuilder.addIngredient("letuce")
    burgerBuilder.addIngredient("letuce")
    burgerBuilder.addIngredient("letuce")
    burgerBuilder.addIngredient("letuce")
    burgerBuilder.addIngredient("letuce")
    return burgerBuilder.build()
  }
}
