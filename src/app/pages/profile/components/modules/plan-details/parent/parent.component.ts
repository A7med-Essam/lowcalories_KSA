import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of, Subject, takeUntil } from 'rxjs';
import { IReplacement, Meal } from 'src/app/interfaces/normal-plan.interface';
import { ProfileService } from 'src/app/services/profile.service';
import {
  FETCH_PROFILE_CHANGE_MEALS_START,
  FETCH_PROFILE_REPLACEMENT_MEALS_START,
  ProfileMealsResponse,
} from 'src/app/store/profileStore/profile.action';
import * as fromProfileSelector from 'src/app/store/profileStore/profile.selector';

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
    public translate: TranslateService,
    private _Store: Store
  ) {}
  ReplacementButtonMode$: Observable<boolean | null> = of(false);

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
    this.profileMeals = []
    this.DayDetails = e;
    this.getProfileMeals(e);
    // this._ProfileService
    //   .getPlanImages({
    //     meal_names: this.DayDetails.map((meal) => meal.mealName),
    //   })
    //   .subscribe((res) => {
    //     const imageMap = new Map(
    //       res.data.map((imageObj: any) => [imageObj.meal_name, imageObj.images])
    //     );
    //     this.DayDetails = this.DayDetails.map((dayDetail) => ({
    //       ...dayDetail,
    //       images: imageMap.get(dayDetail.mealName) || [],
    //     }));
    //   });
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

  // =================================================================================REPLACE=========================================================================
  // replaced_item_index: number = 0;
  // getReplacementMeals(item:string) {
  // const destroyed$: Subject<void> = new Subject();

  //   // this.replaced_item_index = index;
  //   this.ReplacementButtonMode$ = this._Store.select(
  //     fromProfileSelector.profileReplacementLoadingSelector
  //   );
  // this._Store.dispatch(
  //   FETCH_PROFILE_REPLACEMENT_MEALS_START({
  //     data: {
  //       dish_type: 'meal',
  //       item,
  //     },
  //   })
  // );

  // this._Store
  //   .select(fromProfileSelector.profileReplacementSelector)
  //   .pipe(takeUntil(destroyed$))
  //   .subscribe((res) => {
  //     if (res) {
  //       // if (item.is_replaced) {
  //       //   let modifiedMeals: Meal[] = JSON.parse(
  //       //     JSON.stringify(res)
  //       //   );
  //       //   modifiedMeals = modifiedMeals.filter(e => e.mainDish.meal_name_en != item.meal_name_en)
  //       //   modifiedMeals.push(this.userMealsClone[this.category_index].meals[index])
  //       //   res = modifiedMeals
  //       // }
  //       // let modifiedMeals: Meal[] = JSON.parse(JSON.stringify(res));
  //       // modifiedMeals = this.calcReplacementMeals(modifiedMeals)
  //       // res = modifiedMeals
  //       this.replacementModal = true;
  //       this.replacementMeals = res;
  //       destroyed$.next();
  //       destroyed$.complete();
  //     }
  //   });
  // }

  round(num: number): number {
    return Math.round(num);
  }
  @ViewChild('replaced_items') replaced_items!: ElementRef;

  current_replaced_item: any = null;
  toggleItems(index: number, replaced_item: Meal) {
    this.current_replaced_item = replaced_item;
    for (
      let i = 0;
      i < this.replaced_items.nativeElement.children.length;
      i++
    ) {
      this.replaced_items.nativeElement.children[
        i
      ].children[0].children[0].classList.remove('active');
      this.replaced_items.nativeElement.children[
        index
      ].children[0].children[0].classList.add('active');
    }
  }

  replacementModal: boolean = false;
  profileMeals: ProfileMealsResponse[] = [];

  getProfileMeals(meals: any[]) {
    const destroyed$: Subject<void> = new Subject();
    const extractedData = meals.map((meal) => ({
      deliveryDate: meal.deliveryDate,
      mealName: this.filterMealName(meal.mealName),
      sub_detail_id: meal.id,
    }));
    this._Store.dispatch(
      FETCH_PROFILE_REPLACEMENT_MEALS_START({
        data: extractedData,
      })
    );

    this._Store
      .select(fromProfileSelector.profileReplacementSelector)
      .pipe(takeUntil(destroyed$))
      .subscribe((res) => {
        if (res) {
          this.profileMeals = res;
          destroyed$.next();
          destroyed$.complete();
        }
      });
  }

  replacement_index: number = 0;
  getReplacementMeals(index: number) {
    this.current_replaced_item = null;
    this.replacement_index = index;
    this.replacementModal = true;
  }

  filterMealName(mealName: string): string {
    return mealName
      .replace(/\d+(GM|PCS)/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  replace() {
    if (this.current_replaced_item != null) {
      this.replacementModal = false;
      this._Store.dispatch(
        FETCH_PROFILE_CHANGE_MEALS_START({
          data: {
            changed_meal: this.getMealNameWithGrams(this.current_replaced_item),
            changed_meal_without_grams: this.current_replaced_item.meal_name,
            deliveryDate: this.DayDetails[this.replacement_index].deliveryDate,
            mealName: this.DayDetails[this.replacement_index].mealName,
            typeName: this.DayDetails[this.replacement_index].typeName,
            planName: this.plan.planName,
            planTitle: this.plan.planTitle,
            from: 'web',
            subDetail_id: this.DayDetails[this.replacement_index].id,
            subscrbtionId: this.DayDetails[this.replacement_index].subscrbtionId,
            paymentsDetailsId: this.DayDetails[this.replacement_index].paymentsDetailsId,
            mealTypeId: this.DayDetails[this.replacement_index].mealTypeId,
          },
        })
      );
      let modifiedProfileMeals = JSON.parse(
        JSON.stringify(this.profileMeals)
      );
      modifiedProfileMeals[this.replacement_index].meal_status = 'pending';
      this.profileMeals = (modifiedProfileMeals)
    }
  }

  getMealNameWithGrams(mealObject: any): string {
    const mealName = mealObject.mainDish.meal_name_en;
    const qty = mealObject.mainDish.qty;
    const unit = mealObject.mainDish.unit;
    let sideInfo = null;

    if (mealObject.sideDish) {
      sideInfo = mealObject.sideDish.map((side:any) => `${side.meal_name_en} ${side.qty}${side.unit}`)
        .join(' W/ ');
    }

    return sideInfo ? `${mealName} ${qty}${unit} W/ ${sideInfo}`: `${mealName} ${qty}${unit}`
  }
}
