import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mealUnitTranslate'
})
export class MealUnitTranslatePipe implements PipeTransform {
  private unitTranslations: { [key: string]: string } = {
    'pcs': 'قطعة',
    'gm': 'جرام'
  };

  transform(unit: string): string {
    const translatedUnit = this.unitTranslations[unit.toLowerCase()];
    return translatedUnit || unit;
  }
}
