import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { I18nService } from 'src/app/core/i18n/i18n.service';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
export enum SubscriptionStatus {
  Active,
  Expired,
  Hold,
  Restricted,
}

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.scss'],
})
export class ParentComponent implements OnInit {
  constructor(
    private _ProfileService: ProfileService,
    private _Router: Router,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.getCurrentPlan();
  }

  plan!: any;
  SubscriptionStatusEnum = SubscriptionStatus;
  weeks: any = [];
  planStatus: boolean = true;
  currentTap: number = 1;

  getCurrentPlan() {
    this._ProfileService.currentPlan.subscribe((res) => {
      if (res) {
        this.plan = res;
        this.getPlanStatus();
        this.setWeekName();
      } else {
        this._Router.navigate(['./profile/controls/2']);
      }
    });
  }

  getPlanStatus() {
    if (this.plan.status == this.SubscriptionStatusEnum.Active) {
      this.planStatus = true;
      this.currentTap = 1;
    } else {
      this.planStatus = false;
      this.currentTap = 2;
    }
  }

  toggleCalendar: boolean = false;
  getDetails(e: any) {
    this.toggleCalendar = e;
  }

  DayDetails: any[] = [];
  getDayDetails(e: any) {
    this.DayDetails = e;
    this._ProfileService
      .getPlanImages({
        meal_names: this.DayDetails.map((meal) => meal.mealName),
      })
      .subscribe((res) => {
        const imageMap = new Map(
          res.data.map((imageObj: any) => [imageObj.meal_name, imageObj.images])
        );
        this.DayDetails = this.DayDetails.map((dayDetail) => ({
          ...dayDetail,
          images: imageMap.get(dayDetail.mealName) || [],
        }));
      });
  }

  setWeekName() {
    let firstDeliveryDate: string = '';
    this.plan.subDetails.forEach((e: any) => {
      if (e.deliveryDate == this.plan.startDate) {
        firstDeliveryDate = e.deliveryDate;
      }
    });

    for (let i = 0; i < this.plan.subDetails.length; i++) {
      let counter = 0;
      if (
        new Date(this.plan.subDetails[i].deliveryDate) >=
          this.addDaysOnSpecificDate(firstDeliveryDate, counter * 7) &&
        new Date(this.plan.subDetails[i].deliveryDate) <
          this.addDaysOnSpecificDate(firstDeliveryDate, (counter + 1) * 7)
      ) {
      } else {
        counter++;
      }
      this.plan.subDetails[i].weekName = `Week ${counter + 1}`;
    }
    this.groupByDeliveryDate();
  }

  addDaysOnSpecificDate(currentDate: string, days: number) {
    var date = new Date(currentDate);
    date.setDate(date.getDate() + days);
    return date;
  }

  groupByDeliveryDate() {
    let result = this.plan.subDetails.reduce(function (r: any, a: any) {
      r[a.deliveryDate] = r[a.deliveryDate] || [];
      r[a.deliveryDate].push(a);
      return r;
    }, Object.create(null));
    this.weeks = result;
    this.getArrayOfWeeks();
  }

  getArrayOfWeeks() {
    let arrayOfWeeks: any[] = [];
    for (const [key, value] of Object.entries(this.weeks)) {
      arrayOfWeeks.push(this.weeks[`${key}`]);
    }
    this.weeks = arrayOfWeeks;
  }
}
