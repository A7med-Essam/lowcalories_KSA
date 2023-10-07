import { Component, OnInit } from '@angular/core';
export enum SubscriptionStatus {
  Active,
  Expired,
  Hold,
  Restricted,
}
@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss'],
})
export class PlansComponent implements OnInit {
  constructor(
    // private _PlansService: PlansService,
    // private _CalendarService: CalendarService,
    // private _AuthService: AuthService
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    // this._AuthService.currentUser.subscribe((res: IUser) => {
    //   this.getPlans(res?.mobile);
    // });
  }

  plans: any[] = [];
  showSkeleton: boolean = true;
  SubscriptionStatusEnum = SubscriptionStatus;

  getPlans(phone: string) {
    // this._PlansService
    //   .getMyPlans(phone)
    //   .subscribe((res: IProfilePlansResponse) => {
    //     res.data && (this.plans = res.data.subscriptions);
    //     this.showSkeleton = false;
    //   });
  }

  setCurrentPlan(plan: any) {
    // this._CalendarService.currentPlan.next(plan);
  }
}
