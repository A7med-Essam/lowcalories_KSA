import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ISubscriptions } from 'src/app/shared/interfaces/profile';

export enum MealStatus {
  Pending,
  Deliveried,
  NotDelivered,
  Hold,
  Restricited,
  Canceld,
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  @Output() getDetails: EventEmitter<boolean> = new EventEmitter(false);
  @Output() DayDetails: EventEmitter<string> = new EventEmitter(false);
  @Input() plan!: ISubscriptions;
  @Input() weeks!: any;
  MealStatusEnum = MealStatus;
  constructor() {}

  ngOnInit(): void {}

  getDetailsComponent() {
    this.getDetails.emit(true);
  }

  getDayDetails(dayMeals: any) {
    this.DayDetails.emit(dayMeals);
  }
}
