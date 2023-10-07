import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nModule } from 'src/app/core/i18n/i18n.module';
import { PlanDetailsRoutingModule } from './plan-details-routing.module';
import { CalendarComponent } from './calendar/calendar.component';
import { WeeksComponent } from './weeks/weeks.component';
import { ParentComponent } from './parent/parent.component';
import { SkeletonModule } from 'primeng/skeleton';


@NgModule({
  declarations: [
    ParentComponent,
    CalendarComponent,
    WeeksComponent,
  ],
  imports: [
    CommonModule,
    PlanDetailsRoutingModule,
    I18nModule,
    SkeletonModule
  ]
})
export class PlanDetailsModule { }