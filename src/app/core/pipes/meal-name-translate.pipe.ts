import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mealNameTranslate',
})
export class MealNameTranslatePipe implements PipeTransform {
  transform(value: string, lang: string): string {
    const lowercasedValue = value.toLowerCase();

    switch (lowercasedValue) {
      case 'breakfast':
        return lang === 'en' ? 'Breakfast' : 'فطور';
      case 'meal_one':
        return lang === 'en' ? 'Meal One' : 'وجبة أولي';
      case 'meal_two':
        return lang === 'en' ? 'Meal Two' : 'وجبة ثانية';
      case 'meal_three':
        return lang === 'en' ? 'Meal Three' : 'وجبة ثالثة';
      case 'meal_four':
        return lang === 'en' ? 'Meal Four' : 'وجبة رابعه';
      case 'snack_one':
        return lang === 'en' ? 'Snack One' : `وجبة خفيفة 1`;
      case 'snack_two':
        return lang === 'en' ? 'Snack Two' : `وجبة خفيفة 2`;
      default:
        return value;
    }
  }
}
