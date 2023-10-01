import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sumExtra'
})
export class SumExtraPipe implements PipeTransform {

  transform(extraDetails: any): number {
    if (!extraDetails || !extraDetails.carb || !extraDetails.protein) {
      return 0; // Return 0 if the data is missing or invalid
    }

    const carbTotalPrice = extraDetails.carb.total_price || 0;
    const proteinTotalPrice = extraDetails.protein.total_price || 0;

    // Calculate the sum of total_price values
    return carbTotalPrice + proteinTotalPrice;
  }

}
