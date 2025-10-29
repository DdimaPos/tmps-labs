import { BurgerBuilder } from "../builders/BurgerBuilder";
import { Burger } from "../models/Burger";
import { StandartBurger } from "../models/StandartBurger";
import { FastFoodFactory } from "./FastFoodFactory";

export class KFCFactory extends FastFoodFactory {
  createBurger(): Burger {
    const burger = new StandartBurger("BigKFC", "KFC");
    const burgerBuilder = new BurgerBuilder(burger);
    burgerBuilder.addMeat("Beef");
    burgerBuilder.addIngredient("unique KFC sauce")
    return burgerBuilder.build();
  }
}
