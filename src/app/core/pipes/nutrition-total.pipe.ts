import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nutritionTotal'
})
export class NutritionTotalPipe implements PipeTransform {

  transform(meal: any): any[] {
    // Initialize an array to store the results
    const resultArray:any[] = [];

    // Loop through each meal
      const selectedDate = meal.date;
      const day = meal.day; // You can create a separate function to get the day of the week

      // Initialize variables to store total nutrition values
      let totalProtein = 0;
      let totalCalories = 0;
      let totalCarbs = 0;
      let totalFat = 0;

      // Calculate total nutrition values for selected meals
      meal.meals.forEach((mealItem:any) => {
        totalProtein += mealItem.mainDish.protein || 0;
        totalCalories += mealItem.mainDish.calories || 0;
        totalCarbs += mealItem.mainDish.carb || 0;
        totalFat += mealItem.mainDish.fat || 0;
      });

      // Create an object with date, day, and total nutrition values
      const resultItem = {
        date: selectedDate,
        day: day,
        totalProtein: totalProtein,
        totalCalories: totalCalories,
        totalCarbs: totalCarbs,
        totalFat: totalFat
      };

      // Add the result object to the result array
      resultArray.push(resultItem);

    return resultArray;
  }


}
