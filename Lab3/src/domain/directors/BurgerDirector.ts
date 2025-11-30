import { BurgerBuilder } from "../builders/BurgerBuilder";

export class BurgerDirector {
  private builder: BurgerBuilder;

  constructor(builder: BurgerBuilder) {
    this.builder = builder;
  }

  createVeganBurger() {
    return this.builder
      .reset()
      .addIngredient("salad")
      .addIngredient("tomatoes")
      .removeMeat()
      .build()
  }

  createChocolateBurger() {
    return this.builder
      .reset()
      .addIngredient("salad")
      .addIngredient("tomatoes")
      .addIngredient("chocolate")
      .addMeat("rabbit")
      .build()
  }

  createSpicyBurger() {
    return this.builder
      .reset()
      .addIngredient("jalapeños")
      .addIngredient("hot sauce")
      .addIngredient("pepper jack cheese")
      .addMeat("beef")
      .build()
  }

  createClassicBurger() {
    return this.builder
      .reset()
      .addIngredient("lettuce")
      .addIngredient("tomato")
      .addIngredient("onion")
      .addIngredient("pickles")
      .addMeat("beef")
      .build()
  }
}
