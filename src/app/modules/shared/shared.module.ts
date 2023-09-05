import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeekdayTranslatePipe } from 'src/app/core/pipes/weekday-translate.pipe';
import { MealUnitTranslatePipe } from 'src/app/core/pipes/meal-unit-translate.pipe';
import { I18nModule } from 'src/app/core/i18n/i18n.module';

@NgModule({
  declarations: [WeekdayTranslatePipe,MealUnitTranslatePipe],
  imports: [
    CommonModule,I18nModule
  ],
  exports:[
    WeekdayTranslatePipe,MealUnitTranslatePipe,I18nModule
  ]
})
export class SharedModule { }
