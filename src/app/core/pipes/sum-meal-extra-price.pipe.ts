import { Pipe, PipeTransform } from '@angular/core';
import { Meal } from 'src/app/interfaces/normal-plan.interface';

@Pipe({
  name: 'sumMealExtraPrice'
})
export class SumMealExtraPricePipe implements PipeTransform {

  transform(meal: Meal, programExtra:{carb:number,protein:number}): number {
    if (!meal || !meal.mainDish || !meal.mainDish.extra) {
      return 0;
    }

    // Calculate the total price based on protein and carb values of the main dish
    const extraProteinMain = meal.mainDish.extra.protein || 0;
    const extraCarbMain = meal.mainDish.extra.carb || 0;

    const proteinPriceMain = Math.ceil(extraProteinMain / (meal.mainDish.unit.toLowerCase() == 'gm' ? 50 : 1)) * programExtra.protein;
    const carbPriceMain = Math.ceil(extraCarbMain / (meal.mainDish.unit.toLowerCase() == 'gm' ? 50 : 1)) * programExtra.carb;

    // Calculate the total price for side dishes
    let totalProteinPriceSides = 0;
    let totalCarbPriceSides = 0;

    if (meal.sideDish && meal.sideDish.length > 0) {
      meal.sideDish.forEach((side) => {
        const extraProteinSide = side.extra.protein || 0;
        const extraCarbSide = side.extra.carb || 0;

        totalProteinPriceSides += Math.ceil(extraProteinSide / (side.unit.toLowerCase() == 'gm' ? 50 : 1)) * programExtra.protein;
        totalCarbPriceSides += Math.ceil(extraCarbSide / (side.unit.toLowerCase() == 'gm' ? 50 : 1)) * programExtra.carb;
      });
    }

    // Calculate the total price for the meal
    const totalPrice = proteinPriceMain + carbPriceMain + totalProteinPriceSides + totalCarbPriceSides;

    return totalPrice;
  }
}
