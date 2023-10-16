import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/services/profile.service';
import { ILoginState } from 'src/app/store/authStore/auth.reducer';
import { loginSelector } from 'src/app/store/authStore/auth.selector';
export enum SubscriptionStatus {
  Active,
  Expired,
  Hold,
  Restricted,
}
@Component({
  selector: 'app-my-plans',
  templateUrl: './my-plans.component.html',
  styleUrls: ['./my-plans.component.scss'],
})
export class MyPlansComponent implements OnInit, OnDestroy {
  login$!: Observable<ILoginState>;
  private destroyed$: Subject<void> = new Subject();

  constructor(private _ProfileService: ProfileService, _Store: Store) {
    this.login$ = _Store.select(loginSelector);
  }

  ngOnInit(): void {
    this.login$.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
      if (res.data != null) {
        this.getPlans(res.data.mobile);
      }
    });
  }
  
  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  plans: any[] = [];
  showSkeleton: boolean = true;
  SubscriptionStatusEnum = SubscriptionStatus;

  getPlans(phone: string) {
    this._ProfileService.getMyPlans(phone).subscribe(
      {
        next:(res: any) => {
          res.data && (this.plans = res.data.subscriptions);
          this.showSkeleton = false;
        },
        error:(res: any)=>{
          this.showSkeleton = false;
        }
      }
    )
  }

  setCurrentPlan(plan: any) {
    this._ProfileService.currentPlan.next(plan);
  }
}
// 0505804422