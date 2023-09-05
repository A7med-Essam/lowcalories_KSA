import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'weekdayTranslate'
})
export class WeekdayTranslatePipe implements PipeTransform {
  private weekdayTranslations: { [key: string]: string } = {
    'SUNDAY': 'الأحد',
    'MONDAY': 'الاثنين',
    'TUESDAY': 'الثلاثاء',
    'TUSEDAY': 'الثلاثاء',
    'WEDNESDAY': 'الأربعاء',
    'THURSDAY': 'الخميس',
    'FRIDAY': 'الجمعة',
    'SATURDAY': 'السبت'
  };

  transform(weekday: string): string {
    const translatedWeekday = this.weekdayTranslations[weekday.toUpperCase()];
    return translatedWeekday || weekday;
  }
}
