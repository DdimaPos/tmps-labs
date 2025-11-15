import { Logger } from "../models/Logger";
import { Burger } from "../models/Burger";
import { StandartBurger } from "../models/StandartBurger";

export class BurgerBuilder {
  burger: Burger;
  logger: Logger;

  constructor(burger?: Burger) {
    this.burger = burger || new StandartBurger();
    this.logger = Logger.getLogger()
  }

  reset(): BurgerBuilder {
    this.burger = new StandartBurger()
    return this
  }

  addMeat(type: string): BurgerBuilder {
    this.burger.meatType = type;
    this.logger.info("added meat")
    return this;
  }

  removeMeat(): BurgerBuilder {
    this.burger.meatType = null;
    this.logger.info("removed meat")
    return this;
  }

  addIngredient(ingredient: string): BurgerBuilder {
    this.burger.ingredients.add(ingredient);
    this.logger.info(`added ingredient - ${ingredient}`)
    return this;
  }
  removeIngredient(ingredient: string): BurgerBuilder {
    this.burger.ingredients.delete(ingredient);
    this.logger.info(`removed ingredient - ${ingredient}`)
    return this;
  }

  build() {
    return this.burger;
  }
}
