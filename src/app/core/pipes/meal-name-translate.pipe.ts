import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mealNameTranslate'
})
export class MealNameTranslatePipe implements PipeTransform {

  private mealNameTranslations: { [key: string]: string } = {
    'breakfast': 'الأفطار',
    'meal_one': 'الوجبة الاولي',
    'meal_two': 'الغداء',
    'meal_three': 'العشاء',
    'meal_four': 'الوجبة الرابعة',
    'snack_one': 'سناك 1',
    'snack_two': 'سناك 2',
  };

  transform(mealName: string): string {
    const translatedMealName = this.mealNameTranslations[mealName.toLowerCase()];
    return translatedMealName || mealName;
  }

}
