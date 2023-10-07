import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { I18nService } from 'src/app/shared/i18n/i18n.service';
import { IUser } from 'src/app/shared/interfaces/Auth';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CalendarService } from 'src/app/shared/services/plans/calendar.service';
import { ProfileInfoService } from 'src/app/shared/services/profile/profile-info.service';
import { ISubDetails, ISubscriptions } from 'src/app/shared/interfaces/profile';
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
    private _AuthService: AuthService,
    private _ProfileInfoService: ProfileInfoService,
    private _I18nService: I18nService,
    private _CalendarService: CalendarService,
    private _Router: Router,
    public translate: TranslateService
  ) {
    this._I18nService.saveCurrentLang(this.translate);
  }

  ngOnInit(): void {
    this.getUser();
    this.getCurrentPlan();
  }

  Profile_content!: HTMLElement;
  @ViewChild('content') set ft0(content: any) {
    this.Profile_content = content.nativeElement;
  }

  scrollToContent = () => {
    this.Profile_content.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  };

  updateProfileImage(image: File) {
    this._ProfileInfoService.updateProfileImage(image).subscribe((res) => {
      this._AuthService.saveUser(res.data);
    });
  }

  user!: IUser;
  getUser() {
    this._AuthService.currentUser.subscribe((res: any) => {
      this.user = res;
    });
  }

  importImage(userImage: any) {
    let input: any = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    let base64: any = null;
    input.onchange = () => {
      let files = Array.from(input.files);
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
          if (e.target) {
            base64 = e.target;
            userImage.src = e.target.result;
          }
        };
        reader.readAsDataURL(input.files[0]);
        setTimeout(() => {
          if (base64) {
            this.updateProfileImage(base64.result);
          }
        }, 500);
      }
    };
    input.click();
  }

  logout() {
    this._AuthService.logOut();
  }
  // =============================================================================================
  plan!: ISubscriptions;
  SubscriptionStatusEnum = SubscriptionStatus;
  weeks: any = [];
  planStatus: boolean = true;
  currentTap: number = 1;

  getCurrentPlan() {
    this._CalendarService.currentPlan.subscribe((res) => {
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

  DayDetails: ISubDetails[] = [];
  getDayDetails(e: any) {
    this.DayDetails = e;
  }

  setWeekName() {
    let firstDeliveryDate: string = '';
    this.plan.subDetails.forEach((e) => {
      if (e.deliveryDate == this.plan.startDate) {
        firstDeliveryDate = e.deliveryDate;
      }
    });

    for (let i = 0; i < this.plan.subDetails.length; i++) {
      let counter = 0;
      // if (
      //   this.plan.subDetails[i].deliveryDate >=
      //     firstDeliveryDate + counter * 7 &&
      //   this.plan.subDetails[i].deliveryDate <
      //     firstDeliveryDate + (counter + 1) * 7
      // ) {
      // } else {
      //   counter++;
      // }
      // this.plan.subDetails[i].weekName = `Week ${counter + 1}`;
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
    let result = this.plan.subDetails.reduce(function (r, a) {
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
