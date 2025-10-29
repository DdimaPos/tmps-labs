import { BurgerBuilder } from "../domain/builders/BurgerBuilder";
import { BurgerDirector } from "../domain/directors/BurgerDirector";
import { FastFoodFactory } from "../domain/factories/FastFoodFactory";
import { KFCFactory } from "../domain/factories/KFCFactory";
import { McDonaldsFactory } from "../domain/factories/McDonaldsFactory";
import { Burger } from "../domain/models/Burger";

class Application {
  public static main() {
    let baseFactory: FastFoodFactory;
    const userChosedKFC = true;

    if (!userChosedKFC) {
      baseFactory = new McDonaldsFactory();
    } else {
      baseFactory = new KFCFactory();
    }

    const baseMcBurger: Burger = baseFactory.createBurger()

    let newModifed: Burger = baseMcBurger.clone();
    const burgerBuilder: BurgerBuilder = new BurgerBuilder(newModifed);

    burgerBuilder
      .addIngredient("paprica")
      .addIngredient("letuce")
      .addIngredient("Joe Mama")

    newModifed = burgerBuilder.build()


    const builder: BurgerBuilder = new BurgerBuilder()
    const director: BurgerDirector = new BurgerDirector(builder);
    const managedBurger: Burger = director.createVeganBurger()
  }
}

Application.main()
