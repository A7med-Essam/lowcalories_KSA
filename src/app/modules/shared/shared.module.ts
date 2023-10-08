import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeekdayTranslatePipe } from 'src/app/core/pipes/weekday-translate.pipe';
import { MealUnitTranslatePipe } from 'src/app/core/pipes/meal-unit-translate.pipe';
import { I18nModule } from 'src/app/core/i18n/i18n.module';
import { MealNameTranslatePipe } from 'src/app/core/pipes/meal-name-translate.pipe';
import { SumPipe } from 'src/app/core/pipes/sum.pipe';
import { SumExtraPipe } from 'src/app/core/pipes/sum-extra.pipe';
import { NutritionTotalPipe } from 'src/app/core/pipes/nutrition-total.pipe';

@NgModule({
  declarations: [WeekdayTranslatePipe,MealUnitTranslatePipe,MealNameTranslatePipe,SumPipe,SumExtraPipe,NutritionTotalPipe],
  imports: [
    CommonModule,I18nModule
  ],
  exports:[
    WeekdayTranslatePipe,MealUnitTranslatePipe,I18nModule,MealNameTranslatePipe,SumPipe,SumExtraPipe,NutritionTotalPipe
  ]
})
export class SharedModule { }
