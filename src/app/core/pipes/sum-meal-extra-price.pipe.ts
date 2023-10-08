import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sumMealExtraPrice'
})
export class SumMealExtraPricePipe implements PipeTransform {

  transform(meal: any): number {
    if (!meal || !meal.mainDish || !meal.mainDish.extra) {
      return 0;
    }

    // Calculate the total price based on protein and carb values of the main dish
    const extraProteinMain = meal.mainDish.extra.protein || 0;
    const extraCarbMain = meal.mainDish.extra.carb || 0;

    const proteinPriceMain = Math.ceil(extraProteinMain / 50) * 6;
    const carbPriceMain = Math.ceil(extraCarbMain / 50) * 2;

    // Calculate the total price for side dishes
    let totalProteinPriceSides = 0;
    let totalCarbPriceSides = 0;

    if (meal.sideDish && meal.sideDish.length > 0) {
      meal.sideDish.forEach((side:any) => {
        const extraProteinSide = side.extra.protein || 0;
        const extraCarbSide = side.extra.carb || 0;

        totalProteinPriceSides += Math.ceil(extraProteinSide / 50) * 6;
        totalCarbPriceSides += Math.ceil(extraCarbSide / 50) * 2;
      });
    }

    // Calculate the total price for the meal
    const totalPrice = proteinPriceMain + carbPriceMain + totalProteinPriceSides + totalCarbPriceSides;

    return totalPrice;
  }
}
