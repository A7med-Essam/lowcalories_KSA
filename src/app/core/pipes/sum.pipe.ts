import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sum'
})
export class SumPipe implements PipeTransform {
  transform(objects: any[], propertyName: string, defaultValue: number = 0): number {
    if (!objects || objects.length === 0) {
      return defaultValue;
    }

    const sum = objects.reduce((acc, obj) => acc + (obj[propertyName] || 0), 0);
    return sum + defaultValue;
  }
}
