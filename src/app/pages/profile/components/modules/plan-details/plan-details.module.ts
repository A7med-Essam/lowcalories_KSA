import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanDetailsRoutingModule } from './plan-details-routing.module';
import { CalendarComponent } from './calendar/calendar.component';
import { WeeksComponent } from './weeks/weeks.component';
import { ParentComponent } from './parent/parent.component';
import { SkeletonModule } from 'primeng/skeleton';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { SidebarModule } from 'primeng/sidebar';


@NgModule({
  declarations: [
    ParentComponent,
    CalendarComponent,
    WeeksComponent,
  ],
  imports: [
    CommonModule,
    PlanDetailsRoutingModule,
    SkeletonModule,
    SharedModule,
    SidebarModule
  ]
})
export class PlanDetailsModule { }