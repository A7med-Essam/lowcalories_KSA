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
        return lang === 'en' ? 'Lunch' : 'غداء';
      case 'meal_two':
        return lang === 'en' ? 'Dinner' : 'عشاء';
      case 'meal_three':
        return lang === 'en' ? 'PRE-WORKOUT' : 'وجبة ما قبل التمرين';
      case 'meal_four':
        return lang === 'en' ? 'AFTER-WORKOUT' : 'وجبة بعد التمرين';
      case 'snack_one':
        return lang === 'en' ? value : `وجبة خفيفة 1`;
      case 'snack_two':
        return lang === 'en' ? value : `وجبة خفيفة 2`;
      default:
        return value;
    }
  }
}
